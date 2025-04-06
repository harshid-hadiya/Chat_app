import React, { useState, useEffect } from "react";
import "./groupchatpopup.css";
import axios from "axios";
import { getContext } from "../../Context/Context";

const GroupPopup = ({ isVisible, onClose }) => {
  const { user, changeAdd, setchangeAdd, right, setrightusers } = getContext();
  const [groupName, setGroupName] = useState(right?.chatName || ""); // Pre-fill group name
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(right?.users || []); // Pre-fill selected users
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if current user is the group admin
  useEffect(() => {
    if (right && isVisible) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setCurrentUser(userInfo);

      // Check if current user is the group admin using user_id
      console.log("User Info:", userInfo);
      console.log("User ID (user_id):", userInfo.user_id);
      console.log("Group Admin:", right.groupAdmin);
      console.log("Admin ID:", right.groupAdmin._id);

      // Use strict equality and ensure both values are strings for comparison
      const userId = String(userInfo.user_id);
      const adminId = String(right.groupAdmin._id);

      console.log("User ID (string):", userId);
      console.log("Admin ID (string):", adminId);
      console.log("Is admin?", userId === adminId);

      setIsAdmin(userId === adminId);

      // Set group name and users when popup opens
      setGroupName(right.chatName || "");

      // Filter out the current user from the displayed users
      const filteredUsers = right.users.filter(
        (user) => user._id !== userInfo.user_id
      );
      setSelectedUsers(filteredUsers);
    }
  }, [isVisible, right]);

  // Reset states when popup opens/closes
  useEffect(() => {
    if (!isVisible) {
      setSearchTerm("");
      setSearchResults([]);
    }
  }, [isVisible]);

  // Effect to search users whenever searchTerm changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim() || !isAdmin) {
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
  }, [searchTerm, isAdmin]);

  if (!isVisible) return null;

  // Add user to selected list (admin only)
  const addUser = async (user) => {
    if (!isAdmin) return;
    if (selectedUsers.some((u) => u._id === user._id)) return;

    setSelectedUsers([...selectedUsers, user]);
    setSearchTerm("");
    setSearchResults([]);

    const data = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: `Bearer ${data.jsonToken}`,
      },
    };

    try {
      const response = await axios.put(
        "https://chat-app-umd8.onrender.com/api/chat/addMemb",
        { groupId: right._id, memberId: user._id },
        config
      );
      console.log(response.data);
      setrightusers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Remove user from selected list (admin only)
  const removeUser = async (userId) => {
    if (!isAdmin) return;

    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));

    const data = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        Authorization: `Bearer ${data.jsonToken}`,
      },
    };

    try {
      const response = await axios.put(
        `https://chat-app-umd8.onrender.com/api/chat/removeMemb`,
        { groupId: right._id, memberId: userId },
        config
      );
      console.log(response.data);
      setrightusers(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Rename the group (admin only)
  const handleRenameGroup = async () => {
    if (!isAdmin || !groupName.trim()) {
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.jsonToken}`,
        },
      };

      const { data } = await axios.put(
        "https://chat-app-umd8.onrender.com/api/chat/rename",
        {
          name: groupName,
          groupId: right._id,
        },
        config
      );
      setrightusers(data);
      setchangeAdd(!changeAdd);
      onClose();
    } catch (error) {
      console.error("Error renaming group:", error);
    }
  };

  // Leave the group (for non-admin users)
  const handleLeaveGroup = async () => {
    if (!currentUser) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.jsonToken}`,
        },
      };

      // Using the remove member endpoint to remove the current user
      await axios.put(
        `https://chat-app-umd8.onrender.com/api/chat/removeMemb`,
        {
          groupId: right._id,
          memberId: currentUser.user_id,
        },
        config
      );

      // Close the popup and refresh chat list
      setchangeAdd(!changeAdd);
      onClose();
    } catch (error) {
      console.error("Error leaving group:", error);
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

        <h2>{right.chatName}</h2>

        <div className="group-form">
          {/* Display admin status indicator or error message */}
          {!right.groupAdmin ? (
            <div className="admin-status-message">
              <p>Group admin information is not available.</p>
            </div>
          ) : isAdmin ? (
            <div className="admin-status-message">
              <p>You are the admin of this group.</p>
              <p className="debug-info">
                Your ID: {currentUser?.user_id} | Admin ID:{" "}
                {right.groupAdmin._id}
              </p>
            </div>
          ) : (
            <div className="admin-status-message">
              <p>Admin: {right.groupAdmin.name || "Unknown"}</p>
              <p className="debug-info">
                Your ID: {currentUser?.user_id} | Admin ID:{" "}
                {right.groupAdmin._id}
              </p>
            </div>
          )}

          {isAdmin ? (
            <>
              <div className="group-name-container">
                <input
                  type="text"
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="group-name-input"
                />
                <button onClick={handleRenameGroup} className="update-name-btn">
                  Update
                </button>
              </div>

              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search Users to Add"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </>
          ) : (
            <div className="group-info">
              <p className="group-members-title">Group Members:</p>
            </div>
          )}

          {/* Display group members */}
          <div className="selected-users">
            {selectedUsers.map((user) => (
              <div key={user._id} className="user-badge">
                <span>{user.name}</span>
                {isAdmin && (
                  <button
                    onClick={() => removeUser(user._id)}
                    className="remove-user-btn"
                    title="Remove user"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Display search results - only for admin */}
          {isAdmin && (
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
          )}

          {/* Admin actions - now we only need the Leave Group button as the Update button is moved */}
          {!isAdmin && (
            <button onClick={handleLeaveGroup} className="leave-group-btn">
              Leave Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPopup;
