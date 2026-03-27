import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/Toast";
import ModalForgetPass from "../components/ModalForgetPass";

export default function SignInPage() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api<{ token: string; user: unknown }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
        addToast("success", "Welcome back!");
        setTimeout(() => navigate("/dashboard"), 500);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      addToast("error", error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="signin-email" className="form-label">
                Email
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
                  id="signin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-input has-icon"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signin-password" className="form-label">
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
                  id="signin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input has-icon has-toggle"
                  required
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
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="link-btn"
                onClick={() => setModalOpen(true)}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-footer">
            <p className="auth-footer-text">Don't have an account?</p>
            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      <ModalForgetPass
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onToast={addToast}
      />
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
