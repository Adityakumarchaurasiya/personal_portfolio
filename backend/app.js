const express = require("express");
const cors = require("cors");

const healthRoutes = require("./src/routes/health");
const authRoutes = require("./src/routes/auth");
const portfolioRoutes = require("./src/routes/portfolio");
const skillsRoutes = require("./src/routes/skills");
const projectsRoutes = require("./src/routes/projects");
const youtubeRoutes = require("./src/routes/youtube");
const githubRoutes = require("./src/routes/github");
const socialRoutes = require("./src/routes/social");
const articlesRoutes = require("./src/routes/articles");
const contactRoutes = require("./src/routes/contact");
const uploadRoutes = require("./src/routes/upload");
const achievementsRoutes = require("./src/routes/achievements");
const servicesRoutes = require("./src/routes/services");
const chatbotRoutes = require("./src/routes/chatbot");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/chatbot", chatbotRoutes);

module.exports = app;
