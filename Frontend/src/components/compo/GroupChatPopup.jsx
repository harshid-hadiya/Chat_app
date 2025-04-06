import React, { useState, useEffect } from "react";
import "./groupchatpopup.css";
import axios from "axios";

const GroupChatPopup = ({ isVisible, onClose, onCreate }) => {
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reset states when popup opens/closes
  useEffect(() => {
    if (!isVisible) {
      setGroupName("");
      setSearchTerm("");
      setSearchResults([]);
      setSelectedUsers([]);
    }
  }, [isVisible]);

  // Effect to search users whenever searchTerm changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.jsonToken}`,
          },
        };

        const { data } = await axios.get(
          `https://chat-app-umd8.onrender.com/api/user/searc?search=${searchTerm}`,
          config
        );

        setSearchResults(data);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (!isVisible) return null;

  // Add user to selected list
  const addUser = (user) => {
    if (selectedUsers.some((u) => u._id === user._id)) return;
    setSelectedUsers([...selectedUsers, user]);
    setSearchTerm("");
    setSearchResults([]);
  };

  // Remove user from selected list
  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  // Create the group chat
  const handleSubmit = async () => {
    if (!groupName.trim() || selectedUsers.length < 1) {
      alert("Please enter a group name and select at least one user");
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.jsonToken}`,
        },
      };

      const { data } = await axios.post(
        "https://chat-app-umd8.onrender.com/api/chat/group",
        {
          name: groupName,
          users: selectedUsers.map((user) => user._id),
        },
        config
      );

      if (onCreate) onCreate(data);
      onClose();
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  };

  return (
    <div
      className="group-popup-overlay"
      onClick={(e) => {
        // Close the popup if the overlay (but not its children) is clicked
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="group-popup-content">
        <button className="group-close-btn" onClick={onClose}>
          X
        </button>

        <h2>Create New Group Chat</h2>

        <div className="group-form">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="group-name-input"
          />

          <div className="search-container">
            <input
              type="text"
              placeholder="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Display selected users */}
          <div className="selected-users">
            {selectedUsers.map((user) => (
              <div key={user._id} className="user-badge">
                <span>{user.name}</span>
                <button
                  onClick={() => removeUser(user._id)}
                  className="remove-user-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Display search results */}
          <div className="search-results">
            {loading ? (
              <div className="loading">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  className="user-result"
                  onClick={() => addUser(user)}
                >
                  <img
                    src={user.profilePic || "/src/assets/avatar.png"}
                    alt={user.name}
                    className="user-pic"
                  />
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              ))
            ) : searchTerm.trim() ? (
              <div className="no-results">No users found</div>
            ) : null}
          </div>

          <button onClick={handleSubmit} className="create-group-btn">
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatPopup;
