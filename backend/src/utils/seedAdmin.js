const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function createAdminUser() {
  const defaultAdmin = await User.findOne({ email: "admin@aditya.dev" });
  if (!defaultAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({ email: "admin@aditya.dev", password: hashedPassword });
  }

  const personalAdmin = await User.findOne({ email: "adityakumar583ak@gmail.com" });
  if (!personalAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({ email: "adityakumar583ak@gmail.com", password: hashedPassword });
  }
}

module.exports = { createAdminUser };
