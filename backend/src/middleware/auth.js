const authMiddleware = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized: Please log in." });
  }
  
  // Set req.userId for controllers that expect it
  req.userId = req.session.userId;
  next();
};

module.exports = { authMiddleware };
