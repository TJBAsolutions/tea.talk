import React from "react";
import { Instagram, Music2 } from "lucide-react";
import { DEFAULT_SOCIAL_LINKS } from "@/lib/social";

const photo = (name) => `/community/${name}.jpg`;

// Instant-film photo with a strip of tape, tilted like it was stuck on by hand.
export function Polaroid({ name, caption, rotate = 0, tape = -4, className = "", style }) {
  return (
    <figure
      className={`group ${/\babsolute\b/.test(className) ? "" : "relative"} bg-[#FEFEFE] p-2 pb-1 sm:p-2.5 sm:pb-1.5 shadow-[0_10px_22px_-6px_rgba(50,12,0,0.55)] transition-transform duration-300 hover:z-20 hover:scale-[1.04] ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 bg-[#F2CBBD]/80 shadow-sm"
        style={{ transform: `translateX(-50%) rotate(${tape}deg)` }}
      />
      <img
        src={photo(name)}
        alt=""
        width={600}
        height={800}
        loading="lazy"
        draggable={false}
        className="block w-full aspect-[3/4] object-cover select-none"
      />
      <figcaption className="font-hand text-[#2a1a14] text-center text-base sm:text-lg leading-none py-2 min-h-[1.75rem]">
        {caption}
      </figcaption>
    </figure>
  );
}

// Hero: a fanned row of photos under the tagline.
export function HeroPolaroids() {
  return (
    <div aria-hidden className="flex justify-center mt-8 mb-2 -space-x-6 sm:-space-x-4">
      <Polaroid name="communi-tea" caption="communi-tea" rotate={-9} tape={6} className="w-28 sm:w-36 mt-3" />
      <Polaroid name="friends" caption="new friends" rotate={-2} tape={-6} className="w-28 sm:w-36 z-10" />
      <Polaroid name="peace" caption="good tea" rotate={8} tape={4} className="w-28 sm:w-36 mt-4" />
      <Polaroid name="mic-pass" caption="pass the mic" rotate={-5} tape={-5} className="hidden sm:block sm:w-36 mt-1" />
    </div>
  );
}

// Menu: a pair of photos tucked beside the menu card on wide screens.
export function MenuSidePolaroids() {
  return (
    <div aria-hidden className="hidden lg:block pointer-events-none">
      <Polaroid name="the-steep" caption="the steep" rotate={-5} tape={5}
        className="pointer-events-auto absolute left-[4%] xl:left-[9%] top-24 w-40 xl:w-48" />
      <Polaroid name="hot-takes" caption="hot takes" rotate={6} tape={-7}
        className="pointer-events-auto absolute left-[7%] xl:left-[12%] top-[26rem] w-36 xl:w-44" />
      <Polaroid name="stir-2" caption="table talk" rotate={5} tape={-4}
        className="pointer-events-auto absolute right-[4%] xl:right-[9%] top-32 w-40 xl:w-48" />
      <Polaroid name="takeaways" caption="takeaways" rotate={-7} tape={8}
        className="pointer-events-auto absolute right-[7%] xl:right-[12%] top-[27rem] w-36 xl:w-44" />
    </div>
  );
}

const WALL = [
  { name: "full-room", caption: "sunday tea", rotate: -4 },
  { name: "listening", caption: "all ears", rotate: 3 },
  { name: "series", caption: "dating & relationships", rotate: -2 },
  { name: "new-faces", caption: "say hi!", rotate: 4 },
];

// A loose wall of photos showing the community.
export function CommunityWall() {
  return (
    <section className="px-4 sm:px-6 py-16 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent-olive mb-4">Communi-tea</p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tightest text-[#FAEAE2]">
            Free tea, free snacks, free conversations.
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {WALL.map((p, i) => (
            <Polaroid
              key={p.name}
              {...p}
              tape={(i % 2 ? 1 : -1) * (3 + (i % 4) * 2)}
              className={`w-[44%] lg:w-[22%] ${i % 2 ? "mt-6" : ""}`}
            />
          ))}
        </div>
        <div className="mt-14 text-center">
          <p className="font-hand text-2xl text-[#FAEAE2]">see more of the communi-tea</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {DEFAULT_SOCIAL_LINKS.map((l) => {
              const Icon = l.platform === "Instagram" ? Instagram : Music2;
              return (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm tracking-wide border border-olive text-[#FAEAE2] hover:bg-cream-deep transition-colors"
                >
                  <Icon size={16} /> {l.platform} {l.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
