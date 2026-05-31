const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectsController");

const router = express.Router();

router.get("/", listProjects);
router.post("/", authMiddleware, createProject);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
