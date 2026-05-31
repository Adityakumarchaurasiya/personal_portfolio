function SectionHeader({ title, subtitle, centered = false }) {
  return (
    <div className={`section-header ${centered ? "centered" : ""}`}>
      <h2>{title}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}
    </div>
  );
}

export default SectionHeader;
