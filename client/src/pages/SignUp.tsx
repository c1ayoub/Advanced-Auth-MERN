import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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

export default function SignUp() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast("error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api("/auth/register", {
        method: "POST",
        body: { name, email, phoneNumber: phoneNumber || undefined, password },
      });

      addToast("success", "Account created successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      addToast("error", error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join us today and get started in minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="signup-name" className="form-label">
                  Full Name
                </label>
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <circle
                      cx="9"
                      cy="6"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 16C3 13.24 5.69 11 9 11C12.31 11 15 13.24 15 16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type="text"
                    id="signup-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="form-input has-icon"
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-phone" className="form-label">
                  Phone
                  <span className="label-optional">Optional</span>
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
                      x="5"
                      y="2"
                      width="8"
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="7"
                      y1="13"
                      x2="11"
                      y2="13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type="tel"
                    id="signup-phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="form-input has-icon"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-email" className="form-label">
                Email Address
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
                    d="M3 5L9 10L15 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="2"
                    y="3"
                    width="14"
                    height="12"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <input
                  type="email"
                  id="signup-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-input has-icon"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">
                Password
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
                  id="signup-password"
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M2 2L16 16M7.58 7.58A2 2 0 0010.42 10.42M3.18 6.18C2.18 7.18 1.5 8.18 1.5 9C1.5 9 4 14 9 14C10.02 14 10.96 13.76 11.8 13.37M14.82 11.82C15.82 10.82 16.5 9.82 16.5 9C16.5 9 14 4 9 4C7.98 4 7.04 4.24 6.2 4.63"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
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
              <label htmlFor="signup-confirm" className="form-label">
                Confirm Password
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
                  id="signup-confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
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
              disabled={loading || (!!confirmPassword && confirmPassword !== password)}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-footer">
            <p className="auth-footer-text">Already have an account?</p>
            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={() => navigate("/")}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
