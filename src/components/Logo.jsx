import React from "react";

const LOGO_URL = "/tea-talk-logo.png";

export default function Logo({ height, className = "" }) {
  return (
    <img
      src={LOGO_URL}
      alt="Tea.Talk logo"
      className={`w-auto select-none ${className}`}
      style={height ? { height } : undefined}
      draggable={false}
    />
  );
}
