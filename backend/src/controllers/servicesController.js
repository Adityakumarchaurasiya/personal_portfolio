const Service = require("../models/Service");
const { defaultServices } = require("../data/seedDefaults");

async function listServices(_req, res) {
  try {
    let services = await Service.find();
    if (services.length === 0) {
      services = await Service.insertMany(defaultServices);
    }
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createService(req, res) {
  try {
    const service = await Service.create(req.body);
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteService(req, res) {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { listServices, createService, deleteService };
