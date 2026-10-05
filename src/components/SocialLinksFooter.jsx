import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Instagram, Music2, Mail, Link as LinkIcon } from "lucide-react";
import Logo from "./Logo";
import { TeaBag } from "./TeaString";
import { DEFAULT_SOCIAL_LINKS } from "@/lib/social";

function iconFor(platform) {
  if (platform === "Instagram") return Instagram;
  if (platform === "TikTok") return Music2;
  if (platform === "Email") return Mail;
  return LinkIcon;
}

export default function SocialLinksFooter({ showTeaBag = false }) {
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

  const shown = [
    ...DEFAULT_SOCIAL_LINKS.filter((d) => !links.some((l) => l.platform === d.platform)),
    ...links,
  ];

  return (
    <footer className="relative z-[1] border-t border-olive/20 mt-20">
      {showTeaBag && <TeaBag className="absolute top-6 left-2 w-16 sm:left-5 sm:w-24 lg:w-28" />}
      <div className="max-w-3xl mx-auto px-6 py-14 flex flex-col items-center text-center">
        <Logo height={88} />
        <p className="text-sm text-accent-olive italic mt-3">Sip. Share. Spill.</p>

        {shown.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-7">
            {shown.map((l) => {
              const Icon = iconFor(l.platform);
              const href = l.platform === "Email" ? `mailto:${l.url}` : l.url;
              return (
                <a
                  key={l.id}
                  href={href}
                  target={l.platform === "Email" ? undefined : "_blank"}
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-[#FAEAE2] hover:text-terracotta transition-colors"
                >
                  <Icon size={16} />
                  <span className="tracking-wide">{l.label || l.platform}</span>
                </a>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-sm text-[#FAEAE2] leading-relaxed">
          <p className="text-xs tracking-[0.15em] uppercase text-accent-olive mb-1">Sundays · 1:30–3:30 PM</p>
          <a
            href="https://maps.google.com/?q=9800+Town+Park+Dr,+Houston,+TX"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline"
          >
            9800 Town Park Dr, Houston · Room 204
          </a>
        </div>
        <p className="text-xs text-muted-foreground mt-6 tracking-wide">
          Houston, TX · A community for young adults
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          © {new Date().getFullYear()} Tea.Talk
        </p>
      </div>
    </footer>
  );
}