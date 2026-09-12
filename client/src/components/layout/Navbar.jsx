import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/privacy", label: "Privacy & Safety" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4">
        <nav className="glass-strong rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold text-ink-900">
            <img
          src="/logo.png"
          alt="MindGuard"
          className="h-9 w-9 object-contain"
        />

            MindGuard
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? "text-violet-700 bg-violet-50" : "text-ink-500 hover:text-ink-800 hover:bg-violet-50/60"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Button size="sm" onClick={() => navigate("/dashboard")}>Go to dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Log in</Button>
                <Button size="sm" onClick={() => navigate("/register")}>Get started</Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-ink-700 focus-ring rounded-lg" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden glass-strong rounded-2xl mt-2 p-4 flex flex-col gap-1 animate-fade-up">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 hover:bg-violet-50" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-violet-100 my-2" />
            {isAuthenticated ? (
              <Button size="sm" onClick={() => { setOpen(false); navigate("/dashboard"); }}>Go to dashboard</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setOpen(false); navigate("/login"); }}>Log in</Button>
                <Button size="sm" className="flex-1" onClick={() => { setOpen(false); navigate("/register"); }}>Get started</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
