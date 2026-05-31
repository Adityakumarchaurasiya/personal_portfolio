const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  hero: {
    title: String,
    description: String,
    imageUrl: String,
  },
  about: {
    mission: String,
    journey: String,
    imageUrl: String,
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
