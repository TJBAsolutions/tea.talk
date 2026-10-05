import React, { useEffect, useMemo, useState } from "react";

const ANCHOR = "[data-teabag-anchor]";

// Mostly-vertical line with the irregular sway, kinks and jitter of a line drawn
// by hand, from the top of the page down to the tea bag. `seed` varies the wobble
// so a second, fainter pass can sit slightly off the first like a marker re-stroke.
function buildString(x, endY, seed = 11) {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const phase = rand() * 6;
  const pts = [[x, 0]];
  for (let y = 36; y < endY - 40; y += 36) {
    const settle = Math.min(1, (endY - y) / 240, y / 120);
    const sway = 5 * Math.sin(y / 210 + phase) + 2.5 * Math.sin(y / 63 + phase * 2);
    const kink = rand() < 0.08 ? (rand() - 0.5) * 7 : 0;
    pts.push([x + (sway + kink + (rand() - 0.5) * 2.2) * settle, y]);
  }
  pts.push([x, endY]);

  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
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

  const paths = useMemo(
    () => (box ? [buildString(box.x, box.y), buildString(box.x + 1, box.y, 29)] : null),
    [box]
  );

  if (!box || !paths) return null;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 top-0"
      width={box.w}
      height={box.h}
      style={{ zIndex: 0 }}
    >
      <path
        d={paths[0]}
        fill="none"
        stroke="#FEFEFE"
        strokeWidth={box.w < 640 ? 2.5 : 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path d={paths[1]} fill="none" stroke="#FEFEFE" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
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
