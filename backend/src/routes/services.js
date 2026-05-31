const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  listServices,
  createService,
  deleteService,
} = require("../controllers/servicesController");

const router = express.Router();

router.get("/", listServices);
router.post("/", authMiddleware, createService);
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;
