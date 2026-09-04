import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const TABS = [
  { id: "portfolio", label: "Profile", icon: "fa-solid fa-user-gear" },
  { id: "skills", label: "Skills", icon: "fa-solid fa-code" },
  { id: "projects", label: "Projects", icon: "fa-solid fa-laptop-code" },
  { id: "services", label: "Services", icon: "fa-solid fa-handshake" },
  { id: "youtube", label: "YouTube Stats", icon: "fa-brands fa-youtube" },
  { id: "articles", label: "Articles", icon: "fa-solid fa-newspaper" },
  { id: "achievements", label: "Achievements", icon: "fa-solid fa-trophy" },
  { id: "experience", label: "Experience", icon: "fa-solid fa-briefcase" },
  { id: "testimonials", label: "Testimonials", icon: "fa-solid fa-comments" },
  { id: "contact", label: "Contact & Social", icon: "fa-solid fa-envelope" },
  { id: "settings", label: "SEO & Site Settings", icon: "fa-solid fa-sliders" },
  { id: "media", label: "Media Manager", icon: "fa-solid fa-photo-film" },
];

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="admin-pagination" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="btn btn-secondary btn-sm"
      >
        <i className="fa-solid fa-chevron-left"></i> Prev
      </button>
      <span className="pagination-text" style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 600 }}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="btn btn-secondary btn-sm"
      >
        Next <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
}

function guessPlatform(url) {
  const urlLower = url.toLowerCase();
  if (urlLower.includes("dev.to")) return "devto";
  if (urlLower.includes("medium.com")) return "medium";
  if (urlLower.includes("hashnode")) return "hashnode";
  return "other";
}

function AdminPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("portfolio");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Data states
  const [portfolio, setPortfolio] = useState({ hero: {}, about: {} });
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [youtube, setYoutube] = useState({});
  const [articles, setArticles] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [contact, setContact] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [mediaFiles, setMediaFiles] = useState([]);

  // Form states
  const [skillForm, setSkillForm] = useState({ name: "", icon: "", tech: "Frontend", percentage: 80 });
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    tech: "",
    icon: "",
    github: "",
    live: "",
    image: "",
  });
  const [articleForm, setArticleForm] = useState({ title: "", readTime: "" });
  const [achievementForm, setAchievementForm] = useState({ title: "", desc: "", icon: "fas fa-award" });
  const [experienceForm, setExperienceForm] = useState({ company: "", role: "", duration: "", description: "" });
  const [testimonialForm, setTestimonialForm] = useState({ clientName: "", clientTitle: "", feedback: "", avatar: "" });
  const [articleUrl, setArticleUrl] = useState("");
  const [fetchingArticle, setFetchingArticle] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    icon: "fas fa-cogs",
    price: "",
    features: "",
  });

  // Media files & uploads
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [heroVideoFile, setHeroVideoFile] = useState(null);
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);
  const [genericFile, setGenericFile] = useState(null);
  const [uploadingGeneric, setUploadingGeneric] = useState(false);

  // Search & Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const showFeedback = (successText) => {
    setMessage(successText);
    setError("");
    setTimeout(() => setMessage(""), 4000);
  };

  const showError = (err) => {
    setError(err.message || "Something went wrong.");
    setMessage("");
  };

  const loadAll = useCallback(async () => {
    try {
      const [
        portfolioData,
        skillsData,
        projectsData,
        youtubeData,
        articlesData,
        contactData,
        achievementsData,
        servicesData,
        expData,
        testData,
        settingsData,
        mediaData,
      ] = await Promise.all([
        api.getPortfolio().catch(() => ({ hero: {}, about: {} })),
        api.getSkills().catch(() => []),
        api.getProjects().catch(() => []),
        api.getYouTube().catch(() => ({})),
        api.getArticles().catch(() => []),
        api.getContact().catch(() => ({})),
        api.getAchievements().catch(() => []),
        api.getServices().catch(() => []),
        api.getExperiences().catch(() => []),
        api.getTestimonials().catch(() => []),
        api.getSettings().catch(() => ({})),
        api.getMediaFiles().catch(() => []),
      ]);

      setPortfolio(portfolioData);
      setSkills(skillsData);
      setProjects(projectsData);
      setYoutube(youtubeData);
      setArticles(articlesData);
      setContact(contactData);
      setAchievements(achievementsData);
      setServices(servicesData);
      setExperiences(expData);
      setTestimonials(testData);
      setSiteSettings(settingsData);
      setMediaFiles(mediaData);
    } catch (err) {
      showError(err);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Reset pagination on tab/search change
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
  }, [tab]);

  // Handlers for Portfolio
  const saveHero = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        title: portfolio.hero?.title || "",
        description: portfolio.hero?.description || "",
        imageUrl: portfolio.hero?.imageUrl || "",
        videoUrl: portfolio.hero?.videoUrl || "",
      };
      const updated = await api.updatePortfolioHero(payload);
      setPortfolio(updated);
      showFeedback("Home hero updated successfully.");
    } catch (err) {
      showError(err);
    }
  };

  const uploadHeroImage = async () => {
    if (!heroImageFile) return showError(new Error("Choose an image file first."));
    setUploadingHeroImage(true);
    try {
      const result = await api.uploadHeroImage(heroImageFile);
      setPortfolio(result.portfolio);
      setHeroImageFile(null);
      showFeedback("Hero image uploaded successfully.");
    } catch (err) {
      showError(err);
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const uploadHeroVideo = async () => {
    if (!heroVideoFile) return showError(new Error("Choose a video file first."));
    setUploadingHeroVideo(true);
    try {
      const result = await api.uploadHeroVideo(heroVideoFile);
      setPortfolio(result.portfolio);
      setHeroVideoFile(null);
      showFeedback("Hero video uploaded successfully.");
    } catch (err) {
      showError(err);
    } finally {
      setUploadingHeroVideo(false);
    }
  };

  const saveAbout = async (event) => {
    event.preventDefault();
    try {
      const updated = await api.updatePortfolioAbout(portfolio.about);
      setPortfolio(updated);
      showFeedback("About section updated successfully.");
    } catch (err) {
      showError(err);
    }
  };

  const uploadAboutImage = async () => {
    if (!aboutImageFile) return showError(new Error("Choose an image file first."));
    setUploadingAboutImage(true);
    try {
      const result = await api.uploadAboutImage(aboutImageFile);
      setPortfolio(result.portfolio);
      setAboutImageFile(null);
      showFeedback("About profile image uploaded successfully.");
    } catch (err) {
      showError(err);
    } finally {
      setUploadingAboutImage(false);
    }
  };

  // Handlers for Skills
  const addSkill = async (event) => {
    event.preventDefault();
    try {
      const created = await api.createSkill(skillForm);
      setSkills((prev) => [...prev, created]);
      setSkillForm({ name: "", icon: "", tech: "Frontend", percentage: 80 });
      showFeedback("Skill added successfully.");
    } catch (err) {
      showError(err);
    }
  };

  const removeSkill = async (id) => {
    try {
      await api.deleteSkill(id);
      setSkills((prev) => prev.filter((item) => item._id !== id));
      showFeedback("Skill deleted.");
    } catch (err) {
      showError(err);
    }
  };

  // Handlers for Projects
  const addProject = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...projectForm,
        tech: typeof projectForm.tech === "string"
          ? projectForm.tech.split(",").map((item) => item.trim()).filter(Boolean)
          : projectForm.tech,
      };
      const created = await api.createProject(payload);
      setProjects((prev) => [...prev, created]);
      setProjectForm({ title: "", description: "", tech: "", icon: "", github: "", live: "", image: "" });
      showFeedback("Project added successfully.");
    } catch (err) {
      showError(err);
    }
  };

  const uploadProjectImage = async () => {
    if (!projectImageFile) return showError(new Error("Choose an image file first."));
    setUploadingProjectImage(true);
    try {
      const result = await api.uploadProjectImage(projectImageFile);
      setProjectForm((prev) => ({ ...prev, image: result.imageUrl }));
      setProjectImageFile(null);
      showFeedback("Project preview image uploaded.");
    } catch (err) {
      showError(err);
    } finally {
      setUploadingProjectImage(false);
    }
  };

  const removeProject = async (id) => {
    try {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((item) => item._id !== id));
      showFeedback("Project deleted.");
    } catch (err) {
      showError(err);
    }
  };

  // Handlers for Experiences
  const addExperience = async (event) => {
    event.preventDefault();
    try {
      const created = await api.createExperience(experienceForm);
      setExperiences((prev) => [...prev, created]);
      setExperienceForm({ company: "", role: "", duration: "", description: "" });
      showFeedback("Experience entry added successfully.");
    } catch (err) {
      showError(err);
    }
  };

  const removeExperience = async (id) => {
    try {
      await api.deleteExperience(id);
      setExperiences((prev) => prev.filter((item) => item._id !== id));
      showFeedback("Experience entry deleted.");
    } catch (err) {
      showError(err);
    }
  };

  // Handlers for Testimonials
  const addTestimonial = async (event) => {
    event.preventDefault();
    try {
      const created = await api.createTestimonial(testimonialForm);
      setTestimonials((prev) => [...prev, created]);
      setTestimonialForm({ clientName: "", clientTitle: "", feedback: "", avatar: "" });
      showFeedback("Testimonial added successfully.");
    } catch (err) {
      showError(err);
    }
  };

  const removeTestimonial = async (id) => {
    try {
      await api.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((item) => item._id !== id));
      showFeedback("Testimonial deleted.");
    } catch (err) {
      showError(err);
    }
  };

  // Handlers for Settings
  const saveSettings = async (event) => {
    event.preventDefault();
    try {
      const updated = await api.updateSettings(siteSettings);
      setSiteSettings(updated);
      showFeedback("Site and SEO settings updated successfully.");
    } catch (err) {
      showError(err);
    }
  };

  // Handlers for Media Manager
  const uploadFileGeneric = async () => {
    if (!genericFile) return showError(new Error("Choose a file to upload."));
    setUploadingGeneric(true);
    try {
      await api.uploadGenericFile(genericFile);
      setGenericFile(null);
      const mediaData = await api.getMediaFiles();
      setMediaFiles(mediaData);
      showFeedback("File uploaded successfully to local storage.");
    } catch (err) {
      showError(err);
    } finally {
      setUploadingGeneric(false);
    }
  };

  const removeMediaFile = async (name) => {
    try {
      await api.deleteMediaFile(name);
      setMediaFiles((prev) => prev.filter((f) => f.name !== name));
      showFeedback("File deleted from local server.");
    } catch (err) {
      showError(err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showFeedback("URL copied to clipboard!");
  };

  // YouTube, Articles, Services, Contact handlers
  const saveYouTube = async (event) => {
    event.preventDefault();
    try {
      const updated = await api.updateYouTube(youtube);
      setYoutube(updated);
      showFeedback("YouTube section updated.");
    } catch (err) {
      showError(err);
    }
  };

  const addArticle = async (event) => {
    event.preventDefault();
    try {
      const created = await api.createArticle(articleForm);
      setArticles((prev) => [...prev, created]);
      setArticleForm({ title: "", readTime: "" });
      showFeedback("Article added.");
    } catch (err) {
      showError(err);
    }
  };

  const scrapeArticle = async (event) => {
    event.preventDefault();
    if (!articleUrl) return;
    setFetchingArticle(true);
    showFeedback("Fetching article metadata...");
    try {
      const scraped = await api.scrapeArticle(articleUrl);
      const created = await api.createArticle({
        title: scraped.title,
        description: scraped.description,
        url: scraped.url,
        platform: scraped.platform,
        readTime: scraped.readTime,
      });
      setArticles((prev) => [created, ...prev]);
      setArticleUrl("");
      showFeedback("Article scraped and published successfully!");
    } catch (err) {
      showError(err);
    } finally {
      setFetchingArticle(false);
    }
  };

  const removeArticle = async (id) => {
    try {
      await api.deleteArticle(id);
      setArticles((prev) => prev.filter((item) => item._id !== id));
      showFeedback("Article deleted.");
    } catch (err) {
      showError(err);
    }
  };

  const addAchievement = async (event) => {
    event.preventDefault();
    try {
      const created = await api.createAchievement(achievementForm);
      setAchievements((prev) => [...prev, created]);
      setAchievementForm({ title: "", desc: "", icon: "fas fa-award" });
      showFeedback("Achievement/Milestone added.");
    } catch (err) {
      showError(err);
    }
  };

  const removeAchievement = async (id) => {
    try {
      await api.deleteAchievement(id);
      setAchievements((prev) => prev.filter((item) => item._id !== id));
      showFeedback("Achievement deleted.");
    } catch (err) {
      showError(err);
    }
  };

  const addService = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...serviceForm,
        features: typeof serviceForm.features === "string"
          ? serviceForm.features.split(",").map((item) => item.trim()).filter(Boolean)
          : serviceForm.features,
      };
      const created = await api.createService(payload);
      setServices((prev) => [...prev, created]);
      setServiceForm({ title: "", description: "", icon: "fas fa-cogs", price: "", features: "" });
      showFeedback("Service added.");
    } catch (err) {
      showError(err);
    }
  };

  const removeService = async (id) => {
    try {
      await api.deleteService(id);
      setServices((prev) => prev.filter((item) => item._id !== id));
      showFeedback("Service deleted.");
    } catch (err) {
      showError(err);
    }
  };

  const saveContact = async (event) => {
    event.preventDefault();
    try {
      const updated = await api.updateContact(contact);
      setContact(updated);
      showFeedback("Contact details updated successfully.");
    } catch (err) {
      showError(err);
    }
  };

  // Helper filter & paginate function
  const getFilteredItems = (items, fieldsToSearch = ["name", "title"]) => {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter((item) =>
      fieldsToSearch.some((field) => item[field]?.toLowerCase().includes(term))
    );
  };

  const paginate = (items) => {
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    return { paginatedItems, totalPages };
  };

  return (
    <section className="section admin-section">
      <div className="section-inner admin-grid-container">
        
        {/* Sidebar Nav Component */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <i className="fa-solid fa-shield-halved brand-logo"></i>
            <div>
              <h3>Admin Console</h3>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          
          <nav className="admin-nav-tabs">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-nav-tab ${tab === item.id ? "active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                <i className={`${item.icon} nav-tab-icon`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="admin-sidebar-footer">
            <Link to="/" className="btn btn-secondary sidebar-btn">
              <i className="fa-solid fa-globe"></i> View Site
            </Link>
            <button type="button" className="btn btn-danger sidebar-btn" onClick={logout}>
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-content-area">
          <header className="content-header">
            <h2>
              <i className={`${TABS.find((t) => t.id === tab)?.icon} header-tab-icon`}></i>
              {TABS.find((t) => t.id === tab)?.label}
            </h2>
            <div className="header-status">
              {message && <span className="status-toast success"><i className="fa-solid fa-circle-check"></i> {message}</span>}
              {error && <span className="status-toast error"><i className="fa-solid fa-circle-exclamation"></i> {error}</span>}
            </div>
          </header>

          {/* Top Dashboard Metrics Stats Row */}
          <div className="dashboard-stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div className="stat-metric-card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
              <i className="fa-solid fa-laptop-code" style={{ color: "var(--accent)", fontSize: "1.2rem" }}></i>
              <h4 style={{ margin: "0.4rem 0 0", fontSize: "1.3rem" }}>{projects.length}</h4>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Projects</span>
            </div>
            <div className="stat-metric-card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
              <i className="fa-solid fa-code" style={{ color: "#10b981", fontSize: "1.2rem" }}></i>
              <h4 style={{ margin: "0.4rem 0 0", fontSize: "1.3rem" }}>{skills.length}</h4>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Skills</span>
            </div>
            <div className="stat-metric-card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
              <i className="fa-solid fa-newspaper" style={{ color: "#3b82f6", fontSize: "1.2rem" }}></i>
              <h4 style={{ margin: "0.4rem 0 0", fontSize: "1.3rem" }}>{articles.length}</h4>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Articles</span>
            </div>
            <div className="stat-metric-card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
              <i className="fa-solid fa-handshake" style={{ color: "#f59e0b", fontSize: "1.2rem" }}></i>
              <h4 style={{ margin: "0.4rem 0 0", fontSize: "1.3rem" }}>{services.length}</h4>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Services</span>
            </div>
            <div className="stat-metric-card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
              <i className="fa-solid fa-briefcase" style={{ color: "#8b5cf6", fontSize: "1.2rem" }}></i>
              <h4 style={{ margin: "0.4rem 0 0", fontSize: "1.3rem" }}>{experiences.length}</h4>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Experiences</span>
            </div>
          </div>

          <div className="admin-panel-card">
            
            {/* PORTFOLIO TAB */}
            {tab === "portfolio" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={saveHero}>
                  <h3>Hero Section Settings</h3>
                  <label>
                    Hero Title
                    <input
                      value={portfolio.hero?.title || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, title: e.target.value },
                        }))
                      }
                      placeholder="e.g. Crafting digital experiences with purpose."
                    />
                  </label>
                  <label>
                    Hero Description
                    <textarea
                      rows={3}
                      value={portfolio.hero?.description || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, description: e.target.value },
                        }))
                      }
                      placeholder="Bio description..."
                    />
                  </label>
                  
                  {/* Hero Image Upload */}
                  <div className="media-uploader-card">
                    <div className="uploader-input">
                      <label className="file-input-wrapper">
                        <i className="fa-solid fa-cloud-arrow-up"></i> Choose Cover Image...
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      {heroImageFile && <span className="file-selected-name">{heroImageFile.name}</span>}
                    </div>
                    {portfolio.hero?.imageUrl && (
                      <div className="preview-container">
                        <img src={portfolio.hero.imageUrl} alt="Hero preview" className="thumbnail-preview" />
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary upload-action-btn"
                      onClick={uploadHeroImage}
                      disabled={uploadingHeroImage || !heroImageFile}
                    >
                      <i className="fa-solid fa-upload"></i> {uploadingHeroImage ? "Uploading…" : "Upload Image"}
                    </button>
                  </div>

                  {/* Hero Video Upload */}
                  <div className="media-uploader-card" style={{ marginTop: "0.5rem" }}>
                    <div className="uploader-input">
                      <label className="file-input-wrapper">
                        <i className="fa-solid fa-video"></i> Choose Hero Video (MP4/WebM)...
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setHeroVideoFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      {heroVideoFile && <span className="file-selected-name">{heroVideoFile.name}</span>}
                    </div>
                    {portfolio.hero?.videoUrl && (
                      <div className="preview-container" style={{ width: "100px", height: "60px" }}>
                        <video src={portfolio.hero.videoUrl} className="thumbnail-preview" muted />
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary upload-action-btn"
                      onClick={uploadHeroVideo}
                      disabled={uploadingHeroVideo || !heroVideoFile}
                    >
                      <i className="fa-solid fa-upload"></i> {uploadingHeroVideo ? "Uploading…" : "Upload Video"}
                    </button>
                  </div>
                  
                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-floppy-disk"></i> Save Hero Changes
                  </button>
                </form>

                <hr className="pane-divider" />

                <form className="admin-form-group" onSubmit={saveAbout}>
                  <h3>About Section Settings</h3>
                  <label>
                    Mission Text
                    <textarea
                      rows={3}
                      value={portfolio.about?.mission || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          about: { ...prev.about, mission: e.target.value },
                        }))
                      }
                    />
                  </label>
                  <label>
                    Journey Bio Text
                    <textarea
                      rows={4}
                      value={portfolio.about?.journey || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          about: { ...prev.about, journey: e.target.value },
                        }))
                      }
                    />
                  </label>

                  <div className="media-uploader-card">
                    <div className="uploader-input">
                      <label className="file-input-wrapper">
                        <i className="fa-solid fa-cloud-arrow-up"></i> Choose Profile Image...
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setAboutImageFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      {aboutImageFile && <span className="file-selected-name">{aboutImageFile.name}</span>}
                    </div>
                    {portfolio.about?.imageUrl && (
                      <div className="preview-container">
                        <img src={portfolio.about.imageUrl} alt="About preview" className="thumbnail-preview" />
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary upload-action-btn"
                      onClick={uploadAboutImage}
                      disabled={uploadingAboutImage || !aboutImageFile}
                    >
                      <i className="fa-solid fa-upload"></i> {uploadingAboutImage ? "Uploading…" : "Upload Image"}
                    </button>
                  </div>
                  
                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-floppy-disk"></i> Save About Changes
                  </button>
                </form>
              </div>
            )}

            {/* SKILLS TAB */}
            {tab === "skills" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={addSkill}>
                  <h3>Add Skill</h3>
                  <div className="form-row">
                    <label className="form-col">
                      Name
                      <input
                        value={skillForm.name}
                        onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                        required
                        placeholder="React, Python..."
                      />
                    </label>
                    <label className="form-col">
                      Category Label
                      <select
                        value={skillForm.tech}
                        onChange={(e) => setSkillForm({ ...skillForm, tech: e.target.value })}
                        required
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="UI/UX">UI/UX</option>
                        <option value="Cloud">Cloud</option>
                        <option value="AI">AI</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Full Stack">Full Stack</option>
                      </select>
                    </label>
                  </div>
                  <div className="form-row">
                    <label className="form-col">
                      Icon class (Font Awesome)
                      <input
                        value={skillForm.icon}
                        onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                        placeholder="fa-brands fa-react"
                      />
                    </label>
                    <label className="form-col">
                      Percentage (0 - 100%)
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skillForm.percentage}
                        onChange={(e) => setSkillForm({ ...skillForm, percentage: parseInt(e.target.value) || 80 })}
                        required
                      />
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-plus"></i> Add Skill
                  </button>
                </form>

                <hr className="pane-divider" />

                <div className="list-controls-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3>Current Skills ({skills.length})</h3>
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: "220px", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                  />
                </div>

                {(() => {
                  const filtered = getFilteredItems(skills, ["name", "tech"]);
                  const { paginatedItems, totalPages } = paginate(filtered);

                  if (filtered.length === 0) {
                    return <p className="no-data-msg"><i className="fa-solid fa-folder-open"></i> No skills matching search.</p>;
                  }

                  return (
                    <>
                      <ul className="admin-items-list">
                        {paginatedItems.map((skill) => (
                          <li key={skill._id} className="admin-item-row">
                            <div className="item-meta">
                              <i className={`${skill.icon || 'fa-solid fa-code'} item-row-icon`}></i>
                              <div>
                                <strong className="item-title">{skill.name}</strong>
                                <span className="item-subtitle">{skill.tech || "General"} · {skill.percentage}%</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-icon-danger"
                              onClick={() => removeSkill(skill._id)}
                              title="Delete Skill"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                  );
                })()}
              </div>
            )}

            {/* PROJECTS TAB */}
            {tab === "projects" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={addProject}>
                  <h3>Add Project</h3>
                  <label>
                    Project Title
                    <input
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    />
                  </label>
                  <div className="form-row">
                    <label className="form-col">
                      Tech Stack (comma-separated)
                      <input
                        value={projectForm.tech}
                        onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                      />
                    </label>
                    <label className="form-col">
                      Icon class
                      <input
                        value={projectForm.icon}
                        onChange={(e) => setProjectForm({ ...projectForm, icon: e.target.value })}
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label className="form-col">
                      GitHub URL
                      <input
                        value={projectForm.github || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                      />
                    </label>
                    <label className="form-col">
                      Live URL
                      <input
                        value={projectForm.live || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                      />
                    </label>
                  </div>
                  
                  <div className="media-uploader-card">
                    <div className="uploader-input">
                      <label className="file-input-wrapper">
                        <i className="fa-solid fa-cloud-arrow-up"></i> Choose Cover Image...
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProjectImageFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      {projectImageFile && <span className="file-selected-name">{projectImageFile.name}</span>}
                    </div>
                    {projectForm.image && (
                      <div className="preview-container">
                        <img src={projectForm.image} alt="Preview" className="thumbnail-preview" />
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary upload-action-btn"
                      onClick={uploadProjectImage}
                      disabled={uploadingProjectImage || !projectImageFile}
                    >
                      <i className="fa-solid fa-upload"></i> Upload
                    </button>
                  </div>

                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-plus"></i> Add Project
                  </button>
                </form>

                <hr className="pane-divider" />

                <div className="list-controls-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3>Current Projects ({projects.length})</h3>
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: "220px", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                  />
                </div>

                {(() => {
                  const filtered = getFilteredItems(projects, ["title", "description"]);
                  const { paginatedItems, totalPages } = paginate(filtered);

                  if (filtered.length === 0) {
                    return <p className="no-data-msg"><i className="fa-solid fa-folder-open"></i> No projects found.</p>;
                  }

                  return (
                    <>
                      <ul className="admin-items-list">
                        {paginatedItems.map((project) => (
                          <li key={project._id} className="admin-item-row">
                            <div className="item-meta">
                              {project.image ? (
                                <img src={project.image} alt="" className="list-row-thumbnail" />
                              ) : (
                                <i className="fa-solid fa-folder item-row-icon"></i>
                              )}
                              <div>
                                <strong className="item-title">{project.title}</strong>
                                <span className="item-subtitle">{Array.isArray(project.tech) ? project.tech.join(" · ") : project.tech}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-icon-danger"
                              onClick={() => removeProject(project._id)}
                              title="Delete Project"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                  );
                })()}
              </div>
            )}

            {/* SERVICES TAB */}
            {tab === "services" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={addService}>
                  <h3>Add Service Offer</h3>
                  <label>
                    Title
                    <input
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      rows={2}
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      required
                    />
                  </label>
                  <div className="form-row">
                    <label className="form-col">
                      Icon class
                      <input
                        value={serviceForm.icon}
                        onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                      />
                    </label>
                    <label className="form-col">
                      Price Details
                      <input
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        placeholder="Starting from $2,500"
                      />
                    </label>
                  </div>
                  <label>
                    Features (comma-separated)
                    <input
                      value={serviceForm.features}
                      onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                    />
                  </label>
                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-plus"></i> Add Service
                  </button>
                </form>

                <hr className="pane-divider" />

                <h3>Current Services ({services.length})</h3>
                <ul className="admin-items-list">
                  {services.map((item) => (
                    <li key={item._id} className="admin-item-row">
                      <div className="item-meta">
                        <i className={`${item.icon || 'fas fa-cogs'} item-row-icon`}></i>
                        <div>
                          <strong className="item-title">{item.title}</strong>
                          <span className="item-subtitle">{item.price || "Custom Quote"}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-icon-danger"
                        onClick={() => removeService(item._id)}
                        title="Delete Service"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {tab === "experience" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={addExperience}>
                  <h3>Add Work Experience</h3>
                  <div className="form-row">
                    <label className="form-col">
                      Company Name
                      <input
                        value={experienceForm.company}
                        onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                        required
                        placeholder="Google, Freelance..."
                      />
                    </label>
                    <label className="form-col">
                      Job Role
                      <input
                        value={experienceForm.role}
                        onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                        required
                        placeholder="Senior Software Developer..."
                      />
                    </label>
                  </div>
                  <label>
                    Duration
                    <input
                      value={experienceForm.duration}
                      onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })}
                      required
                      placeholder="2024 - Present"
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      rows={3}
                      value={experienceForm.description}
                      onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                      placeholder="Key contributions and achievements..."
                    />
                  </label>
                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-plus"></i> Add Experience
                  </button>
                </form>

                <hr className="pane-divider" />

                <h3>Work Experience History ({experiences.length})</h3>
                {experiences.length === 0 ? (
                  <p className="no-data-msg"><i className="fa-solid fa-folder-open"></i> No experience records logged.</p>
                ) : (
                  <ul className="admin-items-list">
                    {experiences.map((exp) => (
                      <li key={exp._id} className="admin-item-row">
                        <div className="item-meta">
                          <i className="fa-solid fa-briefcase item-row-icon"></i>
                          <div>
                            <strong className="item-title">{exp.role} @ {exp.company}</strong>
                            <span className="item-subtitle">{exp.duration}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-icon-danger"
                          onClick={() => removeExperience(exp._id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* TESTIMONIALS TAB */}
            {tab === "testimonials" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={addTestimonial}>
                  <h3>Add Client Testimonial</h3>
                  <div className="form-row">
                    <label className="form-col">
                      Client Name
                      <input
                        value={testimonialForm.clientName}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                        required
                      />
                    </label>
                    <label className="form-col">
                      Client Title/Role
                      <input
                        value={testimonialForm.clientTitle}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, clientTitle: e.target.value })}
                        placeholder="CEO at TechCorp"
                      />
                    </label>
                  </div>
                  <label>
                    Feedback
                    <textarea
                      rows={3}
                      value={testimonialForm.feedback}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, feedback: e.target.value })}
                      required
                    />
                  </label>
                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-plus"></i> Add Testimonial
                  </button>
                </form>

                <hr className="pane-divider" />

                <h3>Client Testimonials ({testimonials.length})</h3>
                {testimonials.length === 0 ? (
                  <p className="no-data-msg"><i className="fa-solid fa-folder-open"></i> No testimonials added yet.</p>
                ) : (
                  <ul className="admin-items-list">
                    {testimonials.map((item) => (
                      <li key={item._id} className="admin-item-row">
                        <div className="item-meta">
                          <i className="fa-solid fa-quote-left item-row-icon"></i>
                          <div>
                            <strong className="item-title">{item.clientName} ({item.clientTitle || "Client"})</strong>
                            <span className="item-subtitle">&quot;{item.feedback}&quot;</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-icon-danger"
                          onClick={() => removeTestimonial(item._id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* SEO & SITE SETTINGS TAB */}
            {tab === "settings" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={saveSettings}>
                  <h3>SEO &amp; Global Site Settings</h3>
                  <label>
                    Browser Tab Title
                    <input
                      value={siteSettings.siteTitle || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteTitle: e.target.value })}
                      placeholder="Aditya Kumar | Software Developer & Content Creator"
                    />
                  </label>
                  <label>
                    Meta Description
                    <textarea
                      rows={3}
                      value={siteSettings.metaDescription || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, metaDescription: e.target.value })}
                      placeholder="SEO page description..."
                    />
                  </label>
                  <label>
                    Meta Keywords (comma-separated)
                    <input
                      value={siteSettings.metaKeywords || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, metaKeywords: e.target.value })}
                      placeholder="aditya kumar, software developer, full stack"
                    />
                  </label>
                  <label>
                    Google Analytics Tracking ID
                    <input
                      value={siteSettings.googleAnalyticsId || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, googleAnalyticsId: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </label>
                  <label>
                    Custom Footer Copyright Text
                    <input
                      value={siteSettings.customFooterText || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, customFooterText: e.target.value })}
                    />
                  </label>

                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-floppy-disk"></i> Save Settings
                  </button>
                </form>
              </div>
            )}

            {/* MEDIA MANAGER TAB */}
            {tab === "media" && (
              <div className="tab-pane">
                <div className="admin-form-group">
                  <h3>Media File Manager</h3>
                  <p className="muted">Upload and manage local images and video files stored on your server.</p>
                  
                  <div className="media-uploader-card">
                    <div className="uploader-input">
                      <label className="file-input-wrapper">
                        <i className="fa-solid fa-cloud-arrow-up"></i> Select File (Image/Video/PDF)...
                        <input
                          type="file"
                          onChange={(e) => setGenericFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      {genericFile && <span className="file-selected-name">{genericFile.name}</span>}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary upload-action-btn"
                      onClick={uploadFileGeneric}
                      disabled={uploadingGeneric || !genericFile}
                    >
                      <i className="fa-solid fa-upload"></i> {uploadingGeneric ? "Uploading…" : "Upload to Server"}
                    </button>
                  </div>
                </div>

                <hr className="pane-divider" />

                <div className="list-controls-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3>Uploaded Files ({mediaFiles.length})</h3>
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: "220px", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                  />
                </div>

                {(() => {
                  const filtered = getFilteredItems(mediaFiles, ["name", "url"]);
                  const { paginatedItems, totalPages } = paginate(filtered);

                  if (filtered.length === 0) {
                    return <p className="no-data-msg"><i className="fa-solid fa-photo-film"></i> No media files found.</p>;
                  }

                  return (
                    <>
                      <div className="media-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
                        {paginatedItems.map((file) => (
                          <div key={file.name} className="media-card-item" style={{ background: "var(--surface-soft)", border: "1px solid var(--border)", borderRadius: "10px", padding: "0.8rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <div style={{ width: "100%", height: "100px", borderRadius: "6px", overflow: "hidden", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {file.type === "image" ? (
                                <img src={file.url} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : file.type === "video" ? (
                                <video src={file.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                              ) : (
                                <i className="fa-solid fa-file" style={{ fontSize: "2rem", color: "var(--muted)" }}></i>
                              )}
                            </div>
                            <span style={{ fontSize: "0.75rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={file.name}>
                              {file.name}
                            </span>
                            <div style={{ display: "flex", gap: "0.4rem", marginTop: "auto" }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ flex: 1, fontSize: "0.75rem", padding: "0.3rem" }}
                                onClick={() => copyToClipboard(file.url)}
                              >
                                <i className="fa-solid fa-copy"></i> Copy
                              </button>
                              <button
                                type="button"
                                className="btn btn-icon-danger"
                                style={{ width: "30px", height: "30px" }}
                                onClick={() => removeMediaFile(file.name)}
                              >
                                <i className="fa-solid fa-trash-can" style={{ fontSize: "0.8rem" }}></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                  );
                })()}
              </div>
            )}

            {/* YOUTUBE, ARTICLES, ACHIEVEMENTS, CONTACT TABS */}
            {tab === "youtube" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={saveYouTube}>
                  <h3>YouTube Stats</h3>
                  <label>
                    Channel Name/Handle
                    <input value={youtube.channel || ""} onChange={(e) => setYoutube({ ...youtube, channel: e.target.value })} />
                  </label>
                  <label>
                    Subscribers
                    <input value={youtube.subscribers || ""} onChange={(e) => setYoutube({ ...youtube, subscribers: e.target.value })} />
                  </label>
                  <label>
                    Videos Count
                    <input value={youtube.videos || ""} onChange={(e) => setYoutube({ ...youtube, videos: e.target.value })} />
                  </label>
                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-floppy-disk"></i> Save YouTube Info
                  </button>
                </form>
              </div>
            )}

            {tab === "articles" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={scrapeArticle}>
                  <h3>Scrape &amp; Publish from URL</h3>
                  <div className="input-group-row">
                    <input
                      type="url"
                      value={articleUrl}
                      onChange={(e) => setArticleUrl(e.target.value)}
                      placeholder="https://dev.to/..."
                      required
                    />
                    <button type="submit" className="btn btn-primary inline-btn" disabled={fetchingArticle}>
                      <i className="fa-solid fa-wand-magic-sparkles"></i> {fetchingArticle ? "Scraping..." : "Scrape"}
                    </button>
                  </div>
                </form>
                <hr className="pane-divider" />
                <form className="admin-form-group" onSubmit={addArticle}>
                  <h3>Add Article Manually</h3>
                  <label>
                    Title
                    <input value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} required />
                  </label>
                  <label>
                    Read Time
                    <input value={articleForm.readTime} onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })} />
                  </label>
                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-plus"></i> Add Article
                  </button>
                </form>
                <hr className="pane-divider" />
                <h3>Articles ({articles.length})</h3>
                <ul className="admin-items-list">
                  {articles.map((article) => (
                    <li key={article._id} className="admin-item-row">
                      <div className="item-meta">
                        <i className="fa-solid fa-newspaper item-row-icon"></i>
                        <div>
                          <strong className="item-title">{article.title}</strong>
                          <span className="item-subtitle">{article.readTime}</span>
                        </div>
                      </div>
                      <button type="button" className="btn btn-icon-danger" onClick={() => removeArticle(article._id)}>
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "achievements" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={addAchievement}>
                  <h3>Add Milestone</h3>
                  <label>
                    Title
                    <input value={achievementForm.title} onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })} required />
                  </label>
                  <label>
                    Description
                    <input value={achievementForm.desc} onChange={(e) => setAchievementForm({ ...achievementForm, desc: e.target.value })} required />
                  </label>
                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-plus"></i> Add Milestone
                  </button>
                </form>
                <hr className="pane-divider" />
                <h3>Milestones ({achievements.length})</h3>
                <ul className="admin-items-list">
                  {achievements.map((item) => (
                    <li key={item._id} className="admin-item-row">
                      <div className="item-meta">
                        <i className="fa-solid fa-trophy item-row-icon"></i>
                        <div>
                          <strong className="item-title">{item.title}</strong>
                          <span className="item-subtitle">{item.desc}</span>
                        </div>
                      </div>
                      <button type="button" className="btn btn-icon-danger" onClick={() => removeAchievement(item._id)}>
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "contact" && (
              <div className="tab-pane">
                <form className="admin-form-group" onSubmit={saveContact}>
                  <h3>Contact &amp; Social Links</h3>
                  {["email", "phone", "whatsapp", "linkedin", "github", "youtube"].map((field) => (
                    <label key={field}>
                      <span className="field-label-capitalize">{field}</span>
                      <input
                        value={contact[field] || ""}
                        onChange={(e) => setContact({ ...contact, [field]: e.target.value })}
                      />
                    </label>
                  ))}
                  <button type="submit" className="btn btn-primary action-submit-btn">
                    <i className="fa-solid fa-floppy-disk"></i> Save Contact Details
                  </button>
                </form>
              </div>
            )}

          </div>
        </main>
      </div>
    </section>
  );
}

export default AdminPage;
