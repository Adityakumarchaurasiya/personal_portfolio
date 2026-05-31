const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function createAdminUser() {
  const existing = await User.findOne({ email: "admin@aditya.dev" });
  if (!existing) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({ email: "admin@aditya.dev", password: hashedPassword });
  }
}

module.exports = { createAdminUser };
