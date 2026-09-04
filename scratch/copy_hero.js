const fs = require("fs");
const path = require("path");

const srcPath = `C:\\Users\\adity\\.gemini\\antigravity\\brain\\e9be23e8-5d48-4a10-ba6a-afb46844785e\\hero_developer_banner_1788534049374.png`;

const destFrontend = path.join(__dirname, "../frontend/public/hero_developer_banner.png");
const destBackend = path.join(__dirname, "../backend/public/uploads/hero_developer_banner.png");

try {
  fs.copyFileSync(srcPath, destFrontend);
  console.log("Copied to frontend public:", destFrontend);
} catch (err) {
  console.error("Error copying to frontend:", err.message);
}

try {
  const uploadDir = path.dirname(destBackend);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  fs.copyFileSync(srcPath, destBackend);
  console.log("Copied to backend uploads:", destBackend);
} catch (err) {
  console.error("Error copying to backend:", err.message);
}
