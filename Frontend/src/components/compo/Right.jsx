import React, { useState } from "react";
import "./right.css";
import Message from "./Message";
import Popup from "./Popup";
import { getContext } from "../../Context/Context";
import GroupPopup from "./GroupPopup";

const Right = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isGroupPopupVisible, setIsGroupPopupVisible] = useState(false);
  const { right, user } = getContext();

  const getChatPartner = (chat) => {
    if (!chat) {
      return;
    }
    console.log("users");

    console.log(chat.users);

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

  function handlerSee() {
    if (right) {
      if (right.isGroupChat) {
        // Debug the group chat object
        console.log("Opening group chat popup with data:", right);
        console.log("Group admin details:", right.groupAdmin);

        // Check if the group admin info is available
        if (!right.groupAdmin) {
          console.error("Warning: Group admin information is missing!");
        }

        setIsGroupPopupVisible(true);
      } else {
        setIsPopupVisible(true);
      }
    }
  }

  function handleClosePopup() {
    setIsPopupVisible(false);
    setIsGroupPopupVisible(false);
  }

  const partenerinfo = getChatPartner(right);
  return (
    <div className="rightcontainer">
      <div className="right-header">
        <span className="chat-name">
          {right.isGroupChat ? right.chatName : partenerinfo?.name}
        </span>
        {right && (
          <button
            className="eye-button"
            onClick={handlerSee}
            aria-label="View profile or group info"
            title={right.isGroupChat ? "View group info" : "View profile"}
          >
            <img src="/assets/eye.png" alt="View" />
          </button>
        )}
      </div>

      {right ? (
        <Message />
      ) : (
        <div className="no-chat-selected">Select a chat to start messaging</div>
      )}

      {/* User Popup for one-on-one chat */}
      {right && !right.isGroupChat && (
        <Popup
          isVisible={isPopupVisible}
          name={partenerinfo.name || "Name unavailable"}
          email={partenerinfo.email || "Email unavailable"}
          pic={partenerinfo.profilePic || "/src/assets/avatar.png"}
          onClose={handleClosePopup}
        />
      )}

      {/* Group Popup for group chats */}
      {right && right.isGroupChat && (
        <GroupPopup
          isVisible={isGroupPopupVisible}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Right;
