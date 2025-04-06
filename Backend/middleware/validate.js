const jwt=require("jsonwebtoken");
const asyncHandler=require("express-async-handler");

const validatejson=asyncHandler((req,res,next)=>{
 const authHeader=req.headers.Authorization || req.headers.authorization;

 
 if (authHeader && authHeader.startsWith("Bearer")) {
    const token=authHeader.split(" ")[1];
    
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
       
        
        if (err) {
            console.log(err);
            
            res.status(401);
            throw new Error("You Have To Login First");
        }
        else{
            req.user={email:decoded.email,_id:decoded._id};
            
            next();
        }
    })
 }
 else{
    return res.status(401).json({message:"You Have To Login First"})
 }
})
module.exports=validatejson;