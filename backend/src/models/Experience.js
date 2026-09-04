const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  company: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  order: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Experience", ExperienceSchema);
