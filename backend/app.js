const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");

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
const experiencesRoutes = require("./src/routes/experiences");
const testimonialsRoutes = require("./src/routes/testimonials");
const settingsRoutes = require("./src/routes/settings");

const app = express();

// Configure CORS to support session cookies from frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "aditya-portfolio-session-secret-key-132456",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Passport initialization
app.use(passport.initialize());

// Route registration
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
app.use("/api/experiences", experiencesRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/settings", settingsRoutes);

module.exports = app;
