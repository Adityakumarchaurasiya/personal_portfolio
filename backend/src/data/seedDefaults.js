const defaultPortfolio = {
  hero: {
    title: "Crafting digital experiences with purpose.",
    description:
      "Full-stack developer, AI explorer, and content storyteller building products and sharing what I learn on YouTube.",
    imageUrl: "",
  },
  about: {
    mission: "Computer Science student & AI enthusiast focused on practical software.",
    journey:
      "15k+ YouTube subscribers on @AdityaKnowledgeHub-e8h — learning full-stack development, AI, and automation in public while shipping real projects.",
    imageUrl: "",
  },
};

const defaultSkills = [
  { name: "React", icon: "fa-brands fa-react", tech: "Frontend" },
  { name: "Node.js", icon: "fa-brands fa-node-js", tech: "Backend" },
  { name: "Python", icon: "fa-brands fa-python", tech: "AI / Scripts" },
  { name: "MongoDB", icon: "fa-solid fa-database", tech: "Database" },
  { name: "TypeScript", icon: "fa-solid fa-code", tech: "Language" },
];

const defaultProjects = [
  {
    title: "Personal Portfolio",
    description: "React + Express portfolio with admin CMS and live API integrations.",
    tech: ["React", "Express", "MongoDB"],
    icon: "fa-solid fa-laptop-code",
  },
  {
    title: "AI Automation Toolkit",
    description: "Workflow automations and AI-assisted tools for creators and developers.",
    tech: ["Python", "OpenAI API"],
    icon: "fa-solid fa-robot",
  },
];

const defaultYouTube = {
  channel: "@AdityaKnowledgeHub-e8h",
  channelId: "",
  subscribers: "—",
  videos: "—",
  growth: "Connect YouTube API for live stats",
};

const defaultArticles = [
  { title: "How I structure React projects", readTime: "6 min read" },
  { title: "Learning AI as a developer", readTime: "8 min read" },
  { title: "Content writing for technical YouTube", readTime: "5 min read" },
];

const defaultContact = {
  linkedin: "",
  github: "https://github.com/Adityakumarchaurasiya",
  youtube: "@AdityaKnowledgeHub-e8h",
  email: "aditya@creativ.dev",
};

const defaultAchievements = [
  { icon: "fas fa-star", title: "LeetCode Coder", desc: "250+ Solved (Top 5% Knights)" },
  { icon: "fas fa-code-branch", title: "GitHub Highlights", desc: "80+ Stars (Active Open Source Contributor)" },
  { icon: "fab fa-linkedin", title: "LinkedIn Influence", desc: "2,500+ Contacts (AI & Full Stack Professional Network)" },
  { icon: "fas fa-trophy", title: "GFG Coding", desc: "180+ Solved (GFG Coding Expert)" },
  { icon: "fas fa-certificate", title: "Google AI Certification", desc: "Generative AI Specialization" },
  { icon: "fas fa-award", title: "Hackathon Winner", desc: "Global AI Hackathon 2024" },
  { icon: "fas fa-chalkboard-user", title: "Featured Speaker", desc: "Technical Workshops Coordinator" },
  { icon: "fas fa-file-contract", title: "Open Source Creator", desc: "10+ Custom AI Automation Repositories" },
];

const defaultServices = [
  {
    title: "AI-Powered Applications",
    description: "Custom AI solutions, LLM integration, and intelligent automation systems.",
    icon: "fas fa-robot",
    price: "Starting from $2,500",
    features: [
      "Custom AI Agents",
      "LLM Integration (GPT, Claude, Gemini)",
      "RAG Systems",
      "AI Chatbots & Assistants"
    ]
  },
  {
    title: "Full Stack Development",
    description: "End-to-end web applications with modern technologies and best practices.",
    icon: "fas fa-globe",
    price: "Starting from $3,000",
    features: [
      "React / Next.js Applications",
      "Node.js / Python Backend",
      "Database Design & Optimization",
      "Cloud Deployment (AWS/Vercel)"
    ]
  },
  {
    title: "Content Creation",
    description: "Professional video content, scripting, and YouTube channel management.",
    icon: "fas fa-film",
    price: "Starting from $500/video",
    features: [
      "Video Script Writing",
      "Professional Video Editing",
      "YouTube SEO & Optimization",
      "Thumbnail Design"
    ]
  },
  {
    title: "Technical Writing",
    description: "High-quality technical content, documentation, and blog posts.",
    icon: "fas fa-pen-fancy",
    price: "Starting from $300/article",
    features: [
      "Blog Posts & Articles",
      "API Documentation",
      "Tutorials & Guides",
      "White Papers"
    ]
  },
  {
    title: "Tech Consulting",
    description: "Expert guidance on technology decisions, architecture, and career growth.",
    icon: "fas fa-chalkboard-user",
    price: "$150/hour",
    features: [
      "Architecture Review",
      "Code Review & Optimization",
      "Career Mentorship",
      "Technical Interviews Prep"
    ]
  },
  {
    title: "Open Source Contributions",
    description: "Custom features, bug fixes, and contributions to open source projects.",
    icon: "fas fa-code-branch",
    price: "Custom Quote",
    features: [
      "Feature Development",
      "Bug Fixes & Security Patches",
      "Documentation Improvements",
      "Code Review & Testing"
    ]
  }
];

module.exports = {
  defaultPortfolio,
  defaultSkills,
  defaultProjects,
  defaultYouTube,
  defaultArticles,
  defaultContact,
  defaultAchievements,
  defaultServices,
};
