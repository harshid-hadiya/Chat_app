const express=require("express");
const user=express.Router();
const{createUser,LoginHandler,searchHandler}=require("../controller/userController.js")
const validatejson = require("../middleware/validate.js")

user.route("/signup").post(createUser)
user.route("/login").post(LoginHandler)
user.route("/searc").get(validatejson,searchHandler)


module.exports={user}

