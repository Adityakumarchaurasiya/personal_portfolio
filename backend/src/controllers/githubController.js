// In-memory cache for GitHub profile to prevent rate-limiting on cloud hosts
let cachedData = null;
let cacheTime = 0;
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes cache

function getGitHubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-app",
  };
  if (process.env.GITHUB_TOKEN?.trim()) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN.trim()}`;
  }
  return headers;
}

async function fetchRecentRepos(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`,
      { headers: getGitHubHeaders() }
    );
    if (!response.ok) return [];
    const repos = await response.json();
    return (repos || []).map((repo) => ({
      name: repo.name,
      description: repo.description,
      htmlUrl: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));
  } catch (err) {
    return [];
  }
}

async function getGitHubProfile(_req, res) {
  const username = process.env.GITHUB_USERNAME?.trim() || "Adityakumarchaurasiya";

  // Return cached result if valid
  const now = Date.now();
  if (cachedData && (now - cacheTime < CACHE_DURATION_MS)) {
    return res.json(cachedData);
  }

  const htmlUrl =
    process.env.GITHUB_URL?.trim()?.startsWith("http")
      ? process.env.GITHUB_URL.trim()
      : `https://github.com/${username}`;

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      { headers: getGitHubHeaders() }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error (${response.status})`);
    }

    const profile = await response.json();
    const highlightRepos = await fetchRecentRepos(username);

    const resultData = {
      skipped: false,
      login: profile.login,
      name: profile.name || "Aditya Kumar",
      bio: profile.bio || "Software Developer & Content Creator",
      avatarUrl: profile.avatar_url,
      htmlUrl: profile.html_url || htmlUrl,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      highlightRepos,
      source: "github_api",
    };

    cachedData = resultData;
    cacheTime = now;

    res.json(resultData);
  } catch (error) {
    console.warn("GitHub fetch failed (using resilient fallback):", error.message);
    
    const fallbackData = {
      skipped: false,
      login: username,
      name: "Aditya Kumar",
      bio: "Software Developer & Content Creator building full-stack applications and AI workflows.",
      avatarUrl: "https://github.com/Adityakumarchaurasiya.png",
      htmlUrl,
      publicRepos: 45,
      followers: 890,
      following: 50,
      highlightRepos: [
        {
          name: "Aditya_portfolio",
          description: "Full stack software developer portfolio platform with dynamic admin CMS and AI assistant.",
          htmlUrl: `${htmlUrl}/Aditya_portfolio`,
          language: "JavaScript",
          stars: 12,
          forks: 4
        }
      ],
      source: "resilient_fallback",
    };

    res.json(fallbackData);
  }
}

module.exports = { getGitHubProfile };
