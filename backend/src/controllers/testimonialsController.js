const Testimonial = require("../models/Testimonial");

async function getAll(req, res) {
  try {
    const list = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const { clientName, clientTitle, feedback, avatar, order } = req.body;
    const item = new Testimonial({ clientName, clientTitle, feedback, avatar, order });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { clientName, clientTitle, feedback, avatar, order } = req.body;
    
    const updated = await Testimonial.findByIdAndUpdate(
      id,
      { clientName, clientTitle, feedback, avatar, order },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAll, create, update, remove };
