import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { formatDateLong, formatDateShort, isPast } from "@/lib/dates";

function EventRow({ ev }) {
  return (
    <Link
      to={`/events/${ev.id}`}
      className="group block py-6 border-b border-olive/20 hover:bg-cream-deep/40 transition-colors -mx-2 px-2"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-xs text-terracotta tracking-wider mb-1">
            {formatDateShort(ev.date)}
          </p>
          <h3 className="font-display text-xl sm:text-2xl tracking-tightest text-[#FAEAE2] leading-snug group-hover:text-terracotta transition-colors">
            {ev.name}
          </h3>
          {ev.topic && (
            <p className="text-accent-olive italic text-sm mt-1">{ev.topic}</p>
          )}
          {ev.location && (
            <p className="text-xs text-muted-foreground mt-2">{ev.location}</p>
          )}
        </div>
        <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-terracotta transition-colors shrink-0" />
      </div>
    </Link>
  );
}

export default function Events() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const page = await base44.entities.Event.filter(
          { is_published: true },
          { sort: "date", limit: 100 }
        );
        const all = page.items || [];
        if (alive) {
          setUpcoming(all.filter((e) => !isPast(e.date)));
          setPast(all.filter((e) => isPast(e.date)).reverse());
        }
      } catch (e) {
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-accent-olive mb-3">Events</p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tightest text-[#FAEAE2]">
          Upcoming
        </h1>

        {loading ? (
          <p className="mt-10 text-sm text-muted-foreground">Steeping…</p>
        ) : (
          <div className="mt-8">
            {upcoming.length === 0 ? (
              <p className="py-10 text-sm text-muted-foreground italic">
                No upcoming events yet. Check back soon.
              </p>
            ) : (
              <div>
                {upcoming.map((ev) => (
                  <EventRow key={ev.id} ev={ev} />
                ))}
              </div>
            )}
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-16">
            <p className="text-xs tracking-[0.3em] uppercase text-accent-olive mb-3">
              Past Events
            </p>
            <div className="mt-4">
              {past.map((ev) => (
                <div key={ev.id} className="py-5 border-b border-olive/15 opacity-70">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground tracking-wider mb-1">
                        {formatDateShort(ev.date)}
                      </p>
                      <h3 className="font-display text-lg tracking-tightest text-[#FAEAE2]">
                        {ev.name}
                      </h3>
                      {ev.topic && (
                        <p className="text-accent-olive italic text-sm mt-0.5">{ev.topic}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}