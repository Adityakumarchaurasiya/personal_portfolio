const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  login,
  me,
  logout,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", logout);
router.post("/reset-password", resetPassword);

module.exports = router;
