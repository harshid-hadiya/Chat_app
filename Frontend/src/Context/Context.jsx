import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as socketService from "../services/socketService";

const created = createContext();

export const Contextprovider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [changeAdd, setchangeAdd] = useState(false);
  const [right, setrightusers] = useState("");
  const [notification, setNotification] = useState([]);
  const [isnotification, setIsnotification] = useState(false);

  useEffect(() => {
    const userdata = localStorage.getItem("userInfo");
    if (userdata) {
      const data = JSON.parse(userdata);
      setUser(data);

      // Initialize socket connection
      socketService.initializeSocket();

      // Register user with socket
      if (data.user_id) {
        socketService.connectUser(data.user_id);
      }
    } else {
      navigate("/");
      //here you have to resolve the erro for the handling the navigate if data is not there
    }
    console.log("Refresh");

    // Cleanup socket on unmount
    return () => {
      if (!userdata) {
        socketService.disconnectSocket();
      }
    };
  }, [navigate]);

  // Handle chat selection
  useEffect(() => {
    if (right && right._id && user) {
      // Join the chat room whenever the selected chat changes
      socketService.joinChatRoom(right._id);
    }
  }, [right, user]);

  return (
    <created.Provider
      value={{
        user,
        setUser,
        changeAdd,
        setchangeAdd,
        right,
        setrightusers,
        notification,
        setNotification,
        isnotification,
        setIsnotification,
        socket: socketService,
      }}
    >
      {children}
    </created.Provider>
  );
};
export const getContext = () => {
  return useContext(created);
};
