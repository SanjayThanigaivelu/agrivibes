import { MongoClient } from "mongodb";
import { config } from "dotenv";
// Load environment variables
config();
let client; 
let db; 

async function conneciton() {
  if (!client) {
    client = new MongoClient(process.env.DB_CONNETION_STRING1);
    try {
      await client.connect();
      console.log("Connected to MongoDB");
      db = client.db("agrivibes");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err;
    }
  }
  return db; // Return the initialized database instance
}
export { conneciton };