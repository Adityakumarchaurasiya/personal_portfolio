const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({ 
        message: "This account uses Google Login. Please sign in with Google." 
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set user id on session
    req.session.userId = user._id;

    res.json({ user: { id: user._id, email: user.email } });
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

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out, please try again." });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
}

async function resetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate secure reset token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour validity
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      to: user.email,
      subject: "Password Reset Request - Aditya Kumar Portfolio",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your admin account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process within one hour:\n\n` +
            `${resetUrl}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #8B5E3C; border-bottom: 1px solid #eee; padding-bottom: 10px;">Password Reset Request</h2>
          <p>You are receiving this email because a password reset request was initiated for your admin account.</p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #8B5E3C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </p>
          <p style="color: #666; font-size: 0.9em;">This link will expire in 1 hour.</p>
          <p style="color: #999; font-size: 0.8em; border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px;">If you did not request this reset, please ignore this email.</p>
        </div>
      `
    };

    await sendMail(mailOptions);
    res.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function confirmResetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    // Hash and update the password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Optionally notify the user
    try {
      await sendMail({
        to: user.email,
        subject: "Your password has been changed",
        text: `This is a confirmation that the password for your account ${user.email} has just been changed.\n`
      });
    } catch (mailErr) {
      console.warn("Failed to send password change confirmation email:", mailErr.message);
    }

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { login, me, logout, resetPassword, confirmResetPassword };
