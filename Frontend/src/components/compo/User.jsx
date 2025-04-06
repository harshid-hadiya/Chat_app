import "./user.css";
import { useState, useEffect } from "react";
import { getContext } from "../../Context/Context.jsx";

const User = ({ name, email, pic, onClick1, isGroupChat, chatId }) => {
  const [naming, setNaming] = useState(name);
  const [emailing, setEmailing] = useState(email);
  const [picing, setPicing] = useState(pic);
  const { user, setNotification, right, socket } = getContext();

  useEffect(() => {
    if (!user || !chatId) return;

    // Set up message listener for this chat
    const handleMessage = (data) => {
      if (chatId !== data.chat._id) {
        return;
      }

      if (isGroupChat) {
        if (data.sender._id !== user.user_id) {
          setEmailing(`${data.sender.name} : ` + data.content);
          if (right._id !== data.chat._id) {
            setNotification((prevdata) => [...prevdata, data]);
          }
        } else setEmailing(data.content);
      } else {
        if (data.sender._id === user.user_id) {
          setEmailing("You :" + data.content);
        } else {
          setEmailing(data.content);

          if (right._id !== data.chat._id) {
            setNotification((prevdata) => [...prevdata, data]);
          }
        }
      }
    };

    // Use the socket service to listen for chat messages
    socket.onChatMessage(handleMessage);

    // Clean up the event listener when component unmounts
    return () => {
      socket.offChatMessage(handleMessage);
    };
  }, [chatId, user, right, socket, isGroupChat]);

  return (
    <div className="user" onClick={onClick1}>
      <div className="user-avatar">
        {!isGroupChat && <img src={picing || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} />}
      </div>
      <div className="user-info">
        <div className="name">{naming}</div>
        <div className="user-meta">
          <span className="email">{emailing}</span>
        </div>
      </div>
    </div>
  );
};

export default User;
