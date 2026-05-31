const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { getContact, updateContact } = require("../controllers/contactController");

const router = express.Router();

router.get("/", getContact);
router.put("/", authMiddleware, updateContact);

module.exports = router;
