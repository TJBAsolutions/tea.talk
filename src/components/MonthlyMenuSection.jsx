import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatDateShort } from "@/lib/dates";

export default function MonthlyMenuSection({ menu, events }) {
  if (!menu) return null;
  const rows = (events || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <section className="px-6 py-16 bg-cream-deep/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl tracking-tightest text-[#222]">
            {menu.month_label}
          </h2>
          {menu.theme && (
            <p className="text-accent-olive italic mt-2 text-lg">{menu.theme}</p>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-x-6 sm:gap-x-10">
          <div className="text-[10px] tracking-[0.3em] uppercase text-accent-olive pb-3 border-b border-olive/40">
            Tea Topic
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-accent-olive pb-3 border-b border-olive/40 text-right">
            Date
          </div>

          {rows.length === 0 && (
            <div className="col-span-2 py-8 text-center text-sm text-muted-foreground italic">
              The menu is being steeped. Check back soon.
            </div>
          )}

          {rows.map((ev) => (
            <React.Fragment key={ev.id}>
              <Link
                to={`/events/${ev.id}`}
                className="group py-5 border-b border-olive/20 hover:bg-cream/60 transition-colors -mx-2 px-2"
              >
                <p className="font-display text-lg sm:text-xl text-[#222] leading-snug group-hover:text-terracotta transition-colors">
                  {ev.name}
                </p>
                {ev.topic && (
                  <p className="text-sm text-muted-foreground mt-1 pl-3 italic">
                    {ev.topic}
                  </p>
                )}
              </Link>
              <div className="py-5 border-b border-olive/20 flex items-start justify-end gap-2">
                <span className="font-mono text-sm text-[#222] tracking-wider">
                  {formatDateShort(ev.date)}
                </span>
                {ev.rsvp_link && (
                  <a
                    href={ev.rsvp_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-terracotta hover:opacity-70"
                    aria-label={`RSVP to ${ev.name}`}
                  >
                    <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}