import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { homeFallbacks } from "../data/homeFallbacks";
import { api, resolveMediaUrl } from "../services/api";
import "./HomePage.css";

const DEFAULT_GITHUB = {
  login: "Adityakumarchaurasiya",
  name: "Aditya Kumar",
  bio: "Software Developer & Content Creator building intelligent agentic workflows and full-stack web applications.",
  followers: 890,
  publicRepos: 45,
  following: 50,
  avatarUrl: "https://placehold.co/150x150/F0EBE6/8B5E3C?text=AV",
  htmlUrl: "https://github.com/Adityakumarchaurasiya",
  highlightRepos: [
    { name: "ai-rental-platform", description: "ML-powered property matching system", stars: 45, language: "Python" },
    { name: "collabhub", description: "Open source collaboration platform", stars: 89, language: "TypeScript" },
    { name: "documind-ai", description: "Intelligent research assistant", stars: 67, language: "Python" }
  ]
};

async function loadWithFallback(fetcher, fallback) {
  try {
    return { data: await fetcher(), fromFallback: false };
  } catch {
    return { data: fallback, fromFallback: true };
  }
}

function renderHeroTitle(title) {
  const match = title.match(/^(.+?\s+with\s+)(.+)$/i);
  if (match) {
    return (
      <>
        {match[1]}
        <span className="accent">{match[2]}</span>
      </>
    );
  }
  return title;
}

function externalHref(value, prefix = "https://") {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  return `${prefix}${value.replace(/^\/\//, "")}`;
}

function youtubeHref(value) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const handle = value.replace(/^@/, "").trim();
  return handle ? `https://www.youtube.com/@${handle}` : null;
}

