const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { imageUpload } = require("../middleware/upload");
const {
  uploadAboutImage,
  uploadHeroImage,
  uploadProjectImage,
} = require("../controllers/uploadController");

const router = express.Router();

router.post(
  "/about-image",
  authMiddleware,
  imageUpload.single("image"),
  uploadAboutImage
);

router.post(
  "/hero-image",
  authMiddleware,
  imageUpload.single("image"),
  uploadHeroImage
);

router.post(
  "/project-image",
  authMiddleware,
  imageUpload.single("image"),
  uploadProjectImage
);

module.exports = router;
