const Skill = require("../models/Skill");
const { defaultSkills } = require("../data/seedDefaults");

async function listSkills(_req, res) {
  try {
    let skills = await Skill.find();
    if (skills.length === 0) {
      skills = await Skill.insertMany(defaultSkills);
    }
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createSkill(req, res) {
  try {
    const skill = await Skill.create(req.body);
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSkill(req, res) {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteSkill(req, res) {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { listSkills, createSkill, updateSkill, deleteSkill };
