const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema({
  clientName: { 
    type: String, 
    required: true 
  },
  clientTitle: { 
    type: String 
  },
  feedback: { 
    type: String, 
    required: true 
  },
  avatar: { 
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

module.exports = mongoose.model("Testimonial", TestimonialSchema);
