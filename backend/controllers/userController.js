

import userModel from "../models/userModel.js";    //isko import karna hoga userModel se data access krne ke liye  usermodel me user schema define kiya hoga jisme name,email,password fields honge
import jwt from "jsonwebtoken"    //isko import karna hoga token create krne ke liye
import bcrypt from "bcrypt"    //isko import karna hoga password hash krne ke liye
import validator from "validator"   //isko import karna hoga email validation ke liye


//login user 
const loginUser = async(req,res)=>{   
      const {email,password}=req.body;
      try {
        const user = await userModel.findOne({email});  //is email se user ko find karna hoga database me agar user exist karta hai to uska password compare karna hoga jo user ne input kiya hai aur jo database me stored hai usko bcrypt ke compare function se compare karna hoga

        if(!user){   
            return res.json({success:false,message:"User doesn't exist"})     //in dono line me agar user exist nahi karta hai to ek json response bhejna hoga jisme success false hoga aur message me "User doesn't exist" likhna hoga
        }
        const isMatch =await bcrypt.compare(password,user.password);    //is line me user ke input kiya hua password aur database me stored password ko compare karna hoga agar match nahi karta hai to ek json response bhejna hoga jisme success false hoga aur message me "Invalid Credentials" likhna hoga

        if(!isMatch){
            return res.json({success:false,message:"Invalid Credentials"})
        }

        const token = createToken(user._id);   // is line me agar password match karta hai to ek token create karna hoga jisme user ka id hoga aur us token ko json response me bhejna hoga jisme success true hoga aur token me wo token hoga jo create kiya gaya hai
        res.json({success: true, token})   //is line me json response bhejna hoga jisme success true hoga aur token me wo token hoga jo create kiya gaya hai
      } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message || "Server Error"})
      }
      }



const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)  //in dono line me jwt.sign function ka use karna hoga jisme pehla argument me ek object pass karna hoga jisme id hoga aur usme user ka id hoga aur dusra argument me ek secret key pass karna hoga jo .env file me define kiya gaya hoga
}
//register user 
const registerUser =async(req,res)=>{
   const {name,password,email} = req.body;
   try {
    //checking is user already exists 
    const exists=await userModel.findOne({email});
    if(exists){
        return res.json({success:false,message:"User already exists"})
    }
    //validating email format & strong password 
    if(!validator.isEmail(email)){
        return res.json({success:false,message:"please enter a valid email"})
    }
    if(password.length<8){
        return res.json({success:false,message:"please enter a strong password"})
    }
    //hashing user password 
    const salt=await bcrypt.genSalt(10)  // is line me bcrypt.genSalt function ka use karna hoga jisme pehla argument me salt rounds pass karna hoga jo 10 hoga aur uska result ek salt hoga jisko password hash karne ke liye use kiya jayega
    const hashedPassword = await bcrypt.hash(password,salt);  // is line me bcrypt.hash function ka use karna hoga jisme pehla argument me user ka password pass karna hoga aur dusra argument me wo salt pass karna hoga jo pehle line me generate kiya gaya hai aur uska result ek hashed password hoga jisko database me store kiya jayega

    const newUser = new userModel({
        name:name,
        email:email,
        password:hashedPassword
    })
    const user =  await newUser.save()
    const token = createToken(user._id)
    res.json({success: true, token})
   } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message || "Server Error"})
   }
}
export {loginUser,registerUser}