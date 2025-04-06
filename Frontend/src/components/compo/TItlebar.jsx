import "./titlebar.css";
import { useState, useEffect, useRef } from "react";
import { getContext } from "../../Context/Context.jsx";
import { useNavigate } from "react-router-dom";

const TItlebar = ({ handledrawer }) => {
  const { user, setUser, notification, setrightusers, setNotification } =
    getContext();
  const [img, setimg] = useState("");
  const [email, setEmail] = useState("");
  const [name, setname] = useState("");
  const [menu, setMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    console.log(user);
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    // Add event listener if dropdown is open
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  async function call() {
    const userdata = await localStorage.getItem("userInfo");
    if (userdata) {
      const data = JSON.parse(userdata);
      console.log(data);
      
      setUser(data);
      setimg(data.pic);
      setEmail(data.user_email);
      setname(data.user_name);
    } else {
      console.log("oki");
      navigate("/");
      console.log("Refresh");
    }
  }

  useEffect(() => {
    call();
  }, []);

  const handlerOfprofile = () => {
    console.log("oki");
    setShowProfile(true);
  };

  const handlerOfLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toggleNotifications = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowNotifications(!showNotifications);
    // Close other menus if open
    if (menu) setMenu(false);
  };

  const handleNotificationClick = (notifi) => {
    // Set the selected chat when clicking on a notification
    if (notifi.chat) {
      setrightusers(notifi.chat);

      // Remove this notification and any other notifications from the same chat
      if (notification && notification.length > 0) {
        const updatedNotifications = notification.filter(
          (n) => n.chat._id !== notifi.chat._id
        );
        setNotification(updatedNotifications);
      }

      setShowNotifications(false);
    }
  };

  // Group notifications by chat ID to show only one per chat
  const getGroupedNotifications = () => {
    if (!notification || notification.length === 0) return [];

    const chatMap = new Map();

    // Group notifications by chat ID, keeping only the latest one
    notification.forEach((notifi) => {
      const chatId = notifi.chat._id;

      if (
        !chatMap.has(chatId) ||
        new Date(notifi.createdAt) > new Date(chatMap.get(chatId).createdAt)
      ) {
        chatMap.set(chatId, notifi);
      }
    });

    // Convert map back to array
    return Array.from(chatMap.values());
  };

  // Get grouped notifications
  const groupedNotifications = getGroupedNotifications();

  // Get the notification count based on grouped notifications
  const notificationCount = groupedNotifications.length;

  return (
    <div className="titlecontainer">
      <button className="searchButton" onClick={handledrawer}>
        <img className="svgofsearch" src="/assets/search.svg" alt="" />{" "}
        <span className="searchuser">Search User</span>
      </button>
      <div className="titleofapp">Chat_App</div>
      <div className="rightbar">
        <div className="notification-container" ref={notificationRef}>
          <button
            className="btnnoti"
            onClick={toggleNotifications}
            aria-label="Notifications"
            title="View notifications"
          >
            <img
              className="notification"
              src="/assets/notification.svg"
              alt="Notifications"
            />
            {notificationCount > 0 && (
              <div className="noti_counter">{notificationCount}</div>
            )}
          </button>

          {showNotifications && (
            <div className="templatenotification">
              <div className="notification-header">
                <h3>Notifications</h3>
                {notificationCount === 0 && (
                  <div className="no-notifications">No new notifications</div>
                )}
              </div>

              <div className="notification-list">
                {groupedNotifications.map((notifi, index) => (
                  <div
                    key={index}
                    className="specificnoti"
                    onClick={() => handleNotificationClick(notifi)}
                  >
                    <div className="notification-content">
                      {notifi.chat.isGroupChat ? (
                        <>
                          <div className="notification-title">
                            New message in {notifi.chat.chatName}
                          </div>
                          <div className="notification-sender">
                            From: {notifi.sender.name}
                          </div>
                        </>
                      ) : (
                        <div className="notification-title">
                          New message from {notifi.sender.name}
                        </div>
                      )}
                      <div className="notification-time">
                        {new Date(notifi.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          className="profileButton"
          onClick={() => {
            setMenu(!menu);
            // Close notifications if open
            if (showNotifications) setShowNotifications(false);
          }}
        >
          <img className="userPic" src={img || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="" />

          <div className={`groupoflogoutandprofile ${menu ? "show" : ""}`}>
            <div className="profilebuttoninsid" onClick={handlerOfprofile}>
              Profile
            </div>
            <div className="logout" onClick={handlerOfLogout}>
              Logout
            </div>
          </div>
        </button>
      </div>
      <div className={`userprofilecard ${showProfile ? "show" : ""}`}>
        <div className="close" onClick={() => setShowProfile(false)}>
          <img className="closesvg" src="/assets/close.svg" alt="Close" />
        </div>
        <div className="nameofprofile">{name}</div>
        <div>
          <img className="imageofcard" src={img || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="" />
        </div>
        <div className="emailofcard">email: {email}</div>
      </div>
    </div>
  );
};

export default TItlebar;
