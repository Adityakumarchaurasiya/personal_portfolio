import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import PageShell from "../components/PageShell";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";
import "./ProjectsPage.css";

// Helper function to map category names to FontAwesome icons
const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes("front") || cat.includes("react") || cat.includes("ui")) return "fab fa-react";
  if (cat.includes("back") || cat.includes("node") || cat.includes("server") || cat.includes("db")) return "fas fa-server";
  if (cat.includes("ai") || cat.includes("learn") || cat.includes("brain") || cat.includes("python") || cat.includes("ml")) return "fas fa-brain";
  if (cat.includes("content") || cat.includes("video") || cat.includes("write") || cat.includes("copy")) return "fas fa-video";
  return "fas fa-cogs";
};

function ProjectsPage() {
  const { data: skills, loading: skillsLoading, error: skillsError } = useFetch(
    () => api.getSkills(),
    []
  );
  const { data: projects, loading: projectsLoading, error: projectsError } = useFetch(
    () => api.getProjects(),
    []
  );

  const [animated, setAnimated] = useState(false);

  const loading = skillsLoading || projectsLoading;
  const error = skillsError || projectsError;

  useEffect(() => {
    if (!loading && skills?.length > 0) {
      const timer = setTimeout(() => {
        setAnimated(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, skills]);

  // Group flat skills list by category (field: skill.tech)
  const groupedSkills = (skills || []).reduce((acc, skill) => {
    const category = skill.tech || "Core Technologies";
    if (!acc[category]) {
      acc[category] = {
        id: category,
        name: category,
        icon: getCategoryIcon(category),
        skills: [],
      };
    }
    acc[category].skills.push({
      name: skill.name,
      percentage: skill.percentage || 80,
    });
    return acc;
  }, {});

  const skillCategories = Object.values(groupedSkills);
  const allSkillsList = (skills || []).map((s) => s.name);

  return (
    <PageShell loading={loading} error={error}>
      <div className="projects-page-wrap">
        
        {/* Projects Section */}
        <section className="section project-custom-section">
          <div className="container project-layout-container">
            <SectionHeader
              title="Featured Projects"
              subtitle="Explore my latest builds spanning full-stack applications, intelligent AI products, and automated systems."
              centered
            />

            {!projects?.length ? (
              <p className="muted" style={{ textAlign: "center" }}>No projects added yet.</p>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <article key={project._id} className="project-card">
                    <img
                      src={project.image || "https://placehold.co/600x400/F0EBE6/8B5E3C?text=Project"}
                      alt={project.title}
                      className="project-image"
                    />
                    <div className="project-badge">Featured</div>
                    <div className="project-content">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">{project.description}</p>
                      {project.tech?.length > 0 && (
                        <div className="tech-stack">
                          {project.tech.map((t, idx) => (
                            <span key={idx} className="tech-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="project-links">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="project-link github-link"
                          >
                            <i className="fab fa-github" /> Code
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noreferrer"
                            className="project-link live-link"
                          >
                            <i className="fas fa-external-link-alt" /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Technical Skills Section */}
        <section className="section alt skills-showcase-section">
          <div className="container project-layout-container">
            <SectionHeader
              title="Technical Skills"
              subtitle="My expertise and proficiency across different engineering and creation domains."
              centered
            />

            {!skillCategories.length ? (
              <p className="muted" style={{ textAlign: "center" }}>No skills added yet.</p>
            ) : (
              <div className="skills-category-grid">
                {skillCategories.map((category) => (
                  <div key={category.id} className="skill-category-card">
                    <div className="category-title">
                      <i className={category.icon} />
                      <h3>{category.name}</h3>
                    </div>
                    <div className="skills-wrapper">
                      {category.skills.map((skill, idx) => (
                        <div key={idx} className="skill-progress-item">
                          <div className="skill-header">
                            <span className="skill-name">
                              <i className="fas fa-code" style={{ fontSize: "0.8rem", color: "var(--accent)" }} />
                              {skill.name}
                            </span>
                            <span className="percentage-text">{skill.percentage}%</span>
                          </div>
                          <div className="progress-track">
                            <div
                              className="progress-fill"
                              style={{ width: animated ? `${skill.percentage}%` : "0%" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Floating Skills Bubbles */}
        {allSkillsList.length > 0 && (
          <section className="section-compact">
            <div className="container project-layout-container">
              <div className="floating-skills">
                <h3>
                  <i className="fas fa-cogs" /> Core Competencies
                </h3>
                <div className="skills-bubble-grid">
                  {allSkillsList.map((skill, idx) => (
                    <span key={idx} className="skill-bubble">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </PageShell>
  );
}

export default ProjectsPage;
