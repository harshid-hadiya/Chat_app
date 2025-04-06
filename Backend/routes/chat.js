const route=require("express").Router();
const {accessChat,fetchchats,createGroupChat,renameGroup,addMemberInGroup, removeMemberInGroup}=require("../controller/chatController.js")
const validate=require("../middleware/validate.js")
// first handler only take userId another user id this for the make the chat between them
route.route("/").post(validate,accessChat).get(validate,fetchchats)

// this take name and array of the _id more than 2
route.route("/group").post(validate,createGroupChat)

// this take the groupId and the name of the group{groupId,name} like this
route.route("/rename").put(validate,renameGroup);

// {groupId,memberId}
route.route("/addMemb").put(validate,addMemberInGroup);
route.route("/removeMemb").put(validate,removeMemberInGroup); 

 
module.exports=route;