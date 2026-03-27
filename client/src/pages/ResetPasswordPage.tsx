import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/Toast";

const getPasswordStrength = (
  password: string
): { level: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels: { label: string; color: string }[] = [
    { label: "Too short", color: "#ef4444" },
    { label: "Weak", color: "#f97316" },
    { label: "Fair", color: "#eab308" },
    { label: "Good", color: "#22c55e" },
    { label: "Strong", color: "#6366f1" },
  ];

  return { level: score, ...levels[score] };
};

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast("error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api(`/auth/reset-password/${token}`, {
        method: "POST",
        body: { password, confirmPassword },
      });

      setSuccess(true);
      addToast("success", "Password reset successfully!");
    } catch (err: unknown) {
      const error = err as { message?: string };
      addToast(
        "error",
        error.message || "Failed to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="12" fill="url(#logoGrad3)" />
                <rect
                  x="12"
                  y="17"
                  width="16"
                  height="12"
                  rx="3"
                  stroke="white"
                  strokeWidth="2.5"
                />
                <path
                  d="M15 17V13C15 10.24 17.24 8 20 8C22.76 8 25 10.24 25 13V17"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="logoGrad3"
                    x1="0"
                    y1="0"
                    x2="40"
                    y2="40"
                  >
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="auth-title">
              {success ? "Password Reset!" : "Reset Password"}
            </h1>
            <p className="auth-subtitle">
              {success
                ? "Your password has been updated. You can now sign in."
                : "Create a new password for your account"}
            </p>
          </div>

          {success ? (
            <div className="success-state">
              <div className="success-icon-large">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle
                    cx="32"
                    cy="32"
                    r="32"
                    fill="#6366f1"
                    fillOpacity="0.1"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="22"
                    fill="#6366f1"
                    fillOpacity="0.15"
                  />
                  <path
                    d="M22 33L29 40L42 25"
                    stroke="#6366f1"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <button
                className="btn btn-primary w-full"
                onClick={() => navigate("/")}
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="reset-password" className="form-label">
                  New Password
                </label>
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <rect
                      x="4"
                      y="8"
                      width="10"
                      height="8"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6 8V5C6 3.34 7.34 2 9 2C10.66 2 12 3.34 12 5V8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="reset-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="form-input has-icon has-toggle"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M2 2L16 16M7.58 7.58A2 2 0 0010.42 10.42M3.18 6.18C2.18 7.18 1.5 8.18 1.5 9C1.5 9 4 14 9 14C10.02 14 10.96 13.76 11.8 13.37M14.82 11.82C15.82 10.82 16.5 9.82 16.5 9C16.5 9 14 4 9 4C7.98 4 7.04 4.24 6.2 4.63"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M1.5 9C1.5 9 4 4 9 4C14 4 16.5 9 16.5 9C16.5 9 14 14 9 14C4 14 1.5 9 1.5 9Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="9"
                          cy="9"
                          r="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {password && (
                  <div className="password-strength">
                    <div className="strength-bars">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="strength-bar"
                          style={{
                            backgroundColor:
                              i < strength.level ? strength.color : "#e5e7eb",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="strength-label"
                      style={{ color: strength.color }}
                    >
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="reset-confirm" className="form-label">
                  Confirm New Password
                </label>
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M5 9L8 12L13 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="9"
                      cy="9"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <input
                    type="password"
                    id="reset-confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className={`form-input has-icon ${confirmPassword && confirmPassword !== password ? "input-error" : ""}`}
                    required
                  />
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <span className="field-error">Passwords do not match</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={
                  loading ||
                  (!!confirmPassword && confirmPassword !== password)
                }
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <div className="auth-footer" style={{ marginTop: "24px" }}>
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate("/")}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
