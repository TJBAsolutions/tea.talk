import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Instagram, Music2, Mail, Link as LinkIcon } from "lucide-react";
import Logo from "./Logo";

function iconFor(platform) {
  if (platform === "Instagram") return Instagram;
  if (platform === "TikTok") return Music2;
  if (platform === "Email") return Mail;
  return LinkIcon;
}

export default function SocialLinksFooter() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    let alive = true;
    base44.entities.SocialLink.filter({ is_active: true }, { sort: "display_order", limit: 20 })
      .then((page) => {
        if (alive) setLinks(page.items || []);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <footer className="border-t border-olive/20 mt-20">
      <div className="max-w-3xl mx-auto px-6 py-14 flex flex-col items-center text-center">
        <Logo size={52} />
        <p className="font-display text-2xl tracking-tightest mt-5 text-[#222]">tea.talk</p>
        <p className="text-sm text-accent-olive italic mt-1">Sip. Share. Spill.</p>

        {links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-7">
            {links.map((l) => {
              const Icon = iconFor(l.platform);
              const href = l.platform === "Email" ? `mailto:${l.url}` : l.url;
              return (
                <a
                  key={l.id}
                  href={href}
                  target={l.platform === "Email" ? undefined : "_blank"}
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-[#222] hover:text-terracotta transition-colors"
                >
                  <Icon size={16} />
                  <span className="tracking-wide">{l.label || l.platform}</span>
                </a>
              );
            })}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-8 tracking-wide">
          Houston, TX · A community for young adults
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          © {new Date().getFullYear()} Tea.Talk
        </p>
      </div>
    </footer>
  );
}