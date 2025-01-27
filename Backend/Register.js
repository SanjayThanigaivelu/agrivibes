import {Router} from 'express'
//import { MongoClient} from 'mongodb';
export  const userApi= Router();
import { config } from 'dotenv'
import nodemailer from 'nodemailer';
import { conneciton } from './dbConnection.js';


config();


//-------------------------------------------------------------FIND USER-------------------------------------------------------------------------
userApi.post("/findUser", async (req, res) => {
  try {
    const db = await conneciton();
    const { Email, PhoneNumber } = req.body;

    if (!Email || !PhoneNumber) {
      return res.status(400).json({ error: "Email and PhoneNumber are required." });
    }

    const empty=await db.collection("users").countDocuments();
    if(empty===0){
    return res.json({exists:false});
    }


    const user = await db.collection("users").countDocuments({
      $or:[{"userInfo.Email":Email},
        {"userInfo.PhoneNumber":PhoneNumber}]
      })
    if (user>0) {
      return res.json({
        exists: true,
        message: "User already registered. Please log in.",
      });
    } else {
      return res.json({
        exists: false,
        message: "No user found. You can register.",
      });
    }
  } catch (error) {
    console.error("Error in findUser API:", error);
    return res.status(500).json({ error: "Internal server error.", details: error.toString() });
  }
});

//---------------------------------------------------------------------------------------------------

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.node_mailer_user, // Your email
    pass: process.env.node_mailer_pass, // Use an app password for Gmail
  },
});

/*
const accountSid = process.env.twilio_account_sid;
const authToken = process.env.twilio_auth_token;
const twilioPhoneNumber = process.env.twilio_phone_number; // e.g., '+14155552671'
const twilioClient = twilio(accountSid, authToken)
*/

//-------------------------------------------------------------SEND & SAVE------------------------------------------------------
userApi.post('/send-email', async (req, res) => {
  const generator = () => Math.floor(10000 + Math.random() * 90000).toString(); // Generate 5-digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // Set expiration time

  try {
    
    const db = await conneciton();
    const userCollection = db.collection("users");

    const { to, subject, text} = req.body; // Receive only required data

    if (!to || !subject || !text) {
      console.error('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: to, subject, and  text' });
    }

    // Generate OTPs
    const emailOTP = generator();
                                               //const phoneOTP = generator();

    // Save OTPs to the database
    const otps = await userCollection.insertOne({
      OTP: {
        emailOTP,
        expires: expiresAt,
        createdAt: new Date(),
      },
    });

    // Configure the email content
    const mailOptions = {
      from: process.env.node_mailer_user,
      to,
      subject,
      text: `Your registration OTP is : ${emailOTP} Dont share the OTP with anyOne and it validate only for next 5 minutes. It is system Generated mail Dont reply` // Include the generated OTP in the email body
    };

    // Send the email
    transporter.sendMail(mailOptions, async(error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email', details: error.toString() });
      }
      console.log('Email sent successfully:', info.response);
     
    });
/*
    await twilioClient.messages.create({
      from: twilioPhoneNumber, // Twilio phone number
      to: `+91${phoneNo}`, // Recipient's phone number with country code
      body: `Your registration OTP is: ${phoneOTP}. This OTP is valid for 5 minutes.`,
    });
    console.log('SMS OTP sent successfully');
    */

    

    res.status(200).json({ message: 'OTP sent successfully to email' , emailOTP});

  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ error: 'Internal server error', details: err.toString() });
  } 
});

//---------------------------------------------------VALIDATE---------------------------------------------------------------------------

userApi.post('/validation',async(req,res)=>{
  try{
    const db=await conneciton();
    const validate=db.collection("users");
    const{EmailOTP}=req.body;
    if(!EmailOTP){
      console.error('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: emailOTP' });
    }
    const expiredRecord = await validate.findOne({
      "OTP.emailOTP": EmailOTP,
    });
if(expiredRecord){

  const expiresAt = new Date(expiredRecord.OTP.expires);

    if (expiresAt > new Date()) {
      // OTP is valid and within time limit
      return res.status(200).json({ message: "OTP verification successful! You are now registered. Kindly proceed to log in" });
    } else {
      // OTP has expired
      return res.status(400).json({ error: "The validation time is over. Try again within the given time limit." });
    }
    }

   else{
    return res.status(400).json({ error: "The OTP validation failed. Enter the correct OTP." });
  }
  }
    catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'Internal server error', details: error.toString() });
    } 
});
//------------------------------------------------STORING DATA------------------------------------------------------------------
userApi.post('/storage',async(req,res)=>{
 
  try{
const db=await conneciton();
const user=db.collection("users");
console.log("Request body received:", req.body);
const{userInfo}=req.body;
if(!userInfo){
  console.log("Missing User Information Check you sending data Properly...")
  return res.status(400).json({error:"Missing of user 's Information"});
}

console.log("User info to insert:", userInfo);

const currentDate = new Date().toISOString().split('T')[0];

  await user.insertOne({userInfo,createdDate: currentDate});
 return  res.status(200).json({Message:"You are Loged in...Succesfully"});

  }
  catch(error){
console.error('Error processing request:',error);
return res.status(500).json({error: 'Internal server error', details: error.toString()});
  }
})


//------------------------------------------------GET ALL DATA------------------------------------------------------------------------
userApi.get('/getOTP',async(req,res)=>{
  
  try{
const db=await conneciton();
const user= await db.collection("users").find().toArray();
res.json(user);
  }
  catch(error){
    console.error("Error fetching users:", error); // Log the error
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
})
//----------------------------------------------------DELETE OTP ALONE-----------------------------------------------------------------
userApi.post('/deleteOtp',async(req,res)=>{
  
  try{
  const db=await conneciton();
  const{Id}=req.body;
  console.log(Id);
  if(!Id){
    console.log("Please pass the emailOTP.")
    return res.status(400).json({error:"Please pass the ID of an OTP to delete Or Pass the correct ID"})
  }
  const user= await db.collection("users").deleteOne({"OTP.emailOTP": Id});
  console.log("Delete result:", user);
  if (user.deletedCount > 0) {
    return res.status(200).json({ message: 'OTP block removed successfully' });
  } else {
    return res.status(404).json({ error: 'OTP not found' });
  }
 
}
catch(error){
  console.error("Error occured while deleting:", error); // Log the error
    return res.status(500).json({ error: "An error occurred while deleting the otp" });
}

})
//---------------------------------------------------DELETE ALL-------------------------------------------------------------------------
userApi.delete('/deleteid',async(req,res)=>{
  try{
    const db=await conneciton();
    const result=db.collection("users").deleteMany({});
    res.json({ message: "All users deleted successfully", deletedCount: result.deletedCount });
  }
  catch(error){
console.log("Error occured while deleting the full dataBase:",error);
res.status(500).json({error:"An error occured while delting whole Database"});
  }

});


