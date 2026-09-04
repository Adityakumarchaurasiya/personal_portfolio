const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);
const API_ROOT = `${API_BASE}/api`;

export function resolveMediaUrl(url) {
  if (!url) return "";
  if (url.includes("localhost:5000")) {
    const path = url.split("localhost:5000")[1];
    return `${API_BASE}${path}`;
  }
  if (url.startsWith("/")) {
    return `${API_BASE}${url}`;
  }
  return url;
}

const TOKEN_KEY = "token";

// Kept as fallback stubs to prevent import errors in other modules
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, options = {}, auth = false) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers,
    credentials: "include", // Required for express-session cookies to pass through CORS
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

async function uploadRequest(path, formData) {
  const response = await fetch(`${API_ROOT}${path}`, {
    method: "POST",
    body: formData,
    credentials: "include", // Required for express-session cookies to pass through CORS
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || `Upload failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  health: () => request("/health"),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request("/auth/me", {}, true),

  logout: () => request("/auth/logout", { method: "POST" }, true),

  resetPassword: (email) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  confirmResetPassword: (token, password) =>
    request("/auth/reset-password/confirm", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),

  getPortfolio: () => request("/portfolio"),
  updatePortfolioHero: (hero) =>
    request(
      "/portfolio/hero",
      { method: "PUT", body: JSON.stringify(hero) },
      true
    ),
  updatePortfolioAbout: (about) =>
    request(
      "/portfolio/about",
      { method: "PUT", body: JSON.stringify(about) },
      true
    ),
  uploadAboutImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return uploadRequest("/upload/about-image", formData);
  },
  uploadHeroImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return uploadRequest("/upload/hero-image", formData);
  },
  uploadHeroVideo: (file) => {
    const formData = new FormData();
    formData.append("video", file);
    return uploadRequest("/upload/hero-video", formData);
  },
  uploadProjectImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return uploadRequest("/upload/project-image", formData);
  },
  uploadGenericFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return uploadRequest("/upload/file", formData);
  },

  getYouTubeLive: () => request("/youtube/live"),
  getGitHubProfile: () => request("/github/profile"),
  getSocialOverview: () => request("/social/overview"),

  getSkills: () => request("/skills"),
  createSkill: (payload) =>
    request("/skills", { method: "POST", body: JSON.stringify(payload) }, true),
  updateSkill: (id, payload) =>
    request(
      `/skills/${id}`,
      { method: "PUT", body: JSON.stringify(payload) },
      true
    ),
  deleteSkill: (id) => request(`/skills/${id}`, { method: "DELETE" }, true),

  getProjects: () => request("/projects"),
  createProject: (payload) =>
    request(
      "/projects",
      { method: "POST", body: JSON.stringify(payload) },
      true
    ),
  updateProject: (id, payload) =>
    request(
      `/projects/${id}`,
      { method: "PUT", body: JSON.stringify(payload) },
      true
    ),
  deleteProject: (id) =>
    request(`/projects/${id}`, { method: "DELETE" }, true),

  getYouTube: () => request("/youtube"),
  updateYouTube: (payload) =>
    request("/youtube", { method: "PUT", body: JSON.stringify(payload) }, true),

  getArticles: () => request("/articles"),
  createArticle: (payload) =>
    request(
      "/articles",
      { method: "POST", body: JSON.stringify(payload) },
      true
    ),
  scrapeArticle: (url) =>
    request(
      "/articles/scrape",
      { method: "POST", body: JSON.stringify({ url }) },
      true
    ),
  updateArticle: (id, payload) =>
    request(
      `/articles/${id}`,
      { method: "PUT", body: JSON.stringify(payload) },
      true
    ),
  deleteArticle: (id) =>
    request(`/articles/${id}`, { method: "DELETE" }, true),

  getAchievements: () => request("/achievements"),
  createAchievement: (payload) =>
    request("/achievements", { method: "POST", body: JSON.stringify(payload) }, true),
  deleteAchievement: (id) =>
    request(`/achievements/${id}`, { method: "DELETE" }, true),

  getServices: () => request("/services"),
  createService: (payload) =>
    request("/services", { method: "POST", body: JSON.stringify(payload) }, true),
  deleteService: (id) =>
    request(`/services/${id}`, { method: "DELETE" }, true),

  sendChatMessage: (message, history) =>
    request("/chatbot", { method: "POST", body: JSON.stringify({ message, history }) }),

  getContact: () => request("/contact"),
  updateContact: (payload) =>
    request("/contact", { method: "PUT", body: JSON.stringify(payload) }, true),

  // Experiences CRUD Endpoints
  getExperiences: () => request("/experiences"),
  createExperience: (payload) =>
    request("/experiences", { method: "POST", body: JSON.stringify(payload) }, true),
  updateExperience: (id, payload) =>
    request(`/experiences/${id}`, { method: "PUT", body: JSON.stringify(payload) }, true),
  deleteExperience: (id) =>
    request(`/experiences/${id}`, { method: "DELETE" }, true),

  // Testimonials CRUD Endpoints
  getTestimonials: () => request("/testimonials"),
  createTestimonial: (payload) =>
    request("/testimonials", { method: "POST", body: JSON.stringify(payload) }, true),
  updateTestimonial: (id, payload) =>
    request(`/testimonials/${id}`, { method: "PUT", body: JSON.stringify(payload) }, true),
  deleteTestimonial: (id) =>
    request(`/testimonials/${id}`, { method: "DELETE" }, true),

  // Site Settings Endpoints
  getSettings: () => request("/settings"),
  updateSettings: (payload) =>
    request("/settings", { method: "PUT", body: JSON.stringify(payload) }, true),

  // File Manager Endpoints
  getMediaFiles: () => request("/upload/files", {}, true),
  deleteMediaFile: (name) => request(`/upload/files/${name}`, { method: "DELETE" }, true),
};

export { API_BASE };
