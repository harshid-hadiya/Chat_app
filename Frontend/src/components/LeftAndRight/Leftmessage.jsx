import React from "react";
import "./leftmessage.css";
import { format } from "timeago.js";

const Leftmessage = ({
  message = "Hello how are you?",
  time,
  sender,
  onProfileClick,
}) => {
  // Format the time using timeago.js library
  const formattedTime = time ? format(new Date(time)) : "Just now";
   if (message=="Hello how are you?") {
    return (<div className="leftmessageofthat">
      
      <div className="messageofleft">
      <span className="color">Typing </span><div className="dots"><span> . </span><span> . </span> <span> . </span></div>
      </div>
    </div>)
   }
  return (
    <div className="leftmessageofthat">
      <div
        className="message-avatar"
        onClick={() => onProfileClick && sender && onProfileClick(sender)}
        style={{ cursor: onProfileClick ? "pointer" : "default" }}
        title={onProfileClick ? `View ${sender?.name}'s profile` : ""}
      >
        <img
          src={sender?.profilePic || "/src/assets/avatar.png"}
          alt={sender?.name || "User"}
        />
      </div>
      <div className="messageofleft">
        {message}
        <span className="message-time">{formattedTime}</span>
      </div>
    </div>
  );
};

export default Leftmessage;
