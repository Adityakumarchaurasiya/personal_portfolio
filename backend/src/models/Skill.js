const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: String,
  icon: String,
  tech: String,
  percentage: { type: Number, default: 80 },
});

module.exports = mongoose.model("Skill", SkillSchema);
