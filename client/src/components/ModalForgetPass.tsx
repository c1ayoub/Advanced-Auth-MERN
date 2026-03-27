import { useState, type FormEvent } from "react";

interface ModalForgetPassProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (type: "success" | "error" | "info", message: string) => void;
}

export default function ModalForgetPass({
  isOpen,
  onClose,
  onToast,
}: ModalForgetPassProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSent(true);
        onToast("success", data.message);
      } else {
        onToast("error", data.message || "Something went wrong");
      }
    } catch {
      onToast("error", "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {sent ? (
          <div className="modal-success-state">
            <div className="modal-success-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#6366f1" fillOpacity="0.12" />
                <path
                  d="M15 25L21 31L33 17"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="modal-title">Check Your Email</h3>
            <p className="modal-description">
              If an account exists with that email, you'll receive a password
              reset link shortly. Check your inbox and spam folder.
            </p>
            <button className="btn btn-primary w-full" onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#6366f1" fillOpacity="0.12" />
                <path
                  d="M16 20L24 26L32 20"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="14"
                  y="17"
                  width="20"
                  height="14"
                  rx="3"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
            <h3 className="modal-title">Forgot Password?</h3>
            <p className="modal-description">
              Enter the email address associated with your account and we'll
              send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reset-email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-input"
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}