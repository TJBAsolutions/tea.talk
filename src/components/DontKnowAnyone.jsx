import React from "react";

export default function DontKnowAnyone() {
  return (
    <section className="px-6 py-20 text-center">
      <div className="max-w-xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-accent-olive mb-5">
          Don't know anyone?
        </p>
        <p className="font-display text-3xl sm:text-4xl tracking-tightest text-[#222]">
          That's kind of the point.
        </p>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
          Come by yourself, bring a friend, or meet someone new.
        </p>
      </div>
    </section>
  );
}