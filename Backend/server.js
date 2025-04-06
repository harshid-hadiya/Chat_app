const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const { user } = require("./routes/user.js");
const connection = require("./config/db.js");
const chat = require("./routes/chat.js");
const message = require("./routes/message.js");
const { notFound, errorHandler } = require("./middleware/errorhanler.js");
const cors = require("cors");
const path = require("path");

app.use(cors());
const port = process.env.PORT || 9800;
// this is for the connection to the your mongo db
connection();

app.use(express.json());
app.use("/api/user", user);
app.use("/api/chat", chat);
app.use("/api/message", message);
const __dirname1 = path.resolve();
// process.env.NODE_ENV == "PRODUCTION"
if (true) {
  app.use(express.static(path.join(__dirname1, "Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "Frontend/dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running successfully");
  });
} 
app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log("your server start on the " + port);
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("connectiononuser", (id) => {
    socket.join(id);
    console.log(`User ${id} joined`);
  });

  socket.on("groupIdjoin", (id) => {
    socket.join(id);
    console.log(`Joined group ${id}`);
  });
  socket.on("typing", (id) => {
    socket.in(id).emit("typing", id);
  });
  socket.on("stop typing", (id) => {
    socket.in(id).emit("stop typing", id);
  });

  socket.on("newmessage", (data) => {
    if (!data?.chat?.users) {
      console.log("No users in chat.");
      return;
    }

    data.chat.users.forEach((user) => {
      if (user._id !== data.sender._id) {
        socket.to(user._id).emit("understandmessage", data);
      }
    });
    console.log(data);
    data.chat.users.forEach((user) => {
      console.log("sending");

      socket.to(user._id).emit("understand", data);
    });
  });
  socket.on("selected",(group)=>{
    const {chat,id}=group;
    console.log(group);
    
    chat.users.forEach((user) => {
      console.log("sending user" + user);
      
      if (user._id !== id) {
        socket.to(user._id).emit("getting", chat);
      }
    });
  })
});