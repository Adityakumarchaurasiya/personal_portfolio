import { Link } from "react-router-dom";

function Footer({ scrollProgress = 0 }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer-compact">
      {/* Dynamic Scroll Fill Line above Footer */}
      <div className="footer-scroll-line-track">
        <div
          className="footer-scroll-line-fill"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="container footer-compact-container">
        
        {/* Main Text Content */}
        <div className="footer-compact-main">
          <Link to="/home" className="footer-compact-handle">
            @AdityaKumar
          </Link>
          <p className="footer-compact-tagline">
            Building digital experiences with code &amp; creativity.
          </p>
          <p className="footer-compact-meta">
            <span className="availability-dot">🟢</span> Available for work &middot; &copy; {new Date().getFullYear()}
          </p>
        </div>

        {/* Social Shortcuts & Back to Top */}
        <div className="footer-compact-actions">
          <div className="footer-compact-socials">
            <a href="https://github.com/Adityakumarchaurasiya" target="_blank" rel="noreferrer" title="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/aditya-chaurasiya/" target="_blank" rel="noreferrer" title="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.youtube.com/@AdityaKnowledgeHub-e8h" target="_blank" rel="noreferrer" title="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="mailto:adityakumar583ak@gmail.com" title="Email">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
          <button type="button" onClick={scrollToTop} className="compact-top-btn" title="Back to top">
            <i className="fas fa-arrow-up"></i>
          </button>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
