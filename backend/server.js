const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const { connectDB } = require("./src/config/db");
const { createAdminUser } = require("./src/utils/seedAdmin");
const { seedAllData } = require("./src/utils/seedData");

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectDB();
    await createAdminUser();
    await seedAllData();
  } catch (error) {
    console.warn("MongoDB connection failed:", error.message);
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
