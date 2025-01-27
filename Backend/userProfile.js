import {Router} from 'express';
export const profileApi=Router();
import { config } from 'dotenv'
import { conneciton } from './dbConnection.js';
import multer from 'multer';
import { Readable } from "stream";
import { GridFSBucket } from "mongodb";
import { ObjectId } from "mongodb";
import { userInfo } from 'os';
import { error } from 'console';

config();


//---------------------------------------------------------USER PROFILE--------------------------------------------------------------------

profileApi.get("/userData",async(req,res)=>{

    try{
        const Email = req.cookies.email;

        if (!Email) {
            return res.status(401).json({ error: "Unauthorized: Email not found in cookies" });
          }
          const db=await conneciton();

          const user= await db.collection("users").findOne({ "userInfo.Email": Email },{projection:{
          "userInfo.FullName": 1, 
          "userInfo.Email": 1,    
          "createdDate": 1        
        }});
          
          if(!user){
            return res.status(404).json({result:[]});
          }
          return res.status(200).json({result:[
        {
          FullName: user.userInfo.FullName,
          Email: user.userInfo.Email,
          createdDate: user.createdDate
        }
      ]})
          
    }
    catch (error) {
        console.error("Error in retrieving user:", error);
        res.status(500).json({ error: "Internal server error", details: error.toString() });
      }
})
//------------------------------------------------------------SELLING USSER DATA--------------------------------------------------------------------------------------------------------------------------


profileApi.get('/SellingUserData',async(req,res)=>{

  try{ 
    const CookiesEmail=req.cookies.email;

    if(!CookiesEmail){
      return res.status(400).json({error:"Unauthorized: Email not found in cookies"});
    }
    const db= await conneciton();

    const user=await db.collection('selling').find({"email":CookiesEmail}).toArray();

    if(user.length===0){
      return res.status(404).json({error :"No Ad has been Posted.Post the Ad to see "});
    }
return res.status(200).json({user});

  }
  catch (error) {
    console.error("Error in GetingProduct :", error);
    res.status(500).json({ error: "Internal server error", details: error.toString() });
  }
})

//-------------------------------------------------------------UPDATE USER----------------------------------------------------------------------------------------------------------------------------
profileApi.post("/updateUser",async (req,res)=>{
  try{
    const CookiesEmail = req.cookies.email;
    const { userInfoUpdate}=req.body;
    if(!userInfoUpdate || !CookiesEmail){
      return res.status(400).json({error:"Missing of user 's Information or Email from Cookies"});
    }
    const db=await conneciton();
    const user= await  db.collection("users").updateOne({"userInfo.Email":CookiesEmail},{$set:{"userInfo.Email":userInfoUpdate.NewEmail,"userInfo.PhoneNumber": userInfoUpdate.NewPhoneNumber,
      "userInfo.FullName": userInfoUpdate.NewName}})
  
     const ProductMailModify= await db.collection("selling").updateMany({"email":CookiesEmail},{$set:{"email":userInfoUpdate.NewEmail}}
    
     )

  const message =
   ProductMailModify.modifiedCount > 0
      ? "Both user profile and product profile updated. Login with new email and old password."
      : "User profile updated. No product profile changes.";

  return res.status(200).json({ message });
    }
    catch(error){
      console.error("Error in Updating Data :", error);
      res.status(500).json({ error: "Internal server error", details: error.toString() });
    }
})
//-------------------------------------------------------DELETE USER----------------------------------------------------------------------------------------------

profileApi.post("/UserDelete",async (req,res)=>{

  try{
    const {DeleteUser}=req.body;
    if(!DeleteUser){
      return res.status(400).json({error:"No User Data Available to Delete"});
    }
    const db=await conneciton();
    const DeleteUser1 = await db.collection('users').deleteOne({"userInfo.Email":DeleteUser.EmailDelete});

    const DeleteProduct = await db.collection('selling').deleteMany({"email":DeleteUser.EmailDelete});

    if(DeleteUser1.deletedCount > 0){
      if(DeleteProduct.deletedCount >0){
         return res.status(200).json({message:"Both User & Product Data has been deleted Register again to Continue..."})
      }
      else{
         return res.status(200).json({message:"User Data is Deleted. Register again to Continue..."});
      }
    }
   return  res.status(400).json({error:"No user Data is availabe check again the Email..."})
  }
  catch(error){
    console.error("Error in Delting Data :", error);
    res.status(500).json({ error: "Internal server error", details: error.toString() });
  }
})
//--------------------------------------------------------PRODUCT DELETE---------------------------------------------------------------------

profileApi.post('/ProductDelete',async(req,res)=>{

  try{

  const{ProductId}=req.body;

  if(!ProductId){
    res.status(400).json({error:"Id was Not available..."});
  }

  const db = await conneciton();

  const objectId = new ObjectId(ProductId);

  const ProductDelete = await db.collection('selling').deleteOne({  _id: objectId });

  if (ProductDelete.deletedCount === 0) {
    return res.status(404).json({ error: "Product not found." });
  }

  res.status(200).json({ message: "Product deleted successfully." });
}
catch (error) {
  console.error(error);
  res.status(500).json({ error: "An error occurred while deleting the product." });
}
})