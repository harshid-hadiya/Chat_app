const mongoose=require("mongoose")
const userModel=mongoose.Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,required:true,trim:true,unique:true},
  profilePic:{type:String,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
  password:{type:String,required:true}
},{timestamps:true})
const User=mongoose.model("User",userModel);
module.exports=User;