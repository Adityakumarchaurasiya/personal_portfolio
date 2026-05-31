import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const TABS = [
  "portfolio",
  "skills",
  "projects",
  "services",
  "youtube",
  "articles",
  "achievements",
  "contact",
];

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

  const [portfolio, setPortfolio] = useState({ hero: {}, about: {} });
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [youtube, setYoutube] = useState({});
  const [articles, setArticles] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [contact, setContact] = useState({});

  const [skillForm, setSkillForm] = useState({ name: "", icon: "", tech: "", percentage: 80 });
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
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);

  const showFeedback = (successText) => {
    setMessage(successText);
    setError("");
  };

  const showError = (err) => {
    setError(err.message || "Something went wrong.");
    setMessage("");
  };

  const loadAll = useCallback(async () => {
    const [portfolioData, skillsData, projectsData, youtubeData, articlesData, contactData, achievementsData, servicesData] =
      await Promise.all([
        api.getPortfolio(),
        api.getSkills(),
        api.getProjects(),
        api.getYouTube(),
        api.getArticles(),
        api.getContact(),
        api.getAchievements(),
        api.getServices(),
      ]);

    setPortfolio(portfolioData);
    setSkills(skillsData);
    setProjects(projectsData);
    setYoutube(youtubeData);
    setArticles(articlesData);
    setContact(contactData);
    setAchievements(achievementsData);
    setServices(servicesData);
  }, []);

  useEffect(() => {
    loadAll().catch(showError);
  }, [loadAll]);

  const saveHero = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        title: portfolio.hero?.title || "",
        description: portfolio.hero?.description || "",
        imageUrl: portfolio.hero?.imageUrl || "",
      };
      const updated = await api.updatePortfolioHero(payload);
      setPortfolio(updated);
      showFeedback("Home hero updated.");
    } catch (err) {
      showError(err);
    }
  };

  const uploadHeroImage = async () => {
    if (!heroImageFile) {
      showError(new Error("Choose an image file first."));
      return;
    }
    setUploadingHeroImage(true);
    try {
      const result = await api.uploadHeroImage(heroImageFile);
      setPortfolio(result.portfolio);
      setHeroImageFile(null);
      showFeedback("Hero image uploaded.");
    } catch (err) {
      showError(err);
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const saveAbout = async (event) => {
    event.preventDefault();
    try {
      const updated = await api.updatePortfolioAbout(portfolio.about);
      setPortfolio(updated);
      showFeedback("About section updated.");
    } catch (err) {
      showError(err);
    }
  };

  const uploadAboutImage = async () => {
    if (!aboutImageFile) {
      showError(new Error("Choose an image file first."));
      return;
    }
    setUploadingAboutImage(true);
    try {
      const result = await api.uploadAboutImage(aboutImageFile);
      setPortfolio(result.portfolio);
      setAboutImageFile(null);
      showFeedback("About image uploaded.");
    } catch (err) {
      showError(err);
    } finally {
      setUploadingAboutImage(false);
    }
  };

  const addSkill = async (event) => {
    event.preventDefault();
    try {
      const created = await api.createSkill(skillForm);
      setSkills((prev) => [...prev, created]);
      setSkillForm({ name: "", icon: "", tech: "", percentage: 80 });
      showFeedback("Skill added.");
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

  const addProject = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...projectForm,
        tech: projectForm.tech
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const created = await api.createProject(payload);
      setProjects((prev) => [...prev, created]);
      setProjectForm({
        title: "",
        description: "",
        tech: "",
        icon: "",
        github: "",
        live: "",
        image: "",
      });
      showFeedback("Project added.");
    } catch (err) {
      showError(err);
    }
  };

  const uploadProjectImage = async () => {
    if (!projectImageFile) {
      showError(new Error("Choose an image file first."));
      return;
    }
    setUploadingProjectImage(true);
    try {
      const result = await api.uploadProjectImage(projectImageFile);
      setProjectForm((prev) => ({
        ...prev,
        image: result.imageUrl,
      }));
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

    if (articles.some((a) => a.url === articleUrl)) {
      showError(new Error("Article already added!"));
      return;
    }

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
      showFeedback("Article scraped and added successfully!");
    } catch (err) {
      console.warn("Auto-scrape failed, falling back to manual prompt:", err.message);
      const title = prompt("Unable to scrape metadata. Please enter article title manually:");
      if (title) {
        try {
          const created = await api.createArticle({
            title,
            description: prompt("Enter description (optional):") || "Read full details on the publisher platform.",
            url: articleUrl,
            platform: guessPlatform(articleUrl),
            readTime: "5 min read",
          });
          setArticles((prev) => [created, ...prev]);
          setArticleUrl("");
          showFeedback("Article added manually!");
        } catch (createErr) {
          showError(createErr);
        }
      } else {
        showError(err);
      }
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
      showFeedback("Achievement/Milestone deleted.");
    } catch (err) {
      showError(err);
    }
  };

  const addService = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...serviceForm,
        features: serviceForm.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const created = await api.createService(payload);
      setServices((prev) => [...prev, created]);
      setServiceForm({
        title: "",
        description: "",
        icon: "fas fa-cogs",
        price: "",
        features: "",
      });
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
      showFeedback("Contact info updated.");
    } catch (err) {
      showError(err);
    }
  };

  return (
    <section className="section admin-section">
      <div className="section-inner">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="muted">Signed in as {user?.email}</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/" className="btn btn-secondary">
              View Site
            </Link>
            <button type="button" className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {message && <p className="status success admin-feedback">{message}</p>}
        {error && <p className="status error admin-feedback">{error}</p>}

        <div className="admin-tabs">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              className={`admin-tab ${tab === item ? "active" : ""}`}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "portfolio" && (
          <div className="admin-panel">
            <form className="admin-form" onSubmit={saveHero}>
              <h2>Home Hero</h2>
              <p className="muted">Only the home page hero is editable here.</p>
              <label>
                Title
                <input
                  value={portfolio.hero?.title || ""}
                  onChange={(e) =>
                    setPortfolio((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value },
                    }))
                  }
                />
              </label>
              <label>
                Paragraph
                <textarea
                  rows={4}
                  value={portfolio.hero?.description || ""}
                  onChange={(e) =>
                    setPortfolio((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, description: e.target.value },
                    }))
                  }
                />
              </label>
              <label>
                Image URL (optional if uploading)
                <input
                  value={portfolio.hero?.imageUrl || ""}
                  onChange={(e) =>
                    setPortfolio((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, imageUrl: e.target.value },
                    }))
                  }
                  placeholder="https://..."
                />
              </label>
              <div className="admin-upload-row">
                <label>
                  Hero image upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                  />
                </label>
                {portfolio.hero?.imageUrl && (
                  <img
                    src={portfolio.hero.imageUrl}
                    alt="Current hero"
                    className="admin-about-preview"
                  />
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={uploadHeroImage}
                  disabled={uploadingHeroImage || !heroImageFile}
                >
                  {uploadingHeroImage ? "Uploading…" : "Upload Image"}
                </button>
              </div>
              <button type="submit" className="btn btn-primary">
                Save Hero
              </button>
            </form>

            <form className="admin-form" onSubmit={saveAbout}>
              <h2>About</h2>
              <label>
                Mission
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
                Journey
                <textarea
                  rows={3}
                  value={portfolio.about?.journey || ""}
                  onChange={(e) =>
                    setPortfolio((prev) => ({
                      ...prev,
                      about: { ...prev.about, journey: e.target.value },
                    }))
                  }
                />
              </label>
              <div className="admin-upload-row">
                <label>
                  About image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAboutImageFile(e.target.files?.[0] || null)}
                  />
                </label>
                {portfolio.about?.imageUrl && (
                  <img
                    src={portfolio.about.imageUrl}
                    alt="Current about"
                    className="admin-about-preview"
                  />
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={uploadAboutImage}
                  disabled={uploadingAboutImage || !aboutImageFile}
                >
                  {uploadingAboutImage ? "Uploading…" : "Upload Image"}
                </button>
              </div>
              <button type="submit" className="btn btn-primary">
                Save About
              </button>
            </form>
          </div>
        )}

        {tab === "skills" && (
          <div className="admin-panel">
            <form className="admin-form" onSubmit={addSkill}>
              <h2>Add Skill</h2>
              <label>
                Name
                <input
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Icon class (Font Awesome)
                <input
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                  placeholder="fa-brands fa-react"
                />
              </label>
              <label>
                Category Label (e.g. Frontend Development)
                <input
                  value={skillForm.tech}
                  onChange={(e) => setSkillForm({ ...skillForm, tech: e.target.value })}
                  placeholder="Frontend Development"
                />
              </label>
              <label>
                Proficiency Percentage
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skillForm.percentage}
                  onChange={(e) => setSkillForm({ ...skillForm, percentage: parseInt(e.target.value) || 80 })}
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Add Skill
              </button>
            </form>
            <ul className="admin-list">
              {skills.map((skill) => (
                <li key={skill._id}>
                  <span>
                    {skill.name} {skill.tech ? `(${skill.tech})` : ""} · {skill.percentage || 80}%
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeSkill(skill._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "projects" && (
          <div className="admin-panel">
            <form className="admin-form" onSubmit={addProject}>
              <h2>Add Project</h2>
              <label>
                Title
                <input
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, description: e.target.value })
                  }
                />
              </label>
              <label>
                Tech (comma-separated)
                <input
                  value={projectForm.tech}
                  onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                />
              </label>
              <label>
                Icon class (optional fallback)
                <input
                  value={projectForm.icon}
                  onChange={(e) => setProjectForm({ ...projectForm, icon: e.target.value })}
                />
              </label>
              <label>
                GitHub Link
                <input
                  value={projectForm.github || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </label>
              <label>
                Live Link
                <input
                  value={projectForm.live || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                  placeholder="https://..."
                />
              </label>
              <label>
                Image URL (optional if uploading)
                <input
                  value={projectForm.image || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  placeholder="https://..."
                />
              </label>
              <div className="admin-upload-row">
                <label>
                  Project preview image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProjectImageFile(e.target.files?.[0] || null)}
                  />
                </label>
                {projectForm.image && (
                  <img
                    src={projectForm.image}
                    alt="Preview"
                    className="admin-about-preview"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={uploadProjectImage}
                  disabled={uploadingProjectImage || !projectImageFile}
                >
                  {uploadingProjectImage ? "Uploading…" : "Upload Image"}
                </button>
              </div>
              <button type="submit" className="btn btn-primary">
                Add Project
              </button>
            </form>
            <ul className="admin-list">
              {projects.map((project) => (
                <li key={project._id}>
                  <span>{project.title}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeProject(project._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "youtube" && (
          <div className="admin-panel">
            <form className="admin-form" onSubmit={saveYouTube}>
              <h2>YouTube Stats</h2>
              {["channel", "subscribers", "videos", "growth"].map((field) => (
                <label key={field}>
                  {field}
                  <input
                    value={youtube[field] || ""}
                    onChange={(e) => setYoutube({ ...youtube, [field]: e.target.value })}
                  />
                </label>
              ))}
              <button type="submit" className="btn btn-primary">
                Save YouTube
              </button>
            </form>
          </div>
        )}

        {tab === "articles" && (
          <div className="admin-panel">
            <form className="admin-form" onSubmit={scrapeArticle} style={{ marginBottom: "2rem" }}>
              <h2>Scrape &amp; Publish Article from URL</h2>
              <p className="muted">Paste a DEV.to, Medium, or Hashnode article URL to scrape metadata automatically.</p>
              <label>
                Article URL
                <input
                  type="url"
                  value={articleUrl}
                  onChange={(e) => setArticleUrl(e.target.value)}
                  placeholder="https://dev.to/username/article-slug..."
                  disabled={fetchingArticle}
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={fetchingArticle}>
                {fetchingArticle ? "Scraping..." : "Scrape & Publish"}
              </button>
            </form>

            <form className="admin-form" onSubmit={addArticle}>
              <h2>Add Article Manually</h2>
              <label>
                Title
                <input
                  value={articleForm.title}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, title: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Read time
                <input
                  value={articleForm.readTime}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, readTime: e.target.value })
                  }
                  placeholder="5 min read"
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Add Article Manually
              </button>
            </form>
            <ul className="admin-list">
              {articles.map((article) => (
                <li key={article._id}>
                  <span>
                    {article.title} · {article.readTime}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeArticle(article._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "achievements" && (
          <div className="admin-panel">
            <form className="admin-form" onSubmit={addAchievement}>
              <h2>Add Achievement / Milestone</h2>
              <label>
                Title
                <input
                  value={achievementForm.title}
                  onChange={(e) =>
                    setAchievementForm({ ...achievementForm, title: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Description
                <input
                  value={achievementForm.desc}
                  onChange={(e) =>
                    setAchievementForm({ ...achievementForm, desc: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Icon class (Font Awesome)
                <input
                  value={achievementForm.icon}
                  onChange={(e) =>
                    setAchievementForm({ ...achievementForm, icon: e.target.value })
                  }
                  placeholder="fas fa-award"
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Add Achievement
              </button>
            </form>
            <ul className="admin-list">
              {achievements.map((item) => (
                <li key={item._id}>
                  <span>
                    <i className={item.icon} style={{ marginRight: "0.5rem" }} />
                    {item.title} — {item.desc}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeAchievement(item._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "services" && (
          <div className="admin-panel">
            <form className="admin-form" onSubmit={addService}>
              <h2>Add Service</h2>
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
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                />
              </label>
              <label>
                Icon class (Font Awesome, e.g. fas fa-robot)
                <input
                  value={serviceForm.icon}
                  onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                  placeholder="fas fa-robot"
                />
              </label>
              <label>
                Price (e.g. Starting from $2,500)
                <input
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  placeholder="Starting from $2,500"
                />
              </label>
              <label>
                Features (comma-separated list, e.g. RAG, Custom LLM)
                <input
                  value={serviceForm.features}
                  onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Add Service
              </button>
            </form>
            <ul className="admin-list">
              {services.map((item) => (
                <li key={item._id}>
                  <span>
                    <i className={item.icon} style={{ marginRight: "0.5rem" }} />
                    {item.title} — {item.price || "Custom Quote"}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeService(item._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "contact" && (
          <div className="admin-panel">
            <form className="admin-form" onSubmit={saveContact}>
              <h2>Contact</h2>
              {["linkedin", "github", "youtube", "email"].map((field) => (
                <label key={field}>
                  {field}
                  <input
                    value={contact[field] || ""}
                    onChange={(e) => setContact({ ...contact, [field]: e.target.value })}
                  />
                </label>
              ))}
              <button type="submit" className="btn btn-primary">
                Save Contact
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminPage;
