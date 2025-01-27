import {Router} from 'express'
import { config } from 'dotenv'
import { conneciton} from "./dbConnection.js";
import multer from 'multer';
import { Readable } from "stream";
import { GridFSBucket } from "mongodb";
import { ObjectId } from "mongodb";
export const sellApi =Router();

config();

const storage = multer.memoryStorage(); // Use memoryStorage or diskStorage as needed
const upload = multer({ storage });

//-------------------------------------------------------Upload Product-------------------------------------------
sellApi.post("/upload-product", upload.array("Images"), async (req, res) => {
  try {
    const formDataUpdate = req.body;
    const files = req.files;

    if (!formDataUpdate || !files) {
      return res.status(400).json({ error: "formData or files are missing" });
    }

    const email = req.cookies.email;
    if (!email) {
      return res.status(401).json({ error: "Unauthorized: Email not found in cookies" });
    }


    const db = await conneciton();
    const bucket = new GridFSBucket(db, { bucketName: "images" });

    const imageUrls = [];
    for (const file of files) {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      await new Promise((resolve, reject) => {
        readableStream
          .pipe(uploadStream)
          .on("error", (err) => {
            console.error("Error uploading to GridFS:", err);
            reject(err);
          })
          .on("finish", () => {
            console.log("Uploaded file to GridFS:", uploadStream.id);
            // Build the URL for accessing the image
            const imageUrl = `/images/${uploadStream.id.toString()}`; 
            imageUrls.push(imageUrl); // Save the image URL for reference
            resolve();
          });
      }); 
    }

    const productData = {
      ...formDataUpdate,
      Images: imageUrls, // Store the image URLs in the database
    email,
    createdDate: new Date().toISOString().split('T')[0]
    };

    const newProduct = await db.collection("selling").insertOne(productData);
    res.status(201).json({ message: "Product uploaded successfully!", productId: newProduct.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

//-------------------------------------------------------GET PRODUCT & IMAGES-----------------------------------------------------------------------------------------

sellApi.get("/getProduct", async (req, res) => {
  try {
    const db = await conneciton();
    const bucket = new GridFSBucket(db, { bucketName: "images" });

    const products = await db.collection("selling").find({}).toArray();

    // Construct URLs for images and return populated products
    const populatedProducts = products.map((product) => {
      if (product.Images && product.Images.length > 0) {
        const imageUrls = product.Images.map((imageId) => {
          return `/images/${imageId}`;  // Return the URL for each image
        });
        return { ...product, Images: imageUrls };
      }
      return product;
    });

    res.status(200).json({ result: populatedProducts });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.toString() });
  }
});
//------------------------------------------------------------RETRIVAL BASED ON BOTH LOCATION & SEARCH BOX-----------------------------------------------------------------------------------

sellApi.post("/retrive", async (req, res) => {
  try {
    const { Location, SearchBox } = req.body;

    if (!Location || !SearchBox) {
      return res.status(400).json({ error: "Location and SearchBox are required" });
    }

    const db = await conneciton();
    const products = await db.collection("selling").find({
      $and: [
        { District: { $regex: Location, $options: "i" } }, // Case-insensitive match for District
        {
          $or: [
            { category: { $regex: SearchBox, $options: "i" } },
            { BrandName: { $regex: SearchBox, $options: "i" } },
            { EquipmentName: { $regex: SearchBox, $options: "i" } },
            { MachineName: { $regex: SearchBox, $options: "i" } },
            { NameOfProduct: { $regex: SearchBox, $options: "i" } },
            { FertilizerName: { $regex: SearchBox, $options: "i" } },
            { CattleType: { $regex: SearchBox, $options: "i" } },
            { BreadName: { $regex: SearchBox, $options: "i" } },
          ],
        },
      ],
    }).project({
      Images: 1,
      BrandName: 1,
      EquipmentName: 1,
      MachineName: 1,
      NameOfProduct: 1,
      FertilizerName: 1,
      CattleType: 1,
      BreadName: 1,
      setPrice: 1,
      category: 1,
      email:1,
      Description:1,
      Features:1,
      NoOfOwners:1,
      years:1,
    //----------------------------------ADDRESS--------------------------------------------------------------
      PinCode:1,
      District: 1,
      State:1,
   //---------------------------------------LIVESTACK--------------------------------------------------------
      age:1,
      HealthCondition:1,
      Vaccinated:1,
      VacinationName:1,
  //--------------------------------------------FERTILIZER-----------------------------------------------------------
  EfficieantPeriod:1,
  WeightinKg:1,
//--------------------------------------------------FINISHED PRODUCT---------------------------------------------------
ExpiryDate:1,
PackedOn:1


    }).toArray();


    if(products.length===0){
      return res.status(200).json({ result: [] });
    }

    // Map results and determine the name dynamically
    const populatedProducts = products.map((product) => {
      let displayName = "";

      if (product.MachineName) displayName = product.MachineName;
      else if (product.EquipmentName) displayName = product.EquipmentName;
      else if (product.NameOfProduct) displayName = product.NameOfProduct;
      else if (product.FertilizerName) displayName = product.FertilizerName;
      else if (product.CattleType) displayName = product.CattleType;
      else if (product.BreadName) displayName = product.BreadName;
      else if (product.BrandName) displayName = product.BrandName;

      return {
        Images: product.Images.map((imageId) => `/images/${imageId}`),
        Name: displayName, // Dynamically chosen name
        Price: product.setPrice,
        Email:product.email,
        NoOfOwners:product.NoOfOwners,
        ByingYear:product.years,
        Description:product.Description,
        Features:product.Features,
        District: product.District,
        State:product.State,
        PinCode:product.PinCode,
      Age:product.age,
      HealthCondition:product.HealthCondition,
      Vaccinated:product.Vaccinated,
      VacinationName:product.VacinationName,
      EfficieantPeriod:product.EfficieantPeriod,
      WeightinKg:product.WeightinKg,
      ExpiryDate:product.ExpiryDate,
      PackedOn:product.PackedOn


      };  
    });

    res.status(200).json({ result: populatedProducts });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal server error", details: error.toString() });
  }
});

//--------------------------------------------------------------RETRIVAL BASED ON LOCATION ALONE-------------------------------------------------------------

sellApi.post("/retriveAll", async (req, res) => {
  try {
    const { Location} = req.body;

    if (!Location) {
      return res.status(400).json({ error: "Location is required" });
    }
    const db = await conneciton();
    const products = await db.collection("selling").find({District :{$regex:Location, $options:"i"}}).project({
      Images: 1,
      BrandName: 1,
      EquipmentName: 1,
      MachineName: 1,
      NameOfProduct: 1,
      FertilizerName: 1,
      CattleType: 1,
      BreadName: 1,
      setPrice: 1,
      category: 1,
      email:1,
      Description:1,
      Features:1,
      NoOfOwners:1,
      years:1,
    //----------------------------------ADDRESS--------------------------------------------------------------
      PinCode:1,
      District: 1,
      State:1,
   //---------------------------------------LIVESTACK--------------------------------------------------------
      age:1,
      HealthCondition:1,
      Vaccinated:1,
      VacinationName:1,
  //--------------------------------------------FERTILIZER-----------------------------------------------------------
  EfficieantPeriod:1,
  WeightinKg:1,
//--------------------------------------------------FINISHED PRODUCT---------------------------------------------------
ExpiryDate:1,
PackedOn:1


    }).toArray();
    
    if(products.length===0){
      return res.status(200).json({ result: [] });
    }



  const populatedProducts = products.map((product) => {
    let displayName = "";

    if (product.MachineName) displayName = product.MachineName;
    else if (product.EquipmentName) displayName = product.EquipmentName;
    else if (product.NameOfProduct) displayName = product.NameOfProduct;
    else if (product.FertilizerName) displayName = product.FertilizerName;
    else if (product.CattleType) displayName = product.CattleType;
    else if (product.BreadName) displayName = product.BreadName;
    else if (product.BrandName) displayName = product.BrandName;

    return {
      Images: product.Images.map((imageId) => `/images/${imageId}`),
      Name: displayName, // Dynamically chosen name
      Price: product.setPrice,
      Email:product.email,
      NoOfOwners:product.NoOfOwners,
      ByingYear:product.years,
      Description:product.Description,
      Features:product.Features,
      District: product.District,
      State:product.State,
      PinCode:product.PinCode,
    Age:product.age,
    HealthCondition:product.HealthCondition,
    Vaccinated:product.Vaccinated,
    VacinationName:product.VacinationName,
    EfficieantPeriod:product.EfficieantPeriod,
    WeightinKg:product.WeightinKg,
    ExpiryDate:product.ExpiryDate,
    PackedOn:product.PackedOn


    };  
  });
  res.status(200).json({ result: populatedProducts });
  }
  catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal server error", details: error.toString() });
  }

})

//----------------------------------------------------------------IMAGES----------------------------------------------------------------------------



sellApi.get("/images/:id", async (req, res) => {
  console.log("Requested image ID:", req.params.id);  // Log the image ID being requested
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid image ID" });
    }

    const db = await conneciton();
    const bucket = new GridFSBucket(db, { bucketName: "images" });

    const downloadStream = bucket.openDownloadStream(new ObjectId(id));

    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });

    downloadStream.on("error", (err) => {
      console.error("Error downloading image:", err);
      res.status(404).json({ error: "Image not found" });
    });

    downloadStream.on("end", () => {
      res.end();
    });
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//-------------------------------------------------------DELETE-------------------------------------------------------------------------
sellApi.delete("/deletdata",async(req,res)=>{
  try{
const db= await conneciton();
const data=await db.collection("selling").deleteMany({});
res.status(200).json({ message: `${data.deletedCount} documents deleted.` });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error", details: error.toString() });
  }
});