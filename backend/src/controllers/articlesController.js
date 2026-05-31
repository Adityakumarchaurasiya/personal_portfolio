const Article = require("../models/Article");
const { defaultArticles } = require("../data/seedDefaults");

async function listArticles(_req, res) {
  try {
    let articles = await Article.find();
    if (articles.length === 0) {
      articles = await Article.insertMany(defaultArticles);
    }
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createArticle(req, res) {
  try {
    const article = await Article.create(req.body);
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateArticle(req, res) {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteArticle(req, res) {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function scrapeArticleMetadata(req, res) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch URL (${response.status})`);
    }

    const html = await response.text();

    // Regex parsing for Title
    let title = "";
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) ||
                        html.match(/<meta\s+name=["']twitter:title["']\s+content=["'](.*?)["']/i);
    if (ogTitleMatch) {
      title = ogTitleMatch[1];
    } else {
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      title = titleMatch ? titleMatch[1] : "";
    }

    // Regex parsing for Description
    let description = "";
    const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) ||
                       html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
                       html.match(/<meta\s+name=["']twitter:description["']\s+content=["'](.*?)["']/i);
    if (ogDescMatch) {
      description = ogDescMatch[1];
    }

    // Unescape HTML entities briefly
    const unescapeHtml = (str) => {
      if (!str) return "";
      return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    };

    title = unescapeHtml(title).trim();
    description = unescapeHtml(description).trim();

    // Determine Platform
    let platform = "other";
    const urlLower = url.toLowerCase();
    if (urlLower.includes("dev.to")) {
      platform = "devto";
    } else if (urlLower.includes("medium.com")) {
      platform = "medium";
    } else if (urlLower.includes("hashnode.dev") || urlLower.includes("hashnode.com") || urlLower.includes("hashnode")) {
      platform = "hashnode";
    }

    // Estimate read time or parse it from title / content length
    const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).length;
    const minutes = Math.max(1, Math.min(30, Math.ceil(words / 400))); // keep it reasonable
    const readTime = `${minutes} min read`;

    res.json({
      title: title || "Untitled Article",
      description: description || "Read full article details on the host platform.",
      url,
      platform,
      readTime,
    });
  } catch (error) {
    // Fallback if fetch fails (e.g. invalid URL, offline)
    // We can parse title from URL slug to be extremely helpful
    let titleFallback = "Article from URL";
    try {
      const parsedUrl = new URL(req.body.url);
      const pathname = parsedUrl.pathname;
      const slug = pathname.split("/").filter(Boolean).pop();
      if (slug) {
        titleFallback = slug
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
    } catch (_) {}

    let platformFallback = "other";
    const urlLower = (req.body.url || "").toLowerCase();
    if (urlLower.includes("dev.to")) platformFallback = "devto";
    else if (urlLower.includes("medium.com")) platformFallback = "medium";
    else if (urlLower.includes("hashnode")) platformFallback = "hashnode";

    res.json({
      title: titleFallback,
      description: "Read full article details on the host platform.",
      url: req.body.url,
      platform: platformFallback,
      readTime: "5 min read",
      error: error.message
    });
  }
}

module.exports = { listArticles, createArticle, updateArticle, deleteArticle, scrapeArticleMetadata };
