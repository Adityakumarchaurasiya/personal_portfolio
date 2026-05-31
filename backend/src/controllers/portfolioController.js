const Portfolio = require("../models/Portfolio");
const { defaultPortfolio } = require("../data/seedDefaults");

const HERO_FIELDS = ["title", "description", "imageUrl"];

async function getPortfolio(_req, res) {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create(defaultPortfolio);
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateHero(req, res) {
  try {
    const existing = await Portfolio.findOne();
    const hero = {
      ...(existing?.hero?.toObject?.() || existing?.hero || {}),
    };

    for (const field of HERO_FIELDS) {
      if (req.body[field] !== undefined) {
        hero[field] = req.body[field];
      }
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { hero, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateAbout(req, res) {
  try {
    const existing = await Portfolio.findOne();
    const about = {
      ...(existing?.about?.toObject?.() || existing?.about || {}),
      ...req.body,
    };

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { about, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getPortfolio, updateHero, updateAbout };
