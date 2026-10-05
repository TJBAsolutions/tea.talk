import React, { useEffect, useMemo, useRef, useState } from "react";

const ANCHOR = "[data-teabag-anchor]";

// Small seeded RNG so the hand-drawn wobble is identical on every render.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Wavy line from the top-right of the page down to (endX, endY), with a slight
// hand-drawn jitter. Returns the SVG path plus [y, distance] samples so scroll
// position can be mapped to how much of the line is drawn.
function buildSquiggle(w, endX, endY) {
  const rand = rng(7);
  const center = w / 2;
  const amp = w * (w < 640 ? 0.36 : 0.3);
  const period = Math.min(900, Math.max(520, w * 0.85));
  const startX = w * 0.8;
  const phase = Math.asin(Math.max(-1, Math.min(1, (startX - center) / amp)));

  const pts = [];
  for (let y = 0; y < endY; y += 26) {
    const a = amp * (0.85 + 0.15 * Math.sin(y / 1300));
    let x = center + a * Math.sin((2 * Math.PI * y) / period + phase);
    x += (endX - x) * smooth(endY - 520, endY - 70, y);
    const settle = 1 - smooth(endY - 160, endY - 40, y);
    pts.push([x + (rand() - 0.5) * 2.4 * settle, y + (y ? (rand() - 0.5) * 1.6 * settle : 0)]);
  }
  pts.push([endX, endY]);

  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }

  const samples = [[pts[0][1], 0]];
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    samples.push([pts[i][1], len]);
  }
  return { d, samples, polyLength: len };
}

function lengthAtY(samples, y) {
  if (y <= samples[0][0]) return 0;
  for (let i = 1; i < samples.length; i++) {
    if (samples[i][0] >= y) {
      const [y0, l0] = samples[i - 1];
      const [y1, l1] = samples[i];
      return l0 + ((l1 - l0) * (y - y0)) / Math.max(1, y1 - y0);
    }
  }
  return samples[samples.length - 1][1];
}

// White tea-bag string that wiggles behind the home page and draws itself on
// scroll, ending at the <TeaBag /> in the footer.
export function TeaString({ containerRef }) {
  const [box, setBox] = useState(null);
  const pathRef = useRef(null);

  // Passive effect: the parent's ref is only attached after child layout effects run.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const anchor = container.querySelector(ANCHOR);
      if (!anchor) return;
      const c = container.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      const next = {
        w: Math.round(c.width),
        h: Math.round(c.height),
        x: Math.round(a.left - c.left + a.width / 2),
        y: Math.round(a.top - c.top),
      };
      setBox((prev) =>
        prev && prev.w === next.w && prev.h === next.h && prev.x === next.x && prev.y === next.y ? prev : next
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [containerRef]);

  const squiggle = useMemo(() => (box ? buildSquiggle(box.w, box.x, box.y) : null), [box]);

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;
    if (!path || !container || !squiggle) return;
    const anchor = container.querySelector(ANCHOR);
    const total = path.getTotalLength();
    const scale = total / squiggle.polyLength;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    path.style.strokeDasharray = `${total}`;
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = container.getBoundingClientRect().top + window.scrollY;
      const doc = document.documentElement;
      const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 4;
      const reach = window.scrollY + window.innerHeight * 0.72 - top;
      const done = reduced || atBottom || reach >= squiggle.samples[squiggle.samples.length - 1][0];
      const drawn = done ? total : lengthAtY(squiggle.samples, reach) * scale;
      path.style.strokeDashoffset = `${total - drawn}`;
      if (anchor) anchor.dataset.revealed = done ? "true" : "false";
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [squiggle, containerRef]);

  if (!box || !squiggle) return null;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 top-0"
      width={box.w}
      height={box.h}
      style={{ zIndex: 0, overflow: "visible" }}
    >
      <path
        ref={pathRef}
        d={squiggle.d}
        fill="none"
        stroke="#FEFEFE"
        strokeWidth={box.w < 640 ? 2.5 : 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

// Hand-drawn tea bag, styled after the logo's white marker strokes. Hidden until
// the string above finishes drawing (TeaString sets data-revealed on the anchor).
export function TeaBag({ className = "" }) {
  return (
    <div
      data-teabag-anchor
      data-revealed="false"
      className={`group w-32 sm:w-40 ${className}`}
    >
      <svg
        viewBox="0 0 120 172"
        className="w-full h-auto opacity-0 -translate-y-3 transition-all duration-700 ease-out group-data-[revealed=true]:opacity-100 group-data-[revealed=true]:translate-y-0 motion-safe:group-data-[revealed=true]:animate-[teabag-swing_2.8s_ease-in-out_0.7s_infinite]"
        style={{ transformOrigin: "60px 0px" }}
        role="img"
        aria-label="Tea bag"
      >
        <defs>
          <filter id="teabag-rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="2.6" />
          </filter>
        </defs>
        <g
          filter="url(#teabag-rough)"
          fill="none"
          stroke="#FEFEFE"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* string into the staple */}
          <path d="M60 0 C 61 12, 58 24, 60 42" strokeWidth="3" />
          {/* staple */}
          <path d="M54 43 L66 42.5 L66.5 50 L54.5 50.5 Z" strokeWidth="2.6" />
          {/* folded top flap */}
          <path d="M27 52 C 45 49, 76 49, 94 51 L 90 69 C 72 67, 48 67, 31 70 Z" fill="rgba(250,234,226,0.14)" />
          {/* bag body */}
          <path
            d="M31 70 C 25 98, 26 132, 33 156 C 52 162, 74 161, 89 155 C 96 128, 95 96, 90 69"
            fill="rgba(250,234,226,0.12)"
          />
          {/* stitched hem */}
          <path d="M38 148 l6 1 M50 150 l6 0.5 M62 150.5 l6 -0.3 M74 150 l6 -0.8" strokeWidth="2.2" />
          {/* loose tea leaves */}
          <path d="M42 84 q4 -4 8 0 M68 80 q3 4 7 1 M78 96 q3 3 6 0 M40 134 q3 3 7 0 M74 136 q4 -4 8 -1 M57 139 q3 3 6 0" strokeWidth="2.6" />
        </g>
        <text
          x="61"
          y="122"
          textAnchor="middle"
          fill="#FEFEFE"
          fontSize="30"
          style={{ fontFamily: '"Gochi Hand", cursive' }}
          transform="rotate(-6 61 112)"
        >
          tea
        </text>
      </svg>
    </div>
  );
}
