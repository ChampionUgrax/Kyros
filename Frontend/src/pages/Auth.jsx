
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  Building2,
  BrainCircuit,
  Target,
  ChartNoAxesCombined,
  Heart,
  Mail,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { ROLES, roleHome } from "../config/roles.js";
import { useAuth } from "../services/AuthContext.jsx";
import "./Auth.css";

const roleIcons = {
  student: GraduationCap,
  teacher: Users,
  institute: Building2,
  coaching: Building2,
};

export default function Auth() {
  const { user, authenticate } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES[0].value,
  });

  if (user) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  const isSignup = mode === "signup";

  const updateField = (key) => (event) => {
    setForm((previous) => ({
      ...previous,
      [key]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setErr("");
    setBusy(true);

    try {
      const payload = isSignup
        ? form
        : {
            email: form.email,
            password: form.password,
            role: form.role,
          };

      const authenticatedUser = await authenticate(mode, payload);
      navigate(roleHome(authenticatedUser.role));
    } catch (error) {
      setErr(error.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setErr("");
    setShowPassword(false);
  };

  return (
    <main className="kyros-auth-page">
      {/* LEFT BRAND PANEL */}
      <section className="auth-visual">
        <div className="auth-visual-glow" />

        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">K</span>
          <span>KYROS</span>
        </Link>

        <div className="auth-visual-content">
          <div className="auth-eyebrow">
            <Sparkles size={15} />
            YOUR LEARNING JOURNEY
          </div>

          <h1>
            Learn what you
            <br />
            actually <span>don't know.</span>
          </h1>

          <p className="auth-tagline">
            Understand yourself better.
            <br />
            Learn smarter.
          </p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <div className="benefit-icon">
                <BrainCircuit size={23} />
              </div>
              <div>
                <strong>AI-powered insights</strong>
                <p>Discover your knowledge gaps and get personalized guidance.</p>
              </div>
            </div>

            <div className="auth-benefit">
              <div className="benefit-icon">
                <Target size={23} />
              </div>
              <div>
                <strong>Smarter focus</strong>
                <p>Spend time on what matters most, not what you already know.</p>
              </div>
            </div>

            <div className="auth-benefit">
              <div className="benefit-icon">
                <ChartNoAxesCombined size={23} />
              </div>
              <div>
                <strong>Track your growth</strong>
                <p>See your progress and build better study habits.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-bottom-message">
          <Heart size={19} />
          <span>Better learning. Brighter future.</span>
        </div>
      </section>

      {/* RIGHT AUTH PANEL */}
      <section className="auth-form-side">
        <div className="auth-top-links">
          <Link to="/extension">Extension</Link>
          <Link to="/">Home</Link>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <div className="auth-card-sparkle">
              <Sparkles size={19} />
            </div>

            <h2>{isSignup ? "Create your account" : "Welcome back!"}</h2>

            <p>
              {isSignup
                ? "Start your personalized learning journey with KYROS."
                : "Sign in to continue your learning journey."}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={!isSignup ? "active" : ""}
              onClick={() => changeMode("login")}
            >
              Log in
            </button>

            <button
              type="button"
              className={isSignup ? "active" : ""}
              onClick={() => changeMode("signup")}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={submit}>
            <label className="auth-label">I am a</label>

            <div className="auth-role-options">
              {ROLES.map((role) => {
                const Icon =
                  roleIcons[role.value] || GraduationCap;

                return (
                  <button
                    key={role.value}
                    type="button"
                    className={`auth-role ${
                      form.role === role.value ? "selected" : ""
                    }`}
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        role: role.value,
                      }))
                    }
                  >
                    <Icon size={21} />
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>

            {isSignup && (
              <div className="auth-field">
                <label htmlFor="auth-name">Full name</label>
                <div className="auth-input-wrap">
                  <Users size={18} />
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={updateField("name")}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="auth-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="auth-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField("email")}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-password-heading">
                <label htmlFor="auth-password">Password</label>
                <button
                  type="button"
                  className="auth-forgot"
                  onClick={() =>
                    setErr("Password recovery is not connected yet.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="auth-input-wrap">
                <LockKeyhole size={18} />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={updateField("password")}
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {err && (
              <p className="auth-error" role="alert">
                {err}
              </p>
            )}

            <button className="auth-submit" type="submit" disabled={busy}>
              {busy
                ? "Please wait..."
                : isSignup
                  ? "Create account"
                  : "Log in"}
              {!busy && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <small>YOUR LEARNING JOURNEY STARTS HERE</small>
            <span />
          </div>

          <p className="auth-switch">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => changeMode(isSignup ? "login" : "signup")}
            >
              {isSignup ? "Log in" : "Create one"}
            </button>
          </p>

          <p className="auth-terms">
            By continuing, you agree to KYROS's Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
