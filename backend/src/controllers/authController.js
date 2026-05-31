const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function me(req, res) {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function logout(_req, res) {
  res.json({ message: "Logged out successfully" });
}

async function resetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`Password reset requested for ${email}`);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { login, me, logout, resetPassword };
