import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import PageShell from "../components/PageShell";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";
import "./ServicesPage.css";

function ServicesPage() {
  const { data: dbServices, loading: servicesLoading, error: servicesError } = useFetch(
    () => api.getServices(),
    []
  );
  const { data: contact, loading: contactLoading, error: contactError } = useFetch(
    () => api.getContact(),
    {}
  );
  const { data: testimonials, loading: testLoading } = useFetch(
    () => api.getTestimonials(),
    []
  );

  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [formNote, setFormNote] = useState("");

  const loading = servicesLoading || contactLoading || testLoading;
  const error = servicesError || contactError;

  const handleOpenContactForm = (serviceTitle) => {
    setForm((prev) => ({ ...prev, service: serviceTitle }));
    const formElement = document.getElementById("contact-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const destinationEmail = contact?.email || "adityakumar583ak@gmail.com";
    
    const subject = encodeURIComponent(`Service Quote Request: ${form.service || "General Inquiry"}`);
    const body = encodeURIComponent(
      `Hello Aditya,\n\nI would like to request a quote regarding: ${form.service || "General Inquiry"}.\n\nMessage Detail:\n${form.message}\n\nClient Name: ${form.name}\nClient Email: ${form.email}\n\nSent from Portfolio Services & Connect Hub.`
    );
    
    window.location.href = `mailto:${destinationEmail}?subject=${subject}&body=${body}`;
    setFormNote(`Opening your email client to send to ${destinationEmail}...`);
    setTimeout(() => setFormNote(""), 5000);
  };

  return (
    <PageShell loading={loading} error={error} className="services-page">
      
      {/* Hero Section */}
      <section className="section services-hero">
        <div className="container project-layout-container">
          <div className="services-hero-badge">
            <i className="fas fa-star"></i> What I Offer
          </div>
          <h1>Services &amp; <span>Solutions</span></h1>
          <p>Professional custom services and developer solutions tailored to bring your ideas to life.</p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="section alt services-grid-section">
        <div className="container project-layout-container">
          <div className="services-grid">
            {dbServices && dbServices.length > 0 ? (
              dbServices.map((service, index) => (
                <article key={service._id || index} className="service-card">
                  <div className="service-icon">
                    <i className={service.icon || "fas fa-cogs"}></i>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  
                  {service.features && service.features.length > 0 && (
                    <ul className="service-features">
                      {service.features.map((feat, idx) => (
                        <li key={idx}>
                          <i className="fas fa-check-circle"></i> {feat}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {service.price && (
                    <div className="service-price">{service.price}</div>
                  )}
                  
                  <button 
                    className="service-btn" 
                    onClick={() => handleOpenContactForm(service.title)}
                  >
                    Request Quote &rarr;
                  </button>
                </article>
              ))
            ) : (
              <p className="muted" style={{ gridColumn: "1/-1", textAlign: "center" }}>No services configured.</p>
            )}
          </div>
        </div>
      </section>

      {/* Fiverr Freelancer Account Card */}
      <section className="section services-fiverr-section" style={{ padding: "3rem 0" }}>
        <div className="container project-layout-container" style={{ display: "flex", justifyContent: "center" }}>
          <div className="fiverr-showcase-card" style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "1.5rem",
            padding: "2.5rem 3rem",
            maxWidth: "750px",
            width: "100%",
            boxShadow: "var(--card-shadow)",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Top Green Accent Line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#1dbf73" }}></div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#1dbf73", color: "#fff", padding: "0.4rem 1.1rem", borderRadius: "2rem", fontSize: "0.85rem", fontWeight: 600 }}>
                <i className="fab fa-fiverr"></i> Verified Fiverr Seller
              </div>
              <span style={{ fontSize: "0.85rem", color: "#1dbf73", fontWeight: 600, background: "rgba(29, 191, 115, 0.1)", padding: "0.35rem 1rem", borderRadius: "20px", border: "1px solid rgba(29, 191, 115, 0.25)" }}>
                <i className="fas fa-check-circle"></i> Level 2 Seller Status
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#1dbf73", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: "bold" }}>
                A
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.6rem", color: "var(--text)" }}>
                  Aditya Kumar
                </h3>
                <span style={{ color: "#1dbf73", fontWeight: 600, fontSize: "0.95rem" }}>@adityachaura</span>
                <p style={{ margin: "0.2rem 0 0", color: "var(--muted)", fontSize: "0.92rem" }}>
                  Full-Stack Web Developer &amp; Content Creator
                </p>
              </div>
            </div>

            {/* Performance Stats Bar */}
            <div className="fiverr-stats-row" style={{ margin: "1.8rem 0", padding: "1.2rem", background: "var(--surface-soft)", borderRadius: "1rem", border: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1dbf73", fontFamily: "Space Grotesk, sans-serif" }}>50+</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 600 }}>Orders Completed</div>
              </div>
              <div>
                <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1dbf73", fontFamily: "Space Grotesk, sans-serif" }}>5.0 ⭐</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 600 }}>Client Rating</div>
              </div>
              <div>
                <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1dbf73", fontFamily: "Space Grotesk, sans-serif" }}>100%</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 600 }}>On-Time Delivery</div>
              </div>
              <div>
                <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1dbf73", fontFamily: "Space Grotesk, sans-serif" }}>&lt; 1hr</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 600 }}>Response Time</div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginTop: "1.5rem" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <i className="fas fa-shield-alt" style={{ color: "#1dbf73" }}></i> 100% Fiverr Buyer Protection Guaranteed
              </div>
              <a
                href="https://www.fiverr.com/adityachaura/buying?source=avatar_menu_profile"
                target="_blank"
                rel="noreferrer"
                className="fiverr-btn-link"
              >
                <i className="fab fa-fiverr"></i> Visit Fiverr Profile <i className="fas fa-arrow-right"></i>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="section services-testimonials-section">
          <div className="container project-layout-container">
            <SectionHeader
              title="Client Testimonials"
              subtitle="What clients and collaborators say about my software development and technical solutions."
              centered
            />
            <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {testimonials.map((item) => (
                <div key={item._id} className="testimonial-card" style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "1.8rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem"
                }}>
                  <div style={{ color: "#f59e0b", fontSize: "0.9rem" }}>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p style={{ fontStyle: "italic", color: "var(--text)", lineHeight: 1.6, flex: 1, margin: 0 }}>
                    &quot;{item.feedback}&quot;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "0.5rem" }}>
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.clientName} style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                        {item.clientName?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <strong style={{ display: "block", fontSize: "0.95rem" }}>{item.clientName}</strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{item.clientTitle || "Client"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Get in Touch & Contact Section */}
      <section className="section alt contact-section" id="contact-section">
        <div className="container project-layout-container">
          <div className="section-header-centered">
            <h2>Get in <span>Touch</span></h2>
            <div className="accent-bar"></div>
            <p>Let's discuss your custom project, consulting session, or content scripting needs.</p>
          </div>

          <div className="contact-grid">
            {/* Left Column: Connect Info */}
            <div className="contact-info-card">
              <h3>Connect With Me</h3>
              <p className="info-intro-copy">Available for private freelancing contracts, technical advising, and content creations.</p>
              
              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-detail-text">
                  <h4>Email Address</h4>
                  <a href={`mailto:${contact?.email || "adityakumar583ak@gmail.com"}`}>{contact?.email || "adityakumar583ak@gmail.com"}</a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="contact-detail-text">
                  <h4>WhatsApp</h4>
                  <p>{contact?.phone || contact?.whatsapp || "+91 7070371608"}</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <i className="fab fa-linkedin"></i>
                </div>
                <div className="contact-detail-text">
                  <h4>LinkedIn Profile</h4>
                  <a href={contact?.linkedin || "https://www.linkedin.com/in/aditya-chaurasiya/"} target="_blank" rel="noreferrer">
                    Connect on LinkedIn
                  </a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <i className="fab fa-github"></i>
                </div>
                <div className="contact-detail-text">
                  <h4>GitHub Repositories</h4>
                  <a href={contact?.github || "https://github.com/Adityakumarchaurasiya"} target="_blank" rel="noreferrer">
                    View GitHub Repos
                  </a>
                </div>
              </div>

              <div className="availability-tag">
                <i className="fas fa-circle"></i> Available for custom work · Response within 24 hours
              </div>
            </div>

            {/* Right Column: Contact Input Form */}
            <div className="contact-form-card">
              <h3>Send a Message</h3>
              <form onSubmit={handleSubmit} className="quote-contact-form">
                <div className="form-input-field">
                  <input 
                    type="text" 
                    placeholder="Your Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-input-field">
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-input-field">
                  <select 
                    value={form.service} 
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                  >
                    <option value="">Select Service Interested In</option>
                    {dbServices && dbServices.length > 0 ? (
                      dbServices.map((service, idx) => (
                        <option key={idx} value={service.title}>
                          {service.title}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="AI Development">AI Development</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Content Creation">Content Creation</option>
                        <option value="Technical Writing">Technical Writing</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="form-input-field">
                  <textarea 
                    rows="4" 
                    placeholder="Tell me about your project, timeline, or requirements..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="form-submit-btn">
                  <i className="fas fa-paper-plane"></i> Request Quote
                </button>
                {formNote && <p className="form-note-feedback">{formNote}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default ServicesPage;
