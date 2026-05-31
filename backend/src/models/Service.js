const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    default: "fas fa-cogs",
  },
  price: {
    type: String,
    trim: true,
  },
  features: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
