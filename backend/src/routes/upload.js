const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { localUpload } = require("../middleware/upload");
const {
  uploadAboutImage,
  uploadHeroImage,
  uploadHeroVideo,
  uploadProjectImage,
  uploadGenericFile,
  getUploadedFiles,
  deleteUploadedFile,
} = require("../controllers/uploadController");

const router = express.Router();

router.post(
  "/about-image",
  authMiddleware,
  localUpload.single("image"),
  uploadAboutImage
);

router.post(
  "/hero-image",
  authMiddleware,
  localUpload.single("image"),
  uploadHeroImage
);

router.post(
  "/hero-video",
  authMiddleware,
  localUpload.single("video"),
  uploadHeroVideo
);

router.post(
  "/project-image",
  authMiddleware,
  localUpload.single("image"),
  uploadProjectImage
);

router.post(
  "/file",
  authMiddleware,
  localUpload.single("file"),
  uploadGenericFile
);

router.get("/files", authMiddleware, getUploadedFiles);
router.delete("/files/:name", authMiddleware, deleteUploadedFile);

module.exports = router;
