import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Instagram, Menu, Music2, X } from "lucide-react";
import Logo from "./Logo";
import SocialLinksFooter from "./SocialLinksFooter";
import { TeaString } from "./TeaString";
import { DEFAULT_SOCIAL_LINKS } from "@/lib/social";

export default function SiteLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const layoutRef = useRef(null);
  const isHome = location.pathname === "/";
  const [overHero, setOverHero] = useState(isHome);

  // On the home page the header sits see-through over the hero photos (below lg),
  // then turns solid once the hero has scrolled away.
  useEffect(() => {
    if (!isHome) {
      setOverHero(false);
      return;
    }
    const update = () => {
      const hero = document.querySelector("[data-hero]");
      const header = document.querySelector("header");
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
      setOverHero(hero ? hero.getBoundingClientRect().bottom > headerBottom : false);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHome]);
  const clearHeader = overHero && !open;

  const nav = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
  ];

  return (
    <div ref={layoutRef} className="relative min-h-screen flex flex-col" style={{ zIndex: 2 }}>
      {isHome && <TeaString key={location.key} containerRef={layoutRef} />}
      <header
        className={`sticky top-0 z-30 border-b transition-colors duration-300 lg:bg-cream/85 lg:backdrop-blur-sm lg:border-olive/15 ${
          clearHeader ? "bg-transparent border-transparent" : "bg-cream border-olive/15"
        }`}
      >
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
            <Logo height={44} />
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
              <div className="flex items-center gap-5 pt-1">
                {DEFAULT_SOCIAL_LINKS.map((l) => {
                  const Icon = l.platform === "Instagram" ? Instagram : Music2;
                  return (
                    <a
                      key={l.id}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Tea.Talk on ${l.platform}`}
                      className="p-1 -m-1 text-[#FAEAE2] hover:text-accent-olive transition-colors"
                    >
                      <Icon size={22} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-[1] flex-1">
        <Outlet />
      </main>

      <SocialLinksFooter showTeaBag={isHome} />
    </div>
  );
}