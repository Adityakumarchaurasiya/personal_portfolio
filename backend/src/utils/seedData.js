const Portfolio = require("../models/Portfolio");
const Skill = require("../models/Skill");
const Project = require("../models/Project");
const YouTube = require("../models/YouTube");
const Article = require("../models/Article");
const Contact = require("../models/Contact");
const {
  defaultPortfolio,
  defaultSkills,
  defaultProjects,
  defaultYouTube,
  defaultArticles,
  defaultContact,
} = require("../data/seedDefaults");

async function seedAllData() {
  const channelIdFromEnv = process.env.YOUTUBE_CHANNEL_ID?.trim();

  if ((await Portfolio.countDocuments()) === 0) {
    await Portfolio.create(defaultPortfolio);
    console.log("Seeded default portfolio.");
  }

  if ((await Skill.countDocuments()) === 0) {
    await Skill.insertMany(defaultSkills);
    console.log("Seeded default skills.");
  }

  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany(defaultProjects);
    console.log("Seeded default projects.");
  }

  const handleFromEnv = (process.env.YOUTUBE_CHANNEL_HANDLE || "")
    .trim()
    .replace(/^@/, "");

  if ((await YouTube.countDocuments()) === 0) {
    await YouTube.create({
      ...defaultYouTube,
      ...(handleFromEnv ? { channel: `@${handleFromEnv}` } : {}),
      ...(channelIdFromEnv ? { channelId: channelIdFromEnv } : {}),
    });
    console.log("Seeded default YouTube stats.");
  } else if (channelIdFromEnv) {
    const youtube = await YouTube.findOne();
    if (youtube && !youtube.channelId) {
      youtube.channelId = channelIdFromEnv;
      await youtube.save();
    }
  }

  if ((await Article.countDocuments()) === 0) {
    await Article.insertMany(defaultArticles);
    console.log("Seeded default articles.");
  }

  if ((await Contact.countDocuments()) === 0) {
    await Contact.create(defaultContact);
    console.log("Seeded default contact.");
  }
}

module.exports = { seedAllData };
