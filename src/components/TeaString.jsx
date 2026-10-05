import React, { useEffect, useMemo, useState } from "react";

const ANCHOR = "[data-teabag-anchor]";

// Near-straight vertical line with a faint hand-drawn wobble, from the top of
// the page down to the tea bag.
function buildString(x, endY) {
  let d = `M${x} 0`;
  let seed = 11;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let y = 60; y < endY - 30; y += 60) {
    d += ` L${(x + (rand() - 0.5) * 1.6).toFixed(1)} ${y}`;
  }
  return `${d} L${x} ${endY}`;
}

// White tea-bag string running down the left edge of the home page, behind the
// content, ending at the <TeaBag /> in the footer.
export function TeaString({ containerRef }) {
  const [box, setBox] = useState(null);

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

  const d = useMemo(() => (box ? buildString(box.x, box.y) : null), [box]);

  if (!box || !d) return null;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 top-0"
      width={box.w}
      height={box.h}
      style={{ zIndex: 0 }}
    >
      <path
        d={d}
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

// Hand-drawn tea bag, styled after the logo's white marker strokes.
export function TeaBag({ className = "" }) {
  return (
    <div data-teabag-anchor className={className}>
      <svg viewBox="0 0 120 172" className="w-full h-auto" role="img" aria-label="Tea bag">
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
