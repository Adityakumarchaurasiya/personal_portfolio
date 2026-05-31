const express = require("express");
const { getSocialOverview } = require("../controllers/socialController");

const router = express.Router();

router.get("/overview", getSocialOverview);

module.exports = router;
