import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, MapPin, Clock, Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { formatDateLong } from "@/lib/dates";
import { Image } from "@/components/ui/image";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const ev = await base44.entities.Event.get(id);
        if (alive) setEvent(ev);
      } catch (e) {
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div className="py-32 text-center text-sm text-muted-foreground">Steeping…</div>;
  if (!event) return (
    <div className="py-32 text-center">
      <p className="text-sm text-muted-foreground">Event not found.</p>
      <Link to="/events" className="text-terracotta text-sm mt-4 inline-block">← Back to events</Link>
    </div>
  );

  return (
    <div className="px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-olive mb-8"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {event.image && (
          <div className="w-full aspect-[4/3] overflow-hidden bg-cream-deep mb-8">
            <Image src={event.image} alt={event.name} className="w-full h-full" fittingType="cover" />
          </div>
        )}

        <p className="font-mono text-sm text-terracotta tracking-wider">
          {formatDateLong(event.date)}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tightest mt-2 text-[#FAEAE2] leading-tight">
          {event.name}
        </h1>
        {event.topic && (
          <p className="text-accent-olive italic text-xl mt-2">{event.topic}</p>
        )}

        {event.description && (
          <p className="mt-6 text-[16px] leading-relaxed text-[#F2CBBD]">{event.description}</p>
        )}

        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
          {event.start_time && (
            <p className="flex items-center gap-2">
              <Clock size={15} className="text-accent-olive" />
              {event.start_time}{event.end_time ? ` – ${event.end_time}` : ""}
            </p>
          )}
          {event.location && (
            <p className="flex items-center gap-2">
              <MapPin size={15} className="text-accent-olive" />
              {event.location}
            </p>
          )}
        </div>

        {event.rsvp_link && (
          <a
            href={event.rsvp_link}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 px-8 py-4 text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#F2CBBD", color: "#C0370D" }}
          >
            RSVP <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </div>
  );
}