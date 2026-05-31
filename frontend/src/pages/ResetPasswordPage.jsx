import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const data = await api.resetPassword(email);
      setMessage(data.message || "Password reset email sent.");
    } catch (err) {
      setError(err.message || "Could not process reset request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section auth-section">
      <div className="section-inner auth-card">
        <h1>Reset Password</h1>
        <p className="muted">Enter your admin email to request a reset link.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          {message && <p className="status success">{message}</p>}
          {error && <p className="status error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="muted small auth-links">
          <Link to="/login">Back to login</Link>
          <span> · </span>
          <Link to="/">Back to portfolio</Link>
        </p>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
