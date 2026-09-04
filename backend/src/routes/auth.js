const express = require("express");
const passport = require("passport");
const { authMiddleware } = require("../middleware/auth");
const {
  login,
  me,
  logout,
  resetPassword,
  confirmResetPassword,
} = require("../controllers/authController");

// Require passport configuration to initialize strategy
require("../config/passport");

const router = express.Router();

router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", logout);
router.post("/reset-password", resetPassword);
router.post("/reset-password/confirm", confirmResetPassword);

// Google OAuth Routes
router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({ 
      message: "Google OAuth is not configured on the server. Please define GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your env settings." 
    });
  }
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google", 
    { session: false, failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=oauth_failed` },
    (err, user) => {
      if (err || !user) {
        console.error("Google OAuth error:", err);
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=oauth_failed`);
      }
      
      // Manually set session and redirect
      req.session.userId = user._id;
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/admin`);
    }
  )(req, res, next);
});

module.exports = router;
