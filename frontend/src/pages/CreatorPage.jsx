import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import PageShell from "../components/PageShell";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";
import "./CreatorPage.css";

function CreatorPage() {
  const [articlesList, setArticlesList] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);

  const { data: youtube, loading: ytLoading, error: ytError } = useFetch(
    () => api.getYouTubeLive(),
    []
  );
  const { data: articles, loading: artLoading, error: artError } = useFetch(
    () => api.getArticles(),
    []
  );
  const { data: portfolio, loading: portLoading, error: portError } = useFetch(
    () => api.getPortfolio(),
    []
  );
  const { data: github, loading: ghLoading } = useFetch(() => api.getGitHubProfile(), []);
  const { data: social, loading: socialLoading } = useFetch(() => api.getSocialOverview(), []);
  const { data: achievementsData, loading: achLoading, error: achError } = useFetch(
    () => api.getAchievements(),
    []
  );

  const loading = ytLoading || artLoading || portLoading || ghLoading || socialLoading || achLoading;
  const error = ytError || artError || portError || achError;

  // Initialize articles list
  useEffect(() => {
    if (articles) {
      setArticlesList(articles);
    }
  }, [articles]);

  // Initialize achievements list
  useEffect(() => {
    if (achievementsData) {
      setAchievementsList(achievementsData);
    }
  }, [achievementsData]);

  // Handles & Links
  const linkedinUsername = "aditya-chaurasiya";
  const linkedinUrl = social?.linkedin?.url || `https://www.linkedin.com/in/${linkedinUsername}/`;
  
  const githubUsername = github?.login || social?.github?.username || "Adityakumarchaurasiya";
  const githubUrl = github?.htmlUrl || social?.github?.url || `https://github.com/${githubUsername}`;

  const youtubeChannel = youtube?.channel || social?.youtube?.handle || "@AdityaCodesAI";
  const youtubeUrl = youtube?.channelUrl || social?.youtube?.url || `https://www.youtube.com/${youtubeChannel}`;

  return (
    <PageShell loading={loading} error={error} className="creator-page">
      {/* Hero Section */}
      <section className="section creator-hero">
        <div className="container creator-layout-container">
          <div className="creator-hero-badge">
            <i className="fas fa-rocket"></i> Creator Ecosystem
          </div>
          <h1>My <span>Creator</span> Hub</h1>
          <p>My developer journey, verified channels, dynamic achievements, and published writing.</p>
        </div>
      </section>

      {/* Profile Overview & Metrics Section */}
      <section className="section alt creator-stats-section">
        <div className="container creator-layout-container">
          <SectionHeader
            title="Profile Overview"
            subtitle="Live platform stats and verified profiles across my developer & content creator network."
            centered
          />

          {/* Social Platforms Showcase */}
          <div className="profile-overview-showcase">
            {/* Developer Details Card */}
            <div className="dev-details-card">
              <div className="dev-avatar-container">
                {github?.avatarUrl ? (
                  <img src={github.avatarUrl} alt="Aditya Kumar Verma" className="dev-avatar-img" />
                ) : (
                  <div className="dev-avatar-fallback">
                    <i className="fas fa-user-circle"></i>
                  </div>
                )}
              </div>
              <div className="dev-info-container">
                <h2>Aditya Kumar Verma</h2>
                <p className="dev-tagline">AI Explorer &amp; Full Stack Software Developer</p>
                <p className="dev-bio">
                  Building automated systems, training intelligent agents, and sharing my tech journey
                  with developers globally. Focused on frontend elegance, robust APIs, and learning in public.
                </p>
                <div className="dev-quick-metrics">
                  <span>
                    <i className="fas fa-code-branch"></i> <strong>{github?.publicRepos || 45}</strong> Public Repos
                  </span>
                  <span>
                    <i className="fas fa-users"></i> <strong>{github?.followers || 890}</strong> Followers
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Grid */}
            <div className="overview-platforms-grid">
              {/* GitHub platform card */}
              <div className="overview-plat-card github-plat">
                <div className="plat-icon-wrap">
                  <i className="fab fa-github"></i>
                </div>
                <div>
                  <h3>GitHub Profile</h3>
                  <p className="plat-handle">@{githubUsername}</p>
                </div>
                <div className="plat-details">
                  <div className="plat-metric">
                    <strong>{github?.followers || "890"}</strong> Followers
                  </div>
                  <div className="plat-metric">
                    <strong>{github?.publicRepos || "45"}</strong> Repos
                  </div>
                </div>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary plat-link-btn"
                >
                  <i className="fas fa-external-link-alt"></i> Visit GitHub
                </a>
              </div>

              {/* YouTube platform card */}
              <div className="overview-plat-card youtube-plat">
                <div className="plat-icon-wrap">
                  <i className="fab fa-youtube"></i>
                </div>
                <div>
                  <h3>YouTube Channel</h3>
                  <p className="plat-handle">{youtubeChannel}</p>
                </div>
                <div className="plat-details">
                  <div className="plat-metric">
                    <strong>{youtube?.subscribers || "15.4k"}</strong> Subs
                  </div>
                  <div className="plat-metric">
                    <strong>{youtube?.videos || "100+"}</strong> Videos
                  </div>
                </div>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary plat-link-btn"
                >
                  <i className="fas fa-external-link-alt"></i> Visit Channel
                </a>
              </div>

              {/* LinkedIn platform card */}
              <div className="overview-plat-card linkedin-plat">
                <div className="plat-icon-wrap">
                  <i className="fab fa-linkedin"></i>
                </div>
                <div>
                  <h3>LinkedIn Network</h3>
                  <p className="plat-handle">@aditya-chaurasiya</p>
                </div>
                <div className="plat-details">
                  <div className="plat-metric">
                    <strong>2,500+</strong> Connections
                  </div>
                </div>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary plat-link-btn"
                >
                  <i className="fas fa-external-link-alt"></i> Connect LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements & Milestones Section */}
      <section className="section creator-achievements-section">
        <div className="container creator-layout-container">
          <SectionHeader
            title="Achievements & Milestones"
            subtitle="Verified academic, coding, and open source accolades tracked in the database."
            centered
          />

          <div className="achievements-grid" id="achievementsGrid">
            {achievementsList.length > 0 ? (
              achievementsList.map((achievement) => (
                <div className="achievement-card" key={achievement._id}>
                  <div className="achievement-icon">
                    <i className={achievement.icon || "fas fa-award"}></i>
                  </div>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="muted" style={{ gridColumn: "1/-1", textAlign: "center", padding: "2rem" }}>
                No milestones added yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Published Articles & Content Section */}
      <section className="section alt creator-articles-section">
        <div className="container creator-layout-container">
          <SectionHeader
            title="Published Articles &amp; Content"
            subtitle="Developer essays, tech walkthroughs, and tutorials scraped from external publisher platforms."
            centered
          />

          <div id="articlesGrid" className="articles-grid">
            {articlesList.length > 0 ? (
              articlesList.map((article) => (
                <div className="article-card" key={article._id}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className={`article-platform platform-${article.platform}`}>
                      {article.platform === "devto"
                        ? "DEV.to"
                        : article.platform === "medium"
                        ? "Medium"
                        : article.platform === "hashnode"
                        ? "Hashnode"
                        : "Article"}
                    </span>
                    <h4>{article.title}</h4>
                    <p>{article.description || "Read full article details on the publisher platform."}</p>
                  </a>
                  <div className="article-meta">
                    <span>
                      <i className="fas fa-calendar"></i> {article.date || "Recent"}
                    </span>
                    <span>
                      <i className="fas fa-clock"></i> {article.readTime || "5 min read"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p
                className="muted"
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "3rem 1.5rem",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "1.5rem",
                }}
              >
                No articles added yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default CreatorPage;
