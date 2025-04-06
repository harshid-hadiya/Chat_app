import React from "react";
import "./groupchatpopup.css"; // Reusing similar styles from the group popup

const UserProfilePopup = ({ isVisible, onClose, user }) => {
  if (!isVisible || !user) return null;

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
      <div className="user-profile-popup">
        <button className="group-close-btn" onClick={onClose}>
          X
        </button>

        <div className="user-profile-content">
          <div className="user-profile-pic">
            <img
              src={user.profilePic || "/src/assets/avatar.png"}
              alt={user.name}
            />
          </div>

          <h2>{user.name || "User"}</h2>

          <div className="user-profile-details">
            <div className="user-profile-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">
                {user.email || "Not available"}
              </span>
            </div>

            {user._id && (
              <div className="user-profile-item">
                <span className="detail-label">User ID:</span>
                <span className="detail-value user-id">{user._id}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePopup;
