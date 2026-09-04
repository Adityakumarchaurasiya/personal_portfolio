const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") });

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio";

async function clearCollections() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB:", mongoUri);
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      if (["projects", "articles", "skills", "services", "achievements"].includes(col.name)) {
        await db.collection(col.name).deleteMany({});
        console.log(`Cleared all records from collection: ${col.name}`);
      }
    }
    
    console.log("Database collections successfully cleared!");
    process.exit(0);
  } catch (err) {
    console.error("Error clearing DB:", err.message);
    process.exit(1);
  }
}

clearCollections();
