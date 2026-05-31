import { Link } from "react-router-dom";
import AboutImageFrame from "../components/AboutImageFrame";
import PageShell from "../components/PageShell";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";

function AboutPage() {
  const { data: portfolio, loading, error } = useFetch(() => api.getPortfolio(), []);

  const mission = portfolio?.about?.mission || "Mission details coming soon.";
  const journey = portfolio?.about?.journey || "";
  const imageUrl = portfolio?.about?.imageUrl;

  return (
    <PageShell loading={loading} error={error} className="section alt">
      <section className="section alt about-page">
        <div className="section-inner about-grid">
          <div className="about-copy">
            <p className="eyebrow">About Me</p>
            <h1>Building thoughtful products with code and creativity.</h1>
            <p className="lead about-lead">{mission}</p>
            {journey && <p className="about-journey">{journey}</p>}
            <div className="hero-actions about-actions">
              <Link to="/services" className="btn btn-primary">
                Services
              </Link>
              <Link to="/services#contact" className="btn btn-secondary">
                Let&apos;s Connect
              </Link>
            </div>
          </div>
          <AboutImageFrame src={imageUrl} />
        </div>
      </section>
    </PageShell>
  );
}

export default AboutPage;
