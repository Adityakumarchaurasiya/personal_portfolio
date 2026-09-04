const fs = require("fs");
const path = require("path");
const Portfolio = require("../models/Portfolio");
const Skill = require("../models/Skill");
const Project = require("../models/Project");
const YouTube = require("../models/YouTube");
const Article = require("../models/Article");
const Contact = require("../models/Contact");
const Service = require("../models/Service");
const Achievement = require("../models/Achievement");
const Experience = require("../models/Experience");
const Testimonial = require("../models/Testimonial");
const SiteSettings = require("../models/SiteSettings");

const {
  defaultPortfolio,
  defaultSkills,
  defaultProjects,
  defaultYouTube,
  defaultArticles,
  defaultContact,
  defaultAchievements,
  defaultServices,
} = require("../data/seedDefaults");

async function purgeMockData() {
  const flagFile = path.join(__dirname, "../../../.db_purged");
  
  if (!fs.existsSync(flagFile)) {
    console.log("--------------------------------------------------");
    console.log("Purging all mock data from MongoDB collections...");
    
    try {
      await Promise.all([
        Skill.deleteMany({}),
        Project.deleteMany({}),
        Service.deleteMany({}),
        Article.deleteMany({}),
        Achievement.deleteMany({}),
        YouTube.deleteMany({}),
        Portfolio.deleteMany({}),
        Contact.deleteMany({}),
        Experience.deleteMany({}),
        Testimonial.deleteMany({}),
        SiteSettings.deleteMany({}),
      ]);
      
      console.log("Mock data successfully purged.");
      
      // Write the flag file to prevent future purges from wiping real data
      fs.writeFileSync(flagFile, `Database mock data purged on ${new Date().toISOString()}`);
      console.log(`Flag file written to ${flagFile}`);
      console.log("--------------------------------------------------");
    } catch (err) {
      console.error("Error purging mock data:", err);
    }
  }
}

async function seedAllData() {
  // Run one-time purge
  await purgeMockData();

  const channelIdFromEnv = process.env.YOUTUBE_CHANNEL_ID?.trim();

  // Initialize Portfolio singleton
  if ((await Portfolio.countDocuments()) === 0) {
    await Portfolio.create(defaultPortfolio);
    console.log("Seeded clean default portfolio.");
  }

  // Initialize Contact singleton
  if ((await Contact.countDocuments()) === 0) {
    await Contact.create(defaultContact);
    console.log("Seeded clean default contact.");
  }

  // Initialize SiteSettings singleton
  if ((await SiteSettings.countDocuments()) === 0) {
    await SiteSettings.create({
      siteTitle: "Aditya Kumar | Software Developer & Content Creator",
      metaDescription: "Aditya Kumar's professional software engineering portfolio.",
      metaKeywords: "aditya, aditya kumar, software developer, content creator",
      googleAnalyticsId: "",
      maintenanceMode: false,
      customFooterText: "© 2026 Aditya Kumar. All rights reserved."
    });
    console.log("Seeded clean default site settings.");
  }

  // Initialize YouTube singleton
  const handleFromEnv = (process.env.YOUTUBE_CHANNEL_HANDLE || "")
    .trim()
    .replace(/^@/, "");

  if ((await YouTube.countDocuments()) === 0) {
    await YouTube.create({
      ...defaultYouTube,
      ...(handleFromEnv ? { channel: `@${handleFromEnv}` } : {}),
      ...(channelIdFromEnv ? { channelId: channelIdFromEnv } : {}),
    });
    console.log("Seeded clean default YouTube stats.");
  } else if (channelIdFromEnv) {
    const youtube = await YouTube.findOne();
    if (youtube && !youtube.channelId) {
      youtube.channelId = channelIdFromEnv;
      await youtube.save();
    }
  }

  // Seed list collections if empty (since defaults are empty arrays, this does nothing for mock data,
  // but keeps the structures safe in case the defaults change in the future)
  if ((await Skill.countDocuments()) === 0 && defaultSkills.length > 0) {
    await Skill.insertMany(defaultSkills);
    console.log("Seeded skills.");
  }

  if ((await Project.countDocuments()) === 0 && defaultProjects.length > 0) {
    await Project.insertMany(defaultProjects);
    console.log("Seeded projects.");
  }

  if ((await Article.countDocuments()) === 0 && defaultArticles.length > 0) {
    await Article.insertMany(defaultArticles);
    console.log("Seeded articles.");
  }

  if ((await Service.countDocuments()) === 0 && defaultServices.length > 0) {
    await Service.insertMany(defaultServices);
    console.log("Seeded services.");
  }

  if ((await Achievement.countDocuments()) === 0 && defaultAchievements.length > 0) {
    await Achievement.insertMany(defaultAchievements);
    console.log("Seeded achievements.");
  }
}

module.exports = { seedAllData };
