import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Logo from "@/components/Logo";
import NextEvent from "@/components/NextEvent";
import MonthlyMenuSection from "@/components/MonthlyMenuSection";
import DontKnowAnyone from "@/components/DontKnowAnyone";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [menu, setMenu] = useState(null);
  const [menuEvents, setMenuEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        // current published menu
        const menus = await base44.entities.MonthlyMenu.filter(
          { is_published: true },
          { sort: "-sort_order", limit: 1 }
        );
        const currentMenu = (menus.items || [])[0] || null;
        if (currentMenu) {
          setMenu(currentMenu);
          const me = await base44.entities.Event.filter(
            { is_published: true, menu: currentMenu.id },
            { sort: "sort_order", limit: 50 }
          );
          setMenuEvents(me.items || []);
        }

        // featured event: admin-selected, else nearest upcoming published
        const featuredList = await base44.entities.Event.filter(
          { is_published: true, is_featured: true, date: { $gte: today } },
          { sort: "date", limit: 1 }
        );
        let next = (featuredList.items || [])[0];
        if (!next) {
          const upcoming = await base44.entities.Event.filter(
            { is_published: true, date: { $gte: today } },
            { sort: "date", limit: 1 }
          );
          next = (upcoming.items || [])[0];
        }
        if (alive) setFeatured(next);
      } catch (e) {
        // ignore
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12 sm:pt-24 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <Logo size={96} />
          <h1 className="font-display text-6xl sm:text-7xl tracking-tightest mt-8 text-[#FAEAE2] leading-none">
            TEA.TALK
          </h1>
          <p className="text-accent-olive italic mt-3 text-lg tracking-wide">
            Sip. Share. Spill.
          </p>
          <p className="mt-7 text-base sm:text-lg text-[#F2CBBD] leading-relaxed max-w-md">
            A place to sip, share, &amp; spill tea on hot topics and make new friends.
          </p>
          {featured && (
            <a
              href={featured.rsvp_link || `#/events/${featured.id}`}
              target={featured.rsvp_link ? "_blank" : undefined}
              rel="noreferrer"
              className="mt-9 inline-flex items-center gap-2 px-8 py-4 text-sm tracking-[0.15em] uppercase transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#F2CBBD", color: "#C0370D" }}
            >
              Join the next Tea.Talk
            </a>
          )}
          <div className="mt-14 text-accent-olive animate-bounce">
            <ArrowDown size={20} />
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-20 text-center text-sm text-muted-foreground">Steeping…</div>
      ) : (
        <>
          <NextEvent event={featured} />
          <MonthlyMenuSection menu={menu} events={menuEvents} />
          <DontKnowAnyone />
          <AboutSection />
        </>
      )}
    </div>
  );
}