import { BookOpen, ChevronDown, GraduationCap, LogOut, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  function logout() {
    signOut();
    setMenuOpen(false);
    navigate("/");
  }
  return (
    <>
      <header className="site-header">
        <div className="nav-wrap">
          <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
            <span className="brand-icon"><GraduationCap size={22} /></span>
            learnspace<span className="brand-dot">.</span>
          </Link>
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav className={menuOpen ? "main-nav open" : "main-nav"}>
            <NavLink to="/courses" onClick={() => setMenuOpen(false)}>Explore courses</NavLink>
            {user && user.role === "student" && <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>My learning</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin dashboard</NavLink>}
            {user ? (
              <div className="nav-account">
                <span className="avatar"><UserRound size={16} /></span>
                <span className="nav-name">{user.name}</span>
                <ChevronDown size={14} />
                <button className="logout-button" onClick={logout}><LogOut size={15} /> Sign out</button>
              </div>
            ) : (
              <div className="nav-actions">
                <Link className="button button-quiet" to="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
                <Link className="button button-primary button-small" to="/register" onClick={() => setMenuOpen(false)}>Get started</Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <div className="footer-inner"><Link className="brand" to="/"><span className="brand-icon"><BookOpen size={19} /></span>learnspace<span className="brand-dot">.</span></Link><span>Build skills for what’s next.</span><span>© {new Date().getFullYear()} Learnspace</span></div>
      </footer>
    </>
  );
}
