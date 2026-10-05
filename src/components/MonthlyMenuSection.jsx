import React from "react";
import { Link } from "react-router-dom";
import { formatDateShort } from "@/lib/dates";

const INK = "#C0370D";

// Slightly uneven sheet edge.
const PAPER_EDGE =
  "polygon(0.0% 0.2%, 10.0% 0.1%, 20.0% 0.4%, 30.0% 0.1%, 40.0% 0.1%, 50.0% 0.4%, 60.0% 0.8%, 70.0% 0.7%, 80.0% 0.7%, 90.0% 0.2%, 100.0% 0.5%, 99.8% 5.0%, 99.8% 14.0%, 99.9% 23.0%, 99.8% 32.0%, 99.2% 41.0%, 99.3% 50.0%, 99.3% 59.0%, 99.3% 68.0%, 99.8% 77.0%, 99.7% 86.0%, 99.4% 95.0%, 100.0% 99.3%, 90.0% 99.2%, 80.0% 99.2%, 70.0% 99.9%, 60.0% 99.5%, 50.0% 99.4%, 40.0% 99.5%, 30.0% 99.8%, 20.0% 99.6%, 10.0% 99.9%, 0.0% 99.2%, 0.8% 95.0%, 0.5% 86.0%, 0.3% 77.0%, 0.8% 68.0%, 0.5% 59.0%, 0.8% 50.0%, 0.8% 41.0%, 0.5% 32.0%, 0.4% 23.0%, 0.5% 14.0%, 0.4% 5.0%)";

// Printed-menu card: off-white paper with red ink, modeled on the monthly menu flyer.
export default function MonthlyMenuSection({ menu, events }) {
  if (!menu) return null;
  const rows = (events || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <section className="px-4 sm:px-6 py-16">
      <div
        className="max-w-xl mx-auto -rotate-[0.8deg]"
        style={{ filter: "drop-shadow(0 16px 22px rgba(60,15,0,0.45)) drop-shadow(0 2px 3px rgba(60,15,0,0.3))" }}
      >
      <div
        className="relative px-6 sm:px-14 pt-10 pb-12 sm:pt-12 sm:pb-14 overflow-hidden"
        style={{
          backgroundColor: "#FEFEFE",
          backgroundImage:
            "radial-gradient(120% 80% at 15% 0%, rgba(250,234,226,0.9), transparent 60%), radial-gradient(90% 70% at 100% 100%, rgba(242,203,189,0.35), transparent 70%)",
          clipPath: PAPER_EDGE,
          color: INK,
        }}
      >
        {/* Crumpled-paper creases: lit noise multiplied over the sheet */}
        <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply">
          <filter id="menu-crumple" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.005 0.0075" numOctaves="5" seed="11" result="noise" />
            <feDiffuseLighting in="noise" surfaceScale="5" diffuseConstant="1" lightingColor="#ffffff">
              <feDistantLight azimuth="225" elevation="50" />
            </feDiffuseLighting>
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.3" intercept="-0.02" />
              <feFuncG type="linear" slope="1.3" intercept="-0.02" />
              <feFuncB type="linear" slope="1.3" intercept="-0.02" />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter="url(#menu-crumple)" />
        </svg>

        <div className="relative">
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
      </div>
      </div>
    </section>
  );
}
