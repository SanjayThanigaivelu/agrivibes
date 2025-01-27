import express from "express";
import cors from "cors";
import { userApi } from "./Register.js"; // Ensure this file is correctly set up
import {loginApi} from "./loginBackend.js"
import { sellApi } from "./selling.js";
import { profileApi } from "./userProfile.js";
import { MongoClient } from "mongodb";
import { config } from 'dotenv';
import cookieParser from "cookie-parser"; //imported recently
config();


const vibe = express();


const corsOptions = {
  origin: "http://localhost:3000", // Frontend URL
  credentials: true, // Allow cookies to be sent/received ....this part
};

vibe.use(cors(corsOptions)); //this line
vibe.use(express.json());
vibe.use(cookieParser());  // this line




// Start the server after DB connection is established

// MongoDB Connection Setup
const mongoUri = process.env.DB_CONNETION_STRING1;
let db;

// Test and initialize MongoDB connection
async function connectToMongoDB() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    db = client.db("agrivibes"); // Initialize the database instance for reuse
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if the DB connection fails
  }
} 

// Middleware to inject DB instance into API routes
vibe.use((req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: "Database not initialized" });
  }
  req.db = db; // Attach DB instance to `req` object
  next();
});

// API Routes
vibe.use("/", userApi);
vibe.use("/login",loginApi);
vibe.use("/sell",sellApi);
vibe.use("/profile",profileApi)
// Fallback Wildcard Middleware
vibe.use((req, res) => {
  console.log("Wildcard hit:", req.path);
  res.status(404).json({ error: "Route not found", path: req.path });
});


process.on('SIGINT', async () => {
  console.log("\nGracefully shutting down...");
  if (client) {
    await client.close();
    console.log("MongoDB connection closed.");
  }
  process.exit(0);
});



connectToMongoDB().then(() => {
  vibe.listen(5000, () => {
    console.log("App started on port 5000");
  });
}); 


