function PageShell({ loading, error, children, className = "section" }) {
  if (loading) {
    return (
      <section className={className}>
        <div className="section-inner">
          <p className="muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {error && (
        <section className="section section-compact">
          <div className="section-inner">
            <p className="status error">{error}</p>
          </div>
        </section>
      )}
      {children}
    </>
  );
}

export default PageShell;
