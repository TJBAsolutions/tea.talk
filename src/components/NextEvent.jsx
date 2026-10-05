import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { formatDateLong } from "@/lib/dates";
import { Image } from "@/components/ui/image";

export default function NextEvent({ event }) {
  if (!event) return null;

  const rsvp = event.rsvp_link;

  return (
    <section className="px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-accent-olive mb-6 text-center">
          Next Tea.Talk
        </p>

        <div className="border border-olive/25 bg-cream-deep/40 overflow-hidden">
          {event.image && (
            <div className="w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden bg-cream-deep">
              <Image
                src={event.image}
                alt={event.name}
                className="w-full h-full"
                fittingType="cover"
              />
            </div>
          )}
          <div className="p-7 sm:p-10">
            <p className="font-mono text-sm text-terracotta tracking-wider">
              {formatDateLong(event.date)}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tightest mt-2 text-[#222]">
              {event.name}
            </h2>
            {event.topic && (
              <p className="text-accent-olive italic mt-1.5 text-lg">{event.topic}</p>
            )}
            {event.description && (
              <p className="mt-4 text-[15px] leading-relaxed text-[#333] max-w-prose">
                {event.description}
              </p>
            )}

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
              {event.start_time && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-accent-olive" />
                  {event.start_time}{event.end_time ? ` – ${event.end_time}` : ""}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-accent-olive" />
                  {event.location}
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {rsvp && (
                <a
                  href={rsvp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-terracotta text-white px-7 py-3.5 text-sm tracking-wide hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#CC3D0B", color: "#fff" }}
                >
                  RSVP <ArrowUpRight size={16} />
                </a>
              )}
              <Link
                to={`/events/${event.id}`}
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm tracking-wide border border-olive/40 text-[#222] hover:bg-cream-deep transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}