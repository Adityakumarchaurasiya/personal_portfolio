const mongoose = require("mongoose");

const mongoUri =
  process.env.MONGODB_URI ;

async function connectDB() {
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
}

module.exports = { connectDB, mongoose };
