const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getYouTube,
  getYouTubeLive,
  updateYouTube,
} = require("../controllers/youtubeController");

const router = express.Router();

router.get("/live", getYouTubeLive);
router.get("/", getYouTube);
router.put("/", authMiddleware, updateYouTube);

module.exports = router;
