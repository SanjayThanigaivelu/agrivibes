import {Router} from 'express';
//import {MongoClient} from 'mongodb';
export const loginApi=Router();
import { conneciton } from './dbConnection.js';
import {config} from 'dotenv';
import nodemailer from 'nodemailer';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
config();

const SECRET_KEY01 = process.env.SECRETE_KEY;

loginApi.post("/loginUser", async (req, res) => {
    try {
        const db = await conneciton();
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({ error: "Email or Password is Missing!!" });
        }

        // Check if the email exists
        const user = await db.collection("users").findOne({ "userInfo.Email": Email });

        if (!user) {
            return res.status(400).json({
                exists: false,
                message: "Email not found. Please register to proceed to login."
            });
        }

        // Check if the password matches
        const isPasswordCorrect = user.userInfo.Password === Password;

        if (!isPasswordCorrect) {
            return res.status(400).json({
                exists: true,
                message: "Incorrect password. Please try again or use the 'Forgot Password' option."
            });
        }

        res.cookie("email", Email, {
        	httpOnly: true,
         secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 15*24*60*60*1000,
          });    
             

        const token = jwt.sign(
          { userId: user._id, email: user.userInfo.Email },
          SECRET_KEY01,
          { expiresIn: "15d" } // Token valid for 15 days
      );

      // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,  // Secure cookie, not accessible via JavaScript
        maxAge: 15 * 24 * 60 * 60 * 1000,  // 15 days in milliseconds
        sameSite: 'none',  // Allow cross-origin cookies
       secure: process.env.NODE_ENV === "production", // Change to true in production (use HTTPS)
    });


        // If email and password both match
        return res.json({
            exists: true,
            message: "You are logged in successfully."
        });

    } catch (error) {
        console.error("Error in Finding User Data:", error);
        return res.status(500).json({ error: "Internal server error", details: error.toString() });
    }
});

//-----------------------------------------------------------JWT AUTHENTICATION-------------------------------------------------------------------
function authenticateToken(req, res, next) {
  const token = req.cookies.token; // Retrieve token from cookies
  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  jwt.verify(token, SECRET_KEY01, (err, user) => {
      if (err) return res.status(403).json({ message: "Forbidden: Invalid token" });
      req.user = user; // Attach the user data to the request
      next();
  });
}

loginApi.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, you are authenticated!` });
});

//------------------------------------NODEMAILER-------------------------------------------------------------------------------------------

const transporter=nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.node_mailer_user,
        pass:process.env.node_mailer_pass,
    },
});



//---------------------------------RESET PASSWORD EMAIL CHECK & OTP SEND---------------------------------------------------------------------
loginApi.post("/emailChecking", async (req, res) => {
    const generator = () => Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  
    try {
      const db = await conneciton();
      const { Email, subject, text } = req.body;
  
      if (!Email || !subject || !text) {
        return res.status(400).json({ error: "Email required to verify" });
      }
  
      const user = await db.collection("users").findOne({ "userInfo.Email": Email });
      if (!user) {
        return res.status(400).json({
          message: "Mail id was not found. Please complete the registration.",
        });
      }
  
      const emailOtp = generator();
      await db.collection("users").insertOne({
        ResetPassOTP: {
          emailOtp,
          expires: expiresAt,
          createdAt: new Date(),
        },
      });
  
      const mailOptions = {
        from: process.env.node_mailer_user,
        to: Email, // Fix: Correct the key for the recipient email address
        subject,
        text: `For resting the Password the OTP is: ${emailOtp}. Don't share the OTP with anyone, and it is valid only for the next 5 minutes. This is a system-generated email, do not reply.`,
      };
  
      // Handle email sending and response
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Failed to send email", details: error.toString() });
        }
        console.log("Email sent successfully:", info.response);
        return res.status(200).json({ message: "OTP sent successfully to the email for Reseting Password...", emailOtp });
      });
    } catch (err) {
      console.error("Error processing request:", err);
      res.status(500).json({ error: "Internal server error", details: err.toString() });
    }
  });
  //---------------------------------------------------------------------------------------------------------------------------------------

  loginApi.post("/otpValidator",async (req,res)=>{
    
    try{
    const db=await conneciton();
    const validate=db.collection("users");
        const{EmailOTP}=req.body;
if(!EmailOTP){
    console.error('OTP feild is Missing');
    return res.status(400).json({error:"Missing Email OTP"});  
}

const expiredRecord=await validate.findOne({
    "ResetPassOTP.emailOtp":EmailOTP,
})
if(expiredRecord){
    const expiresAt=new Date(expiredRecord.ResetPassOTP.expires);

if(expiresAt > new Date()){
    return res.status(200).json({message:"OTP Verification Succssfull."})
}
else{
    return res.status(400).json({error:"The Validation time is over.Try again within the given time limit"})
}
    }
    else{
        return res.status(400).json({error:"The OTP validation failed. Enter the correct OTP."})
    }
  }
catch(error){
    console.error('Error processing request:',error);
res.status(500).json({error:'Internal server error',details:error.toString()});
}
});
//-----------------------------------------DELETE OTP-------------------------------------------------------------------------

loginApi.post("/deleteOTP",async(req,res)=>{
  try{
    const db=await conneciton();
  const{OTPs}=req.body;
  if(!OTPs){
    console.log("Please pass the emailOTP.")
    return res.status(400).json({error:"Share the Email OTP to Delete it..."})
  }
  const user=await db.collection('users').deleteOne({"ResetPassOTP.emailOtp":OTPs})
if(user.deletedCount>0){
  return res.status(200).json({message:'OTP block removed successfully'});
}
else{
  return res.status(404).json({error:'OTP not found'})
}
  }
  catch(error){
    console.log("Error occured while deleting:",error);
    return res.status(500).json({error:"An error occured while deleting the otp"});
  }
})
//----------------------------------------PASSWORD CHANGING---------------------------------------------------------------------------------
loginApi.post("/passwordChange",async(req,res)=>{
try{
  const db=await conneciton();
  const{Email,NewPassword,RePassword}=req.body;
  if(!Email||!NewPassword||!RePassword){
console.log("Email ,NewPassword or Repassword feild is not available pls check that....");
res.status(400).json({error:"Share Email, NewPassword or Repassword feild is missing"})
  }
  const user=db.collection('users').updateOne({"userInfo.Email":Email},{$set:{"userInfo.Password":NewPassword,"userInfo.RePassword":RePassword}});

  if (user.modifiedCount === 0) {
    console.log("Password update failed.");
    return res.status(500).json({ error: "Failed to update passwords. Try again later." });
  }
  console.log("Passwords updated successfully.");
  return res.status(200).json({ message: "Passwords updated successfully. Pleas proceed to login" });
}
catch (error) {
  console.error("Error updating passwords:", error);
  res.status(500).json({ error: "Internal Server Error." });
}
})
//----------------------------------------------------Logout----------------------------------------------------------------------
loginApi.post("/logout", async (req, res) => {
  console.log("Request received from:", req.headers.referer || req.headers.origin);
  console.log("Logout request received!");

  // Log cookies for debugging
  console.log("Cookies received in the request:", req.cookies);

  // Clear the 'token' and 'email' cookies
  res.clearCookie('token', {
    httpOnly: true,
   secure: process.env.NODE_ENV === "production",// Match the settings used during cookie creation
    sameSite: "none",
    path: "/"
  });

  res.clearCookie('email', {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/"
  });

  console.log("Cookies cleared successfully.");
  res.status(200).send('Logged out');
});
