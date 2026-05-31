const express = require("express");
const { handleChatCompletions } = require("../controllers/chatbotController");

const router = express.Router();

router.post("/", handleChatCompletions);

module.exports = router;
