const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  tech: [String],
  icon: String,
  github: String,
  live: String,
  image: String,
});

module.exports = mongoose.model("Project", ProjectSchema);
