const route=require("express").Router();
const { sendMessage, fetchchats } = require("../controller/messageController.js");
const validate=require("../middleware/validate.js")
route.route("/").post(validate,sendMessage)
route.route("/:chatId").get(validate,fetchchats)
module.exports=route;