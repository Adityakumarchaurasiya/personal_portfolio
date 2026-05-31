const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  listSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillsController");

const router = express.Router();

router.get("/", listSkills);
router.post("/", authMiddleware, createSkill);
router.put("/:id", authMiddleware, updateSkill);
router.delete("/:id", authMiddleware, deleteSkill);

module.exports = router;
