const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your_secret_key_here_change_in_production";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authMiddleware, JWT_SECRET };
