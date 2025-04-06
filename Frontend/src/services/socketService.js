import io from "socket.io-client";

// The server URL
const SERVER_URL = "https://chat-app-umd8.onrender.com";

// Create a single socket instance
let socket = null;

// Initialize the socket connection
export const initializeSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL);
    console.log("Socket connection initialized");
  }
  return socket;
};

// Get the socket instance (initializes if needed)
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};

// Join a chat room
export const joinChatRoom = (chatId) => {
  const socketInstance = getSocket();
  socketInstance.emit("groupIdjoin", chatId);
};

// Connect user
export const connectUser = (userId) => {
  const socketInstance = getSocket();
  socketInstance.emit("connectiononuser", userId);
};

// Send a new message
export const sendMessage = (messageData) => {
  const socketInstance = getSocket();
  socketInstance.emit("newmessage", messageData);
};

// Typing indicators
export const sendTypingStatus = (chatId) => {
  const socketInstance = getSocket();
  socketInstance.emit("typing", chatId);
};

export const sendStopTypingStatus = (chatId) => {
  const socketInstance = getSocket();
  socketInstance.emit("stop typing", chatId);
};

// Custom event handler registration
export const onNewMessage = (callback) => {
  const socketInstance = getSocket();
  socketInstance.on("understandmessage", callback);
};

export const offNewMessage = (callback) => {
  const socketInstance = getSocket();
  socketInstance.off("understandmessage", callback);
};

export const onTyping = (callback) => {
  const socketInstance = getSocket();
  socketInstance.on("typing", callback);
};

export const offTyping = (callback) => {
  const socketInstance = getSocket();
  socketInstance.off("typing", callback);
};

export const onStopTyping = (callback) => {
  const socketInstance = getSocket();
  socketInstance.on("stop typing", callback);
};

export const offStopTyping = (callback) => {
  const socketInstance = getSocket();
  socketInstance.off("stop typing", callback);
};

export const onChatMessage = (callback) => {
  const socketInstance = getSocket();
  socketInstance.on("understand", callback);
};

export const offChatMessage = (callback) => {
  const socketInstance = getSocket();
  socketInstance.off("understand", callback);
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  joinChatRoom,
  connectUser,
  sendMessage,
  sendTypingStatus,
  sendStopTypingStatus,
  onNewMessage,
  offNewMessage,
  onTyping,
  offTyping,
  onStopTyping,
  offStopTyping,
  onChatMessage,
  offChatMessage,
};
