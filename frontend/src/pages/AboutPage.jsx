import { Link } from "react-router-dom";
import AboutImageFrame from "../components/AboutImageFrame";
import PageShell from "../components/PageShell";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";

function AboutPage() {
  const { data: portfolio, loading: portLoading, error: portError } = useFetch(() => api.getPortfolio(), []);
  const { data: experiences, loading: expLoading } = useFetch(() => api.getExperiences(), []);

  const loading = portLoading || expLoading;
  const error = portError;

  const mission = portfolio?.about?.mission || "Mission details coming soon.";
  const journey = portfolio?.about?.journey || "";
  const imageUrl = portfolio?.about?.imageUrl;

  return (
    <PageShell loading={loading} error={error} className="section alt">
      <div className="about-page">
        {/* Main About Hero Grid */}
        <div className="section-inner about-grid">
          <div className="about-copy">
            <p className="eyebrow">
              <i className="fa-solid fa-user" style={{ marginRight: "0.5rem", color: "var(--accent)" }}></i>
              About Me
            </p>
            <h1>Building intelligent products with code, AI, and creativity.</h1>
            <p className="lead about-lead">{mission}</p>
            {journey && <p className="about-journey">{journey}</p>}
            <div className="hero-actions about-actions">
              <Link to="/services" className="btn btn-primary">
                <i className="fa-solid fa-handshake" style={{ marginRight: "0.4rem" }}></i> Services
              </Link>
              <Link to="/services#contact" className="btn btn-secondary">
                <i className="fa-solid fa-paper-plane" style={{ marginRight: "0.4rem" }}></i> Let&apos;s Connect
              </Link>
            </div>
          </div>
          <AboutImageFrame src={imageUrl} alt="Aditya Kumar" />
        </div>

        {/* Experience Timeline Section */}
        <div className="section-inner about-experience-section">
          <h2 className="section-title" style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>
            <i className="fa-solid fa-briefcase" style={{ color: "var(--accent)", marginRight: "0.6rem" }}></i>
            Work Experience
          </h2>

          {experiences && experiences.length > 0 ? (
            <div className="experience-timeline">
              {experiences.map((exp) => (
                <div key={exp._id} className="experience-card">
                  <div className="exp-header">
                    <h3 className="exp-role">
                      {exp.role} <span className="exp-company">@ {exp.company}</span>
                    </h3>
                    <span className="exp-duration">
                      <i className="fa-regular fa-calendar-days" style={{ marginRight: "0.4rem" }}></i>
                      {exp.duration}
                    </span>
                  </div>
                  {exp.description && <p className="exp-desc">{exp.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "var(--surface)",
                border: "1px dashed var(--border)",
                borderRadius: "16px",
                padding: "2.5rem",
                textAlign: "center",
                color: "var(--muted)",
              }}
            >
              <i className="fa-solid fa-briefcase" style={{ fontSize: "2rem", marginBottom: "0.8rem", opacity: 0.5, display: "block" }}></i>
              <p style={{ margin: 0 }}>No work experience entries logged yet. Add your work history from the Admin Console.</p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default AboutPage;
