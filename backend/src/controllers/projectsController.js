const Project = require("../models/Project");
const { defaultProjects } = require("../data/seedDefaults");

async function listProjects(_req, res) {
  try {
    let projects = await Project.find();
    if (projects.length === 0) {
      projects = await Project.insertMany(defaultProjects);
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createProject(req, res) {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProject(req, res) {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteProject(req, res) {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { listProjects, createProject, updateProject, deleteProject };
