const Achievement = require("../models/Achievement");
const { defaultAchievements } = require("../data/seedDefaults");

async function listAchievements(_req, res) {
  try {
    let achievements = await Achievement.find();
    if (achievements.length === 0) {
      achievements = await Achievement.insertMany(defaultAchievements);
    }
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createAchievement(req, res) {
  try {
    const achievement = await Achievement.create(req.body);
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteAchievement(req, res) {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { listAchievements, createAchievement, deleteAchievement };
