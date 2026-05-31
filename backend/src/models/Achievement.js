const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String, default: "fas fa-award" },
});

module.exports = mongoose.model("Achievement", AchievementSchema);
