const mongoose = require("mongoose");

const SiteSettingsSchema = new mongoose.Schema({
  siteTitle: { 
    type: String, 
    default: "Aditya Kumar | Software Developer & Content Creator" 
  },
  metaDescription: { 
    type: String, 
    default: "Aditya Kumar's professional software engineering portfolio." 
  },
  metaKeywords: { 
    type: String, 
    default: "aditya, aditya kumar, software developer, content creator" 
  },
  googleAnalyticsId: { 
    type: String, 
    default: "" 
  },
  maintenanceMode: { 
    type: Boolean, 
    default: false 
  },
  customFooterText: { 
    type: String, 
    default: "© 2026 Aditya Kumar. All rights reserved." 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("SiteSettings", SiteSettingsSchema);
