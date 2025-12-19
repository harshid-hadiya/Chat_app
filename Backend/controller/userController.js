const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const getJsonToken =require("../config/getJsonToken.js")

//this handler for the register user on the data base there is not use of that
const createUser = asyncHandler(async (req, res) => {
  const { name, email, profilePic, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("You have first fill your all data");
  }
  console.log(profilePic);
  
  const alreadyUser =await User.findOne({ email });
  if (alreadyUser) {
    res.status(400);
    throw new Error("You already Login On this email try to Login");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    profilePic,
  });

  if (newUser) {
   return res
      .status(201)
      .json({
        user_id: newUser._id,
        user_name: newUser.name,
        user_email: newUser.email,
        pic:newUser.profilePic,
        jsonToken: getJsonToken(newUser.email,newUser._id),
      });
  } else {
    res.status(500)
    throw new Error("Your credential may be wrong");
  }
});
// this handler for the login purpose
const LoginHandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const currentUser = await User.findOne({ email });
    if (!currentUser) {
        res.status(401);
        throw new Error("Invalid email ");
    }

    const isPasswordCorrect = await bcrypt.compare(password, currentUser.password);
    if (!isPasswordCorrect) {
        res.status(401);
        throw new Error("Invalid password");
    }

    return res.status(200).json({
        user_id: currentUser._id,
        user_name: currentUser.name,
        user_email: currentUser.email,
        pic:currentUser.profilePic,
        jsonToken: getJsonToken(currentUser.email, currentUser._id),
    });
});
// here for the search the user for this we using this token
const searchHandler=asyncHandler(async(req,res)=>{
  
  const query=req.query.search ? {
    $or:[
      {name:{$regex:req.query.search ,$options: "i"}},
      {email:{$regex:req.query.search ,$options: "i"}},
     ]
  }:{};
  const user=await User.find(query).find({_id:{$ne:req.user._id}})
  res.status(200).json(user);

})

module.exports = { LoginHandler, createUser,searchHandler };
