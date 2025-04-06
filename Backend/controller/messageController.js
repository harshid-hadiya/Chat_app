const asyncHandler=require("express-async-handler")
const Message=require("../model/messageModel.js")
const User=require("../model/userModel.js")
const Chat=require("../model/chatModel.js")
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chat } = req.body;
    if (!content || !chat) {
      console.log("You must provide content and chat.");
      return res.status(400).send("Bad Request");
    }
  
    const query = {
      content: content,
      chat: chat,
      sender: req.user._id,
    };
  
    try {
     let message = await Message.create(query);
     message= await message.populate("sender", "name profilePic email");  
     message= await message.populate("chat");  
     message=await User.populate(message,{
        path:"chat.users",
        select:"name profilePic email"
      })

      await Chat.findByIdAndUpdate(chat,{latestMessage:message})
      console.log(message);
      
      res.status(201).json(message);  
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server Error");
    }
  });
const fetchchats=asyncHandler(async (req,res) => {
    const chatId=req.params.chatId;
    if (!chatId) {
        res.status(404)
        throw new Error("Sorry First You Have To add the chatid");        
    }
    try {
        let message = await Message.find({chat:chatId}).populate("sender", "name profilePic email").populate("chat").sort({updatedAt:1});
        
        message=await User.populate(message,{
           path:"chat.users",
           select:"name profilePic email"
         })
         res.status(201).json(message);  
       } catch (error) {
         console.error(error);
         return res.status(500).send("Server Error");
       }
  })
module.exports={sendMessage,fetchchats}