const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  readTime: { type: String, default: "5 min read" },
  description: String,
  url: String,
  platform: { type: String, default: "other" },
  date: { type: String, default: () => new Date().toISOString().split("T")[0] },
});

module.exports = mongoose.model("Article", ArticleSchema);
