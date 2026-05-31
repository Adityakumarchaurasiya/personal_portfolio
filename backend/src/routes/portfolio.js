const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getPortfolio,
  updateHero,
  updateAbout,
} = require("../controllers/portfolioController");

const router = express.Router();

router.get("/", getPortfolio);
router.put("/hero", authMiddleware, updateHero);
router.put("/about", authMiddleware, updateAbout);

module.exports = router;
