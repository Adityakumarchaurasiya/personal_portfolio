const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Sanitize file name to avoid path issues
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-");
    const uniqueName = `${file.fieldname}-${baseName}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/", "video/", "audio/", "application/pdf"];
  const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported. Supported types: images, videos, audios, PDFs."));
  }
};

const localUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for video support
  fileFilter
});

// Export as both imageUpload (for compatibility) and localUpload
module.exports = { imageUpload: localUpload, localUpload };
