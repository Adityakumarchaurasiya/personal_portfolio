const { Readable } = require("stream");
const cloudinary = require("../config/cloudinary");
const Portfolio = require("../models/Portfolio");

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

async function uploadAboutImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const result = await uploadBuffer(req.file.buffer, {
      folder: "portfolio/about",
      resource_type: "image",
    });

    const imageUrl = result.secure_url;
    const existing = await Portfolio.findOne();
    const about = {
      ...(existing?.about?.toObject?.() || existing?.about || {}),
      imageUrl,
    };

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { about, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.json({ imageUrl, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function uploadHeroImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const result = await uploadBuffer(req.file.buffer, {
      folder: "portfolio/hero",
      resource_type: "image",
    });

    const imageUrl = result.secure_url;
    const existing = await Portfolio.findOne();
    const hero = {
      ...(existing?.hero?.toObject?.() || existing?.hero || {}),
      imageUrl,
    };

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { hero, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.json({ imageUrl, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function uploadProjectImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const result = await uploadBuffer(req.file.buffer, {
      folder: "portfolio/projects",
      resource_type: "image",
    });

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { uploadAboutImage, uploadHeroImage, uploadProjectImage };
