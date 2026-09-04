const fs = require("fs");
const path = require("path");
const Portfolio = require("../models/Portfolio");

const uploadDir = path.join(__dirname, "../../public/uploads");

function getStaticUrl(req, filename) {
  // Construct a dynamic fully resolved URL
  const protocol = req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}/uploads/${filename}`;
}

async function uploadAboutImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = getStaticUrl(req, req.file.filename);
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

    const imageUrl = getStaticUrl(req, req.file.filename);
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

async function uploadHeroVideo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    const videoUrl = getStaticUrl(req, req.file.filename);
    const existing = await Portfolio.findOne();
    const hero = {
      ...(existing?.hero?.toObject?.() || existing?.hero || {}),
      videoUrl,
    };

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { hero, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.json({ videoUrl, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function uploadProjectImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = getStaticUrl(req, req.file.filename);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Generic file upload endpoint
async function uploadGenericFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const url = getStaticUrl(req, req.file.filename);
    res.json({
      url,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// List all files in the uploads folder
async function getUploadedFiles(req, res) {
  try {
    if (!fs.existsSync(uploadDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(uploadDir);
    const fileList = files.map((filename) => {
      const filePath = path.join(uploadDir, filename);
      const stat = fs.statSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      
      let type = "other";
      if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext)) {
        type = "image";
      } else if ([".mp4", ".webm", ".mov", ".mkv"].includes(ext)) {
        type = "video";
      } else if ([".mp3", ".wav", ".ogg"].includes(ext)) {
        type = "audio";
      } else if (ext === ".pdf") {
        type = "pdf";
      }

      return {
        name: filename,
        url: getStaticUrl(req, filename),
        size: stat.size,
        createdAt: stat.birthtime,
        type
      };
    });

    // Sort by creation date descending
    fileList.sort((a, b) => b.createdAt - a.createdAt);

    res.json(fileList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete file from uploads folder
async function deleteUploadedFile(req, res) {
  try {
    const { name } = req.params;
    const filePath = path.join(uploadDir, name);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Prevent directory traversal attacks
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(uploadDir);
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      return res.status(403).json({ message: "Access denied" });
    }

    fs.unlinkSync(filePath);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  uploadAboutImage,
  uploadHeroImage,
  uploadHeroVideo,
  uploadProjectImage,
  uploadGenericFile,
  getUploadedFiles,
  deleteUploadedFile
};
