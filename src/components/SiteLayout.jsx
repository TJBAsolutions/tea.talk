import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import SocialLinksFooter from "./SocialLinksFooter";

export default function SiteLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const nav = [
    { label: "Home", to: "/" },
    { label: "Events", to: "/events" },
    { label: "About", to: "/about" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col" style={{ zIndex: 2 }}>
      <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur-sm border-b border-olive/15">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <Logo size={34} />
            <span className="font-display text-lg tracking-tightest text-[#FAEAE2]">tea.talk</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-7 text-sm">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`tracking-wide transition-colors ${
                  location.pathname === n.to ? "text-terracotta" : "text-[#FAEAE2] hover:text-accent-olive"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <Link to="/admin" className="text-xs text-muted-foreground hover:text-accent-olive tracking-widest uppercase">
              Admin
            </Link>
          </nav>
          <button className="sm:hidden p-2 -mr-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="sm:hidden border-t border-olive/15 bg-cream">
            <div className="px-6 py-4 flex flex-col gap-4 text-base">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={location.pathname === n.to ? "text-terracotta" : "text-[#FAEAE2]"}
                >
                  {n.label}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setOpen(false)} className="text-xs text-muted-foreground tracking-widest uppercase pt-2 border-t border-olive/15">
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <SocialLinksFooter />
    </div>
  );
}