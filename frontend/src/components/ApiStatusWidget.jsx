import { useState } from "react";
import { api, API_BASE } from "../services/api";

function ApiStatusWidget() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const checkHealth = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const data = await api.health();
      setStatus("success");
      setMessage(
        `${data?.message || "Backend is healthy."} (MongoDB: ${data?.mongodb || "unknown"})`
      );
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Could not reach backend.");
    }
  };

  return (
    <div className="api-widget">
      <p className="muted small">API endpoint: {API_BASE}</p>
      <button
        onClick={checkHealth}
        disabled={status === "loading"}
        className="btn btn-secondary"
        type="button"
      >
        {status === "loading" ? "Checking..." : "Check API Status"}
      </button>
      {status !== "idle" && (
        <p className={`status ${status}`}>
          <strong>{status.toUpperCase()}:</strong> {message}
        </p>
      )}
    </div>
  );
}

export default ApiStatusWidget;
