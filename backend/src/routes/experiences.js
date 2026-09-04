const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getAll,
  create,
  update,
  remove,
} = require("../controllers/experiencesController");

const router = express.Router();

router.get("/", getAll);
router.post("/", authMiddleware, create);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

module.exports = router;
