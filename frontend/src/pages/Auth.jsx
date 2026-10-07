import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../services/api";

export default function Auth({ register = false }) {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  async function submit(event) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const signedIn = await signIn(form, register);
      const destination = location.state?.from?.pathname || (signedIn.role === "admin" ? "/admin" : "/dashboard");
      navigate(destination, { replace: true });
    } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  }
  return (
    <section className="auth-page"><div className="auth-aside"><Link to="/" className="brand"><span className="brand-icon"><GraduationCap size={21} /></span>learnspace<span className="brand-dot">.</span></Link><div className="auth-aside-copy"><div className="eyebrow">A PLACE TO BEGIN</div><h1>Big growth can start with one small yes.</h1><p>Find a little time for something that matters to you.</p><span className="auth-aside-decoration">✳</span></div><Link to="/courses" className="auth-back"><ArrowLeft size={15} /> Browse courses</Link></div><div className="auth-form-wrap"><div className="auth-form"><div className="eyebrow">{register ? "YOUR NEXT CHAPTER" : "WELCOME BACK"}</div><h2>{register ? "Let’s get started." : "Good to see you."}</h2><p>{register ? "Create your account and find your first course." : "Pick up right where your curiosity left off."}</p><form onSubmit={submit} noValidate>{register && <label>Your name<input autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} placeholder="How should we call you?" /></label>}<label>Email address<input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" /></label><label>Password<input type="password" autoComplete={register ? "new-password" : "current-password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} placeholder={register ? "At least 8 characters" : "Your password"} /></label>{error && <div className="notice error" role="alert">{error}</div>}<button className="button button-primary full-button" disabled={busy}>{busy ? "One moment…" : register ? "Create account" : "Log in"} <ArrowRight size={16} /></button></form><div className="auth-switch">{register ? "Already have an account?" : "New around here?"} <Link to={register ? "/login" : "/register"}>{register ? "Log in" : "Create an account"}</Link></div></div></div></section>
  );
}
