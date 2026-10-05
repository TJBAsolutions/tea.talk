import React from "react";
import { Link } from "react-router-dom";
import { formatDateShort } from "@/lib/dates";

const INK = "#C0370D";

// Printed-menu card: off-white paper with red ink, modeled on the monthly menu flyer.
export default function MonthlyMenuSection({ menu, events }) {
  if (!menu) return null;
  const rows = (events || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <section className="px-4 sm:px-6 py-16">
      <div
        className="relative max-w-xl mx-auto px-6 sm:px-14 pt-10 pb-12 sm:pt-12 sm:pb-14 shadow-[0_18px_40px_-12px_rgba(60,15,0,0.55)]"
        style={{
          backgroundColor: "#FEFEFE",
          backgroundImage:
            "radial-gradient(120% 80% at 15% 0%, rgba(250,234,226,0.9), transparent 60%), radial-gradient(90% 70% at 100% 100%, rgba(242,203,189,0.35), transparent 70%)",
          color: INK,
        }}
      >
        <div className="text-center">
          <div
            role="img"
            aria-label="Tea.Talk"
            className="mx-auto h-20 sm:h-24 aspect-[919/696]"
            style={{
              backgroundColor: INK,
              WebkitMaskImage: "url(/tea-talk-logo.png)",
              maskImage: "url(/tea-talk-logo.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          <h2 className="mt-4 text-xl sm:text-2xl font-medium text-[#2a1a14]">
            {menu.month_label}
          </h2>
          {menu.theme && (
            <p className="italic text-lg sm:text-xl mt-0.5 tracking-wide">{menu.theme}</p>
          )}
        </div>

        <div className="mt-10 flex items-end justify-between pb-2.5 border-b-2" style={{ borderColor: INK }}>
          <span className="text-lg sm:text-xl tracking-[0.12em] uppercase text-[#2a1a14]">Tea Topic</span>
          <span className="text-lg sm:text-xl tracking-[0.12em] uppercase text-[#2a1a14]">Date</span>
        </div>

        {rows.length === 0 && (
          <p className="py-10 text-center text-sm italic opacity-80">
            The menu is being steeped. Check back soon.
          </p>
        )}

        <ul className="mt-2">
          {rows.map((ev) => (
            <li key={ev.id}>
              <Link
                to={`/events/${ev.id}`}
                className="group grid grid-cols-[1fr_auto] gap-x-6 py-6 sm:py-7"
              >
                <div>
                  <p className="text-base sm:text-lg tracking-[0.12em] uppercase text-[#2a1a14] group-hover:text-[#C0370D] transition-colors">
                    {ev.name}
                  </p>
                  {ev.topic && (
                    <p className="text-sm sm:text-[15px] mt-1.5 leading-relaxed tracking-wide text-[#3d2a22] max-w-sm">
                      {ev.topic}
                    </p>
                  )}
                </div>
                <span className="text-base sm:text-lg tracking-wider tabular-nums text-[#2a1a14]">
                  {formatDateShort(ev.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
