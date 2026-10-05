import React, { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Logo from "@/components/Logo";
import NextEvent from "@/components/NextEvent";
import MonthlyMenuSection from "@/components/MonthlyMenuSection";
import DontKnowAnyone from "@/components/DontKnowAnyone";
import AboutSection from "@/components/AboutSection";
import { HeroPolaroids, HeroSlideshow, MenuSidePolaroids, CommunityWall } from "@/components/Polaroids";

const RSVP_URL = "https://partiful.com/e/3b9V11HtVaN19nzzGIsX";

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
      <section className="relative px-6 pt-16 pb-12 sm:pt-24 text-center">
        <HeroSlideshow />
        <HeroPolaroids />
        <div className="relative max-w-2xl mx-auto flex flex-col items-center max-lg:[text-shadow:0_1px_10px_rgba(40,10,0,0.75)] max-lg:[&_img]:drop-shadow-[0_2px_10px_rgba(40,10,0,0.6)]">
          <h1>
            <span className="sr-only">Tea.Talk</span>
            <Logo className="h-44 sm:h-56 mx-auto" />
          </h1>
          <p className="text-accent-olive italic mt-3 text-lg tracking-wide">
            Sip. Share. Spill.
          </p>
          <div className="mt-5 text-sm sm:text-base text-[#FAEAE2] leading-relaxed">
            <p className="tracking-[0.15em] uppercase text-xs text-accent-olive mb-1.5">Sundays · 1:30–3:30 PM</p>
            <a
              href="https://maps.google.com/?q=9800+Town+Park+Dr,+Houston,+TX"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              9800 Town Park Dr, Houston · Room 204
            </a>
          </div>
          <p className="mt-7 text-base sm:text-lg text-[#F2CBBD] leading-relaxed max-w-md">
            A place to sip, share, &amp; spill tea on hot topics and make new friends.
          </p>
          <a
            href={RSVP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex items-center gap-2 px-8 py-4 text-sm tracking-[0.15em] uppercase transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F2CBBD", color: "#C0370D" }}
          >
            Join the next Tea.Talk
          </a>
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
          {menu && (
            <div className="relative">
              <MenuSidePolaroids />
              <MonthlyMenuSection menu={menu} events={menuEvents} />
            </div>
          )}
          <DontKnowAnyone />
          <CommunityWall />
          <AboutSection />
        </>
      )}
    </div>
  );
}