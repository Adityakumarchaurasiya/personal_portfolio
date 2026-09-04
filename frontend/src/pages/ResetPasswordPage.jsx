import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form submit handler for requesting reset link (no token in URL)
  const handleRequestLink = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const data = await api.resetPassword(email);
      setMessage(data.message || "Password reset email sent. Please check your inbox (or Ethereal console logs).");
    } catch (err) {
      setError(err.message || "Could not process reset request.");
    } finally {
      setSubmitting(false);
    }
  };

  // Form submit handler for setting new password (token in URL)
  const handleResetConfirm = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const data = await api.confirmResetPassword(token, password);
      setMessage(data.message || "Password updated successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Could not update password. Reset token might have expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section auth-section">
      <div className="section-inner auth-card">
        <h1>{token ? "Create New Password" : "Reset Password"}</h1>
        <p className="muted">
          {token 
            ? "Enter a new secure password for your admin account." 
            : "Enter your admin email to request a reset link."
          }
        </p>

        {token ? (
          // Reset Confirm Form (when token is in URL)
          <form className="auth-form" onSubmit={handleResetConfirm}>
            <label>
              New Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </label>
            <label>
              Confirm New Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </label>
            {message && <p className="status success">{message}</p>}
            {error && <p className="status error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Updating..." : "Reset Password"}
            </button>
          </form>
        ) : (
          // Link Request Form (default)
          <form className="auth-form" onSubmit={handleRequestLink}>
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
        )}

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
