const SiteSettings = require("../models/SiteSettings");

async function getSettings(req, res) {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSettings(req, res) {
  try {
    const {
      siteTitle,
      metaDescription,
      metaKeywords,
      googleAnalyticsId,
      maintenanceMode,
      customFooterText,
    } = req.body;

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      {
        siteTitle,
        metaDescription,
        metaKeywords,
        googleAnalyticsId,
        maintenanceMode,
        customFooterText,
        updatedAt: Date.now()
      },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { getSettings, updateSettings };
