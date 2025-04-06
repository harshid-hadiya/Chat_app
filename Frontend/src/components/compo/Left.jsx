import React, { useEffect, useState } from "react";
import "./left.css";
import User from "./User";
import axios from "axios";
import { getContext } from "../../Context/Context";
import GroupChatPopup from "./GroupChatPopup";

const Left = () => {
  const [current, setcurrent] = useState([]);
  const {
    user,
    changeAdd,
    setchangeAdd,
    right,
    setrightusers,
    notification,
    setNotification,
  } = getContext();
  const [isGroupPopupVisible, setIsGroupPopupVisible] = useState(false);
  const [isMobileActive, setIsMobileActive] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1113);

  // Helper function to get the other user in a 1-on-1 chat
  const getChatPartner = (chat) => {
    if (chat.isGroupChat)
      return { name: chat.chatName, email: "", profilePic: "" };

    // Find the other user (not the current user) in the chat
    const chatPartner = chat.users.find(
      (chatUser) => chatUser._id !== user?.user_id
    );

    // Fallback to first user that's not at index 0 if for some reason we can't find by ID
    return (
      chatPartner ||
      chat.users.find((u) => u) || {
        name: "Unknown",
        email: "",
        profilePic: "",
      }
    );
  };

  function handlerNewGroup() {
    // Ensure body doesn't scroll when popup is open
    document.body.style.overflow = "hidden";
    setIsGroupPopupVisible(true);
  }

  function handleronclick(id, chat) {
    console.log(id, chat);
    setrightusers(chat);

    if (window.innerWidth <= 1113) {
      setIsMobileActive(false);
    }
  }

  const toggleMobileSidebar = () => {
    setIsMobileActive(!isMobileActive);
  };

  const handleOverlayClick = () => {
    setIsMobileActive(false);
  };

  const handleGroupCreated = (newGroup) => {
    setcurrent([newGroup, ...current]);
    setchangeAdd(!changeAdd);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1113);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobileActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileActive]);

  useEffect(() => {
    const fetchData = async () => {
      const data = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${data.jsonToken}`,
        },
      };
      try {
        const response = await axios.get(
          `https://chat-app-umd8.onrender.com/api/chat/`,
          config
        );
        console.log(response.data);
        setcurrent(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [changeAdd]);

  return (
    <>
      {/* Overlay for mobile sidebar */}
      <div
        className={`sidebar-overlay ${isMobileActive ? "active" : ""}`}
        onClick={handleOverlayClick}
      ></div>

      <div className={`leftcontainer ${isMobileActive ? "active" : ""}`}>
        {/* Only show close button on mobile */}
        {isMobileView && (
          <button className="close-sidebar" onClick={toggleMobileSidebar}>
            ×
          </button>
        )}

        <div className="Mychats">
          <span>My Chats</span>
          <button
            onClick={handlerNewGroup}
            className="new-group-btn"
            aria-label="Create new group chat"
          >
            New Group Chat
          </button>
        </div>

        <div className="chat-user-container">
          {current.length > 0 ? (
            current.map((chat) => {
              if (chat.users.length < 2) return null;

              // Get the chat partner or group info
              const partnerInfo = getChatPartner(chat);

              return (
                <User
                  key={chat._id}
                  name={partnerInfo.name || "Unknown user"}
                  email={
                    chat.isGroupChat
                      ? ""
                      : (chat.latestMessage?.sender._id != user.user_id
                          ? chat.latestMessage?.content
                          : `You:${chat.latestMessage?.content}`) || ""
                  }
                  pic={chat.isGroupChat ? "" : partnerInfo.profilePic || ""}
                  isGroupChat={chat.isGroupChat}
                  onClick1={() => handleronclick(chat._id, chat)}
                  chatId={chat._id}
                />
              );
            })
          ) : (
            <div className="no-chats">No chats available</div>
          )}
        </div>

        <GroupChatPopup
          isVisible={isGroupPopupVisible}
          onClose={() => {
            setIsGroupPopupVisible(false);
            document.body.style.overflow = "auto";
          }}
          onCreate={handleGroupCreated}
        />
      </div>

      <button
        className="mobile-toggle"
        onClick={toggleMobileSidebar}
        aria-label="Open chat menu"
        title="Open chat menu"
      >
        ☰
      </button>
    </>
  );
};

export default Left;
