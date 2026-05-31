const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  listArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  scrapeArticleMetadata,
} = require("../controllers/articlesController");

const router = express.Router();

router.get("/", listArticles);
router.post("/", authMiddleware, createArticle);
router.post("/scrape", authMiddleware, scrapeArticleMetadata);
router.put("/:id", authMiddleware, updateArticle);
router.delete("/:id", authMiddleware, deleteArticle);

module.exports = router;
