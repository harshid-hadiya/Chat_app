import React from "react";
import "./rightmessage.css";
import { getContext } from "../../Context/Context.jsx";
import { format } from "timeago.js";

const RIghtmessage = ({ message = "", time }) => {
  const { user } = getContext();

  // Format the time using timeago.js library
  const formattedTime = time ? format(new Date(time)) : "Just now";

  return (
    <div className="rightmessageofthat">
      <div className="messageofright">
        {message}
        <span className="message-time">{formattedTime}</span>
      </div>
      <div className="message-avatar">
        <img src={user?.pic || "/src/assets/avatar.png"} alt="User" />
      </div>
    </div>
  );
};

export default RIghtmessage;
