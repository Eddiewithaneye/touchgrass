import { useState } from "react";
import "./Login.css"; // styles below

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // simple validation (same logic as your TS page)
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // call your backend — replace with your real API
      await fakeAuthApiSignup(formData.email, formData.password);
      setCreated(true); // or navigate with your router
      // e.g., if using react-router: navigate("/scavenger-hunt");
    } catch (err) {
      setError(err?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="intro">
        <div className="emoji">🌿</div>
        <h2 className="title">Create your account</h2>
        <p className="hint">
          Already have an account?{" "}
          <a href="/login" className="link">Sign in here</a>
        </p>
      </div>

      <div className="card">
        <form className="form" onSubmit={handleSubmit} noValidate>
          {error && <div className="alert">{error}</div>}
          {created && <div className="success">Account created! 🎉</div>}

          <label className="field">
            <span className="label">Email</span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="input"
            />
          </label>

          <label className="field">
            <span className="label">Password</span>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="input"
            />
            <span className="help">Must be at least 6 characters</span>
          </label>

          <label className="field">
            <span className="label">Confirm password</span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="input"
            />
          </label>

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="terms">
          <div className="rule"><span>Terms</span></div>
          <p className="tos">
            By signing up, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Replace this with your real API call */
function fakeAuthApiSignup(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // simple mock
      if (email.endsWith("@example.com")) reject(new Error("Email already in use"));
      else resolve({ ok: true });
    }, 700);
  });
}