const OVERVIEW_LINKS = [
  {
    to: "/projects",
    icon: "fa-solid fa-code",
    title: "Skills",
    description: "Frameworks, languages, and tools I use to ship products.",
  },
  {
    to: "/projects",
    icon: "fa-solid fa-folder-open",
    title: "Projects",
    description: "Selected builds spanning full-stack apps, AI, and automation.",
  },
  {
    to: "/creator",
    icon: "fa-solid fa-clapperboard",
    title: "Creator Hub",
    description: "Technical writing and creator content from the channel.",
  },
  {
    to: "/about",
    icon: "fa-solid fa-user",
    title: "About",
    description: "Background, mission, and how I approach building software.",
  },
];

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState(homeFallbacks.hero);
  const [youtube, setYoutube] = useState(homeFallbacks.youtube);
  const [skills, setSkills] = useState(homeFallbacks.skills);
  const [projects, setProjects] = useState(homeFallbacks.projects);
  const [articles, setArticles] = useState(homeFallbacks.articles);
  const [contact, setContact] = useState(homeFallbacks.contact);
  const [github, setGithub] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadHome() {
      setLoading(true);
      const results = await Promise.all([
        loadWithFallback(() => api.getPortfolio(), { hero: homeFallbacks.hero }),
        loadWithFallback(() => api.getYouTubeLive(), homeFallbacks.youtube),
        loadWithFallback(() => api.getSkills(), homeFallbacks.skills),
        loadWithFallback(() => api.getProjects(), homeFallbacks.projects),
        loadWithFallback(() => api.getArticles(), homeFallbacks.articles),
        loadWithFallback(() => api.getContact(), homeFallbacks.contact),
        loadWithFallback(() => api.getGitHubProfile(), null),
        loadWithFallback(() => api.getSettings(), null),
      ]);

      if (!active) return;

      const [
        portfolioResult,
        youtubeResult,
        skillsResult,
        projectsResult,
        articlesResult,
        contactResult,
        githubResult,
        settingsResult,
      ] = results;

      setHero(portfolioResult.data?.hero || homeFallbacks.hero);
      setYoutube(youtubeResult.data || homeFallbacks.youtube);
      setSkills(skillsResult.data?.length ? skillsResult.data : []);
      setProjects(
        projectsResult.data?.length ? projectsResult.data : []
      );
      setArticles(
        articlesResult.data?.length ? articlesResult.data : []
      );
      setContact(contactResult.data || homeFallbacks.contact);

      if (settingsResult.data?.siteTitle) {
        document.title = settingsResult.data.siteTitle;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", settingsResult.data.metaDescription || "");
        }
      }

      const gh = githubResult.data;
      setGithub(gh && !gh.skipped ? gh : DEFAULT_GITHUB);

      setUsingFallback(
        [
          portfolioResult,
          youtubeResult,
          contactResult,
        ].some((item) => item.fromFallback)
      );
      setLoading(false);
    }

    loadHome();
    return () => {
      active = false;
    };
  }, []);

  const previewArticles = articles.slice(0, 3);

  return (
    <div className="home-page">
      <section className="section hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              {loading ? (
                <p className="home-loading">Loading hero…</p>
              ) : (
                <>
                  <span className="hero-badge">AI Engineer &amp; Full-Stack Developer &amp; Creator</span>
                  <h1 className="hero-title">{renderHeroTitle(hero.title)}</h1>
                  <p className="hero-description">{hero.description}</p>
                  <div className="hero-actions">
                    <Link to="/projects" className="btn btn-primary">
                      View Projects <i className="fa-solid fa-arrow-right" aria-hidden />
                    </Link>
                    <Link to="/services" className="btn btn-secondary">
                      Let&apos;s Connect
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="hero-visual" aria-hidden={loading}>
              {loading ? (
                <p className="home-loading hero-visual-loading">Loading video…</p>
              ) : (
                <video
                  className="hero-cover-video"
                  src={resolveMediaUrl(hero.videoUrl || hero.imageUrl) || "https://assets.mixkit.co/videos/preview/mixkit-code-running-on-a-computer-screen-2224-large.mp4"}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Live Stats Section */}
      <section className="section youtube-stats-section alt">
        <div className="container">
          <header className="section-header">
            <h2>YouTube Channel </h2>
            <p className="section-subtitle">
             Sharing practical content on software development, AI, automation, and emerging technologies.
            </p>
            <div className="section-underline" aria-hidden />
          </header>
          {loading ? (
            <p className="home-loading">Loading YouTube stats…</p>
          ) : (
            <div className="live-stats-grid">
              <article className="stat-card youtube-stat">
                <i className="fa-brands fa-youtube" aria-hidden />
                <div className="stat-number">{youtube.subscribers || "—"}</div>
                <div className="stat-label">Subscribers</div>
              </article>
              <article className="stat-card youtube-stat">
                <i className="fa-solid fa-play" aria-hidden />
                <div className="stat-number">{youtube.videos || "—"}</div>
                <div className="stat-label">Videos</div>
              </article>
              <article className="stat-card youtube-stat">
                <i className="fa-solid fa-chart-line" aria-hidden />
                <div className="stat-number">{youtube.growth || "Live"}</div>
                <div className="stat-label">Views &amp; Reach</div>
              </article>
            </div>
          )}
        </div>
      </section>

      {/* GitHub Developer Stats Section */}
      <section className="section github-stats-section">
        <div className="container">
          <header className="section-header">
            <h2>GitHub Profile</h2>
            <p className="section-subtitle">
              Open-source contributions, projects, and developer activity — all in one place.
            </p>
            <div className="section-underline" aria-hidden />
          </header>
          {loading ? (
            <p className="home-loading">Loading GitHub stats…</p>
          ) : (
            <div className="live-stats-grid">
              <article className="stat-card github-stat">
                <i className="fa-brands fa-github" aria-hidden />
                <div className="stat-number">
                  {github ? (github.publicRepos ?? "—") : String(skills.length + 5)}
                </div>
                <div className="stat-label">Public Repositories</div>
              </article>
              <article className="stat-card github-stat">
                <i className="fa-solid fa-users" aria-hidden />
                <div className="stat-number">
                  {github ? (github.followers ?? "—") : "100+"}
                </div>
                <div className="stat-label">Followers</div>
              </article>
              <article className="stat-card github-stat">
                <i className="fa-solid fa-code-branch" aria-hidden />
                <div className="stat-number">
                  {github ? (github.following ?? "—") : "50+"}
                </div>
                <div className="stat-label">Following</div>
              </article>
            </div>
          )}
        </div>
      </section>

      {usingFallback && !loading && (
        <div className="container">
          <div className="api-status-widget" role="status">
            <div className="api-status-header">
              <span className="status-dot warning" aria-hidden />
              Offline data mode
            </div>
            <p className="section-subtitle">
              Some sections are showing placeholder data because the API is unavailable.
            </p>
          </div>
        </div>
      )}

      <section className="section alt">
        <div className="container">
          <header className="section-header">
            <h2>Explore My Work</h2>
            <p className="section-subtitle">
             Discover my skills, projects, technical content, and journey as a developer.
            </p>
            <div className="section-underline" aria-hidden />
          </header>
          <div className="overview-grid">
            {OVERVIEW_LINKS.map((item) => (
              <Link key={`${item.to}-${item.title}`} to={item.to} className="overview-card">
                <div className="overview-card-icon">
                  <i className={item.icon} aria-hidden />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-section">
        <div className="container">
          <header className="section-header">
            <h2>Creator hub</h2>
            <p className="section-subtitle">
              YouTube channel metrics and latest writing, powered by your API.
            </p>
            <div className="section-underline" aria-hidden />
          </header>

          <div className="creator-showcase">
            <article className="creator-platform-card">
              <div className="platform-header youtube">
                <i className="fa-brands fa-youtube" aria-hidden />
                <h3>{loading ? "YouTube" : youtube.channel}</h3>
                {loading ? (
                  <p className="home-loading">Loading YouTube stats…</p>
                ) : (
                  <div className="platform-stats">
                    <span>
                      <strong>{youtube.subscribers}</strong>
                      Subscribers
                    </span>
                    <span>
                      <strong>{youtube.videos}</strong>
                      Videos
                    </span>
                    <span>
                      <strong>{youtube.growth}</strong>
                      Views
                    </span>
                  </div>
                )}
              </div>
              <div className="platform-content">
                {loading ? (
                  <p className="home-loading">Loading highlights…</p>
                ) : youtube.recentVideos?.length > 0 ? (
                  <ul className="video-list">
                    {youtube.recentVideos.map((video) => (
                      <li key={video.id || video.url}>
                        <a
                          className="video-title"
                          href={video.url || youtube.channelUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {video.title}
                        </a>
                        {video.publishedAt && (
                          <span className="video-views">
                            {new Date(video.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="video-list">
                    <li>
                      <span className="video-title">Channel</span>
                      <span className="video-views">{youtube.channel}</span>
                    </li>
                    <li>
                      <span className="video-title">Views</span>
                      <span className="video-views">{youtube.growth}</span>
                    </li>
                    <li>
                      <span className="video-title">Catalog</span>
                      <span className="video-views">{youtube.videos} videos</span>
                    </li>
                  </ul>
                )}
                <Link to="/creator" className="platform-btn youtube-btn">
                  Open creator hub
                </Link>
              </div>
            </article>

            <article className="creator-platform-card">
              <div className="platform-header writing">
                <i className="fa-solid fa-pen-nib" aria-hidden />
                <h3>Writing</h3>
                {loading ? (
                  <p className="home-loading">Loading articles…</p>
                ) : (
                  <div className="platform-stats">
                    <span>
                      <strong>{articles.length}</strong>
                      Articles
                    </span>
                    <span>
                      <strong>{previewArticles[0]?.readTime || "—"}</strong>
                      Latest read
                    </span>
                  </div>
                )}
              </div>
              <div className="platform-content">
                {loading ? (
                  <p className="home-loading">Loading articles…</p>
                ) : previewArticles.length ? (
                  <ul className="article-list">
                    {previewArticles.map((article) => (
                      <li key={article._id}>
                        <span className="article-title">{article.title}</span>
                        <span className="article-date">{article.readTime}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="section-subtitle">No articles yet.</p>
                )}
                <Link to="/creator" className="platform-btn writing-btn">
                  Read all articles
                </Link>
              </div>
            </article>
          </div>

          {github && !loading && (
            <div className="github-inline">
              {github.avatarUrl && <img src={github.avatarUrl} alt="" />}
              <div>
                <h3>{github.name || github.login}</h3>
                {github.bio && <p>{github.bio}</p>}
                <p>
                  {github.publicRepos != null && `${github.publicRepos} repos · `}
                  {github.followers != null && `${github.followers} followers`}
                </p>
                {github.htmlUrl && (
                  <a
                    href={github.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    View on GitHub
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section connect-section">
        <div className="container">
          <header className="section-header">
            <h2>Let's Connect</h2>
            <p className="section-subtitle">
              Have an idea, project, or collaboration in mind? I’d love to hear from you.
            </p>
            <div className="section-underline" aria-hidden />
          </header>
          {loading ? (
            <p className="home-loading">Loading contact details…</p>
          ) : (
            <div className="connect-wrapper" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
              <p className="connect-message" style={{ color: "var(--hp-muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
                I build Generative AI applications, intelligent automation systems, AI agent workflows, and full-stack products, while also creating technical content and guides. Whether you’re looking to collaborate on a project, need technical content, or want to explore an idea together, feel free to reach out.
              </p>
              <div className="social-icons connect-row" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="btn btn-secondary">
                    <i className="fa-solid fa-envelope" aria-hidden /> {contact.email}
                  </a>
                )}
                {contact.github && (
                  <a
                    href={externalHref(contact.github)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <i className="fa-brands fa-github" aria-hidden /> GitHub
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={externalHref(contact.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <i className="fa-brands fa-linkedin" aria-hidden /> LinkedIn
                  </a>
                )}
                {contact.youtube && (
                  <a
                    href={youtubeHref(contact.youtube)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <i className="fa-brands fa-youtube" aria-hidden /> YouTube
                  </a>
                )}
              </div>
              <p className="connect-cta">
                <Link to="/services" className="btn btn-primary" style={{ minHeight: "48px", padding: "0.85rem 2.5rem" }}>
                  Explore Services &amp; Contact Form <i className="fa-solid fa-arrow-right" style={{ marginLeft: "0.5rem" }} />
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
