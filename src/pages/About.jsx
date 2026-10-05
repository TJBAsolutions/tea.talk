import React from "react";
import AboutSection from "@/components/AboutSection";
import DontKnowAnyone from "@/components/DontKnowAnyone";

export default function About() {
  return (
    <div className="px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-accent-olive mb-3">About</p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tightest text-[#222]">
          Tea.Talk
        </h1>
        <p className="mt-6 text-lg text-[#333] leading-relaxed">
          A community for young adults in Houston who want to meet new people, have meaningful
          conversations, and build genuine friendships.
        </p>
      </div>
      <div className="mt-6">
        <AboutSection />
        <DontKnowAnyone />
      </div>
    </div>
  );
}