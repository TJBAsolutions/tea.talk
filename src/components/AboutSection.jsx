import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-accent-olive mb-5 text-center">
          About
        </p>
        <p className="font-display text-2xl sm:text-3xl tracking-tightest leading-snug text-[#FAEAE2] text-center">
          Tea.Talk is a community for young adults in Houston who want to meet new people,
          have meaningful conversations, and build genuine friendships.
        </p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-center">
          {[
            { t: "Tea Talks", d: "Real conversations around relatable topics." },
            { t: "Community", d: "A place to meet people and build genuine friendships." },
            { t: "Activities", d: "Outings, games, and experiences outside the normal Tea.Talk setting." },
          ].map((x) => (
            <div key={x.t}>
              <h3 className="font-display text-xl tracking-tightest text-terracotta">{x.t}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 border border-olive text-[#FAEAE2] px-7 py-3.5 text-sm tracking-wide hover:bg-cream-deep transition-colors"
          >
            Come to an event <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}