const mongoose = require("mongoose");

const YouTubeSchema = new mongoose.Schema({
  channel: String,
  channelId: String,
  subscribers: String,
  videos: String,
  growth: String,
});

module.exports = mongoose.model("YouTube", YouTubeSchema);
