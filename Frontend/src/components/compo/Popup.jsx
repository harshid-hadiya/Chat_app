import React from "react";
import "./popup.css";

const Popup = ({ isVisible, onClose ,pic,name,email}) => {
  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <div className="popup-body">
          <img
            className="profile-image"
            src={pic}
            alt="Profile"
          />
          <h3>{name}</h3>
          <p>{email}</p>
        </div>
      </div>
    </div>
  );
};

export default Popup;
