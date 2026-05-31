const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  listAchievements,
  createAchievement,
  deleteAchievement,
} = require("../controllers/achievementsController");

const router = express.Router();

router.get("/", listAchievements);
router.post("/", authMiddleware, createAchievement);
router.delete("/:id", authMiddleware, deleteAchievement);

module.exports = router;
