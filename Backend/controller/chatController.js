const asyncHandler=require("express-async-handler")
const Chat=require("../model/chatModel.js")
const User=require("../model/userModel.js")
const accessChat=asyncHandler(async(req,res)=>{
   const {userId}=req.body
   if(!userId){
    console.log("Not this User Is Present");
    return res.status(400);
   }
   var userdata=await Chat.find({
    isGroupChat:false,
    $and:[
        {users:{$elemMatch:{$eq:req.user._id}}},
        {users:{$elemMatch:{$eq:userId}}},
    ]
   }).populate("users","-password")
   .populate("latestMessage")
   userdata=await User.populate(userdata,{
     path:"latestMessage.sender",
     select:"name profilePic email"
   })
   if (userdata && userdata.length>0) {
    res.send(userdata[0]); 
   }
   else{
    const currentuser=await User.findById(userId)
    var query={
        isGroupChat:false,
        chatName:currentuser.name,
        users:[req.user._id,userId]
    }

    try {
         query=await Chat.create(query);
         const fullChat=await Chat.findOne({_id:query._id}).populate("users","-password");
         res.status(200).json(fullChat)
    } catch (err) {
        res.status(400)
        throw new Error(err.message);
    }
   }
})
const fetchchats=asyncHandler(async (req,res) => {
     try {
        var fetchchatsof=await Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage").sort({updatedAt:-1});
       
           fetchchatsof =await User.populate(fetchchatsof,{
            path:"latestMessage.sender",
            select:"name profilePic email"
           })
        res.status(200).json(fetchchatsof);
     } catch (err) {
        res.status(400)
        throw new Error(err.message);
     }
})
const createGroupChat=asyncHandler(async (req,res) => {
     try {
        if (!req.body.users || !req.body.name) {
           return  res.status(400).json({message:"You Have To First enter the body name and chat"})
        }
        const users=req.body.users;
        if (users.length<2) {
            return  res.status(400).json({message:"You Have To Add more Than 2 People"});
        }
        users.push(req.user._id)
        var gruopchatCreation=await Chat.create({
          chatName:req.body.name,
          isGroupChat:true,
          users:users,
          groupAdmin:req.user._id
        })
        const groupchats=await Chat.findOne({_id:gruopchatCreation._id}).populate("users","-password").populate("groupAdmin","-password");
        return res.status(200).json(groupchats)
     } catch (err) {
        res.status(400)
        throw new Error(err.message);
        }
})

const renameGroup=asyncHandler(async (req,res) => {
    const {name,groupId}=req.body
    try {
        if (!name) {
            res.status(400)
            throw new Error("You have enter the group Name");             
        }
        const exists=await Chat.findOne({_id:groupId,users:{$in:req.user._id}});
        if (!exists) {
            return res.status(400).json({message:"You Have To First Part Of this chat"})
        }
        const rename=await Chat.findByIdAndUpdate(groupId,{
            chatName:name,
        },{
            new:true,
        }).populate("users","-password").populate("groupAdmin","-password");
      res.status(200).json(rename);
        

    } catch (err) {
        res.status(400)
        throw new Error(err.message);
    }
})
const addMemberInGroup=asyncHandler(async (req,res) => {
    const {groupId,memberId}=req.body;
    console.log(groupId,memberId);
    
    if (!memberId) {
        res.status(400)
        throw new Error("You Have To first add member id field");
    }
    let exists=await Chat.findOne({_id:groupId,users:{$in:req.user._id}});
    if (!exists) {
        return res.status(400)
        throw new Error("You Have To First Part Of this chat");
    }
    exists=await Chat.findOne({_id:groupId,users:{$in:memberId}});
     if (exists) {
        res.status(400)
        throw new Error("You Already Add him/her");
    }
 const addMember=await Chat.findByIdAndUpdate(groupId,{$push:{users:memberId}},{new:true})
 .populate("users","-password").populate("groupAdmin","-password");
 if (!addMember) {
    res.status(400)
    throw new Error("Internal Server Error");
 }
 res.status(200).json(addMember);
})
const removeMemberInGroup=asyncHandler(async (req,res) => {
    const {groupId,memberId}=req.body;
    if (!memberId) {
        res.status(400)
        throw new Error("You Have To first add member id field");
    }
    let exists=await Chat.findOne({_id:groupId,users:{$in:req.user._id}});
    if (!exists) {
        res.status(400)
        throw new Error("You Have To First Part Of this chat");
    }
     exists=await Chat.findOne({_id:groupId,users:{$in:memberId}});
     if (!exists) {
        res.status(400)
        throw new Error("Sorry But this people is not in Your Chat");
    }
 const removeMember=await Chat.findByIdAndUpdate(groupId,{$pull:{users:memberId}},{new:true})
 .populate("users","-password").populate("groupAdmin","-password");
 if (!removeMember) {
    res.status(400)
    throw new Error("Internal Server Error");
 }
 res.status(200).json(removeMember);
})
module.exports={accessChat,fetchchats,createGroupChat,renameGroup,addMemberInGroup,removeMemberInGroup}