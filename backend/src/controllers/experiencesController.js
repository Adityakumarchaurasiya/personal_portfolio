const Experience = require("../models/Experience");

async function getAll(req, res) {
  try {
    const list = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const { company, role, duration, description, order } = req.body;
    const item = new Experience({ company, role, duration, description, order });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { company, role, duration, description, order } = req.body;
    
    const updated = await Experience.findByIdAndUpdate(
      id,
      { company, role, duration, description, order },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Experience record not found" });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Experience.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Experience record not found" });
    }
    res.json({ message: "Experience record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAll, create, update, remove };
