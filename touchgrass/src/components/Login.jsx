import { useState } from "react";
import "./Login.css"; // styles below

export default function Login({ isSignup = true }) {
  const [formData, setFormData] = useState({
    displayName: "",
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

    // Validation for signup vs login
    if (isSignup) {
      if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
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
    } else {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isSignup) {
        await fakeAuthApiSignup(formData.email, formData.password, formData.displayName);
        setCreated(true);
      } else {
        await fakeAuthApiLogin(formData.email, formData.password);
        setCreated(true);
      }
    } catch (err) {
      setError(err?.message || (isSignup ? "Failed to create account" : "Failed to sign in"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="intro">
        <div className="emoji">🌿</div>
        <h2 className="title">{isSignup ? "Create your account" : "Welcome back!"}</h2>
        <p className="hint">
          {isSignup ? (
            <>Already have an account? <a href="/login" className="link">Sign in here</a></>
          ) : (
            <>Need an account? <a href="/signup" className="link">Sign up here</a></>
          )}
        </p>
      </div>

      <div className="card">
        <form className="form" onSubmit={handleSubmit} noValidate>
          {error && <div className="alert">{error}</div>}
          {created && <div className="success">{isSignup ? "Account created! 🎉" : "Welcome back! 🌿"}</div>}

          {isSignup && (
            <label className="field">
              <span className="label">Display Name</span>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Your explorer name"
                required
                className="input"
              />
            </label>
          )}

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
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="input"
            />
            {isSignup && <span className="help">Must be at least 6 characters</span>}
          </label>

          {isSignup && (
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
          )}

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? (isSignup ? "Creating account..." : "Signing in...") : (isSignup ? "Sign up" : "Sign in")}
          </button>
        </form>

        {isSignup && (
          <div className="terms">
            <div className="rule"><span>Terms</span></div>
            <p className="tos">
              By signing up, you agree to our terms of service and privacy policy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* Replace this with your real API call */
function fakeAuthApiSignup(email, password, displayName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // simple mock
      if (email.endsWith("@example.com")) reject(new Error("Email already in use"));
      else {
        // Save user data to localStorage for demo
        const userData = { email, displayName, joinDate: new Date().toLocaleDateString() };
        localStorage.setItem("tg.userStats", JSON.stringify({
          displayName: displayName || "Explorer",
          photosTaken: 0,
          successfulMatches: 0,
          currentStreak: 0,
          bestStreak: 0,
          completedObjectives: [],
          joinDate: userData.joinDate
        }));
        resolve({ ok: true });
      }
    }, 700);
  });
}

function fakeAuthApiLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // simple mock login
      if (email === "test@test.com" && password === "password") {
        resolve({ ok: true });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 700);
  });
}
