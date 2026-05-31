import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import PageShell from "../components/PageShell";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";
import "./ServicesPage.css";

function externalHref(value) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  return `https://${value.replace(/^\/\//, "")}`;
}

function ServicesPage() {
  const { data: dbServices, loading: servicesLoading, error: servicesError } = useFetch(
    () => api.getServices(),
    []
  );
  const { data: contact, loading: contactLoading, error: contactError } = useFetch(
    () => api.getContact(),
    {}
  );

  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [formNote, setFormNote] = useState("");

  const loading = servicesLoading || contactLoading;
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
    const destinationEmail = contact?.email || "aditya@creativ.dev";
    
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

      {/* Fiverr Gig Statistics Section */}
      <section className="section services-fiverr-section">
        <div className="container project-layout-container">
          <div className="fiverr-showcase-box">
            <div className="fiverr-badge">
              <i className="fab fa-fiverr"></i> Available on Fiverr
            </div>
            <h2>Hire Me on <span className="fiverr-highlight">Fiverr</span></h2>
            <p>Providing professional full-stack and content creation services with fast delivery and guaranteed satisfaction.</p>
            
            <div className="fiverr-stats-row">
              <div className="fiverr-stat-item">
                <div className="number">50+</div>
                <div className="label">Orders Completed</div>
              </div>
              <div className="fiverr-stat-item">
                <div className="number">5.0</div>
                <div className="label">Rating (★★★★★)</div>
              </div>
              <div className="fiverr-stat-item">
                <div className="number">24hr</div>
                <div className="label">Avg Response Time</div>
              </div>
            </div>
            
            <a 
              href="https://www.fiverr.com/adityachaura/buying?source=avatar_menu_profile" 
              target="_blank" 
              rel="noreferrer" 
              className="fiverr-btn-link"
            >
              <i className="fab fa-fiverr"></i> View Fiverr Gig Profile <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </section>

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
                  <a href={`mailto:${contact?.email || "aditya@creativ.dev"}`}>{contact?.email || "aditya@creativ.dev"}</a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="contact-detail-text">
                  <h4>WhatsApp</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <i className="fab fa-skype"></i>
                </div>
                <div className="contact-detail-text">
                  <h4>Skype Chat</h4>
                  <p>live:aditya_verma</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <i className="fab fa-discord"></i>
                </div>
                <div className="contact-detail-text">
                  <h4>Discord Server</h4>
                  <p>aditya.codes</p>
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
