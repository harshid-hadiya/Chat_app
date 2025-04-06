import React, { useState, useEffect, useRef } from "react";
import "./message.css";
import Leftmessage from "../LeftAndRight/Leftmessage";
import RIghtmessage from "../LeftAndRight/RIghtmessage";
import axios from "axios";
import { getContext } from "../../Context/Context";
import UserProfilePopup from "./UserProfilePopup";

const Message = () => {
  const { user, right, notification, setNotification, socket } = getContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messageContainerRef = useRef(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfilePopupVisible, setIsProfilePopupVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIstyping] = useState(false);
  const SERVER_URL = "http://localhost:8900";

  // Join group and listen for messages
  useEffect(() => {
    if (!user || !right) return;

    // Join the selected chat room
    socket.joinChatRoom(right._id);

    // Handle incoming messages
    const handleMessage = (newdata) => {
      if (newdata.chat._id === right._id) {
        setMessages((prevMessages) => [...prevMessages, newdata]);
      } else {
        setNotification((prevdata) => [...prevdata, newdata]);
      }
    };

    // Listen for new messages
    socket.onNewMessage(handleMessage);

    return () => {
      socket.offNewMessage(handleMessage);
    };
  }, [right, user]);

  // Fetch messages when `right` (chat) changes
  useEffect(() => {
    if (!right || !right._id) return;

    fetchMessages();

    // Handle typing indicators
    const handleTyping = (id) => {
      if (id === right._id) setTyping(true);
    };

    const handleStopTyping = (id) => {
      if (id === right._id) setTyping(false);
    };

    socket.onTyping(handleTyping);
    socket.onStopTyping(handleStopTyping);

    return () => {
      socket.offTyping(handleTyping);
      socket.offStopTyping(handleStopTyping);
    };
  }, [right]);

  // Fetch messages from API
  const fetchMessages = async () => {
    if (!right || !right._id) return;

    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.jsonToken}`,
        },
      };

      const { data } = await axios.get(
        `${SERVER_URL}/api/message/${right._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  // Send new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.jsonToken}`,
        },
      };

      const { data } = await axios.post(
        `${SERVER_URL}/api/message`,
        { content: newMessage, chat: right._id },
        config
      );

      setNewMessage("");
      socket.sendStopTypingStatus(right._id);
      setMessages((prevMessages) => [...prevMessages, data]);

      // Send the message through socket
      socket.sendMessage(data);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Profile Popup Handlers
  const handleProfileClick = (profileData) => {
    setSelectedProfile(profileData);
    setIsProfilePopupVisible(true);
    document.body.style.overflow = "hidden";
  };

  const closeProfilePopup = () => {
    setIsProfilePopupVisible(false);
    setSelectedProfile(null);
    document.body.style.overflow = "auto";
  };

  const handlerinputchange = (e) => {
    setNewMessage(e.target.value);

    socket.sendTypingStatus(right._id);

    const previousTime = new Date().getTime();
    setTimeout(() => {
      const now = new Date().getTime();
      let diff = now - 4000;
      if (diff >= 4000) {
        socket.sendStopTypingStatus(right._id);
      }
    }, 4000);
  };

  return (
    <div className="messagebox">
      <div className="wrapperofmessage" ref={messageContainerRef}>
        {loading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : (
          <div className="message-container">
            {messages.length === 0 ? (
              <div className="no-messages">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg._id}>
                  {msg.sender._id === user.user_id ? (
                    <RIghtmessage message={msg.content} time={msg.createdAt} />
                  ) : (
                    <Leftmessage
                      message={msg.content}
                      time={msg.createdAt}
                      sender={msg.sender}
                      onProfileClick={handleProfileClick}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        )}
        {typing && <Leftmessage only={true} />}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => handlerinputchange(e)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="message-input"
        />
        <button className="send-button" onClick={handleSendMessage}>
          <img src="/assets/send.png" alt="Send" />
        </button>
      </div>

      {/* User Profile Popup */}
      <UserProfilePopup
        isVisible={isProfilePopupVisible}
        onClose={closeProfilePopup}
        user={selectedProfile}
      />
    </div>
  );
};

export default Message;
