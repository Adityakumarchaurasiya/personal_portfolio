const Contact = require("../models/Contact");
const { defaultContact } = require("../data/seedDefaults");

async function getContact(_req, res) {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create(defaultContact);
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateContact(req, res) {
  try {
    const contact = await Contact.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
    });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getContact, updateContact };
