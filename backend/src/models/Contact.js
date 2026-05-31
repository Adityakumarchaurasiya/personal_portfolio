const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  linkedin: String,
  github: String,
  youtube: String,
  email: String,
});

module.exports = mongoose.model("Contact", ContactSchema);
