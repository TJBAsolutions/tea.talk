import React from "react";

const LOGO_URL = "https://media.base44.com/images/public/6ac407b7c0c80f0319df9abb/af4d8d50f_logo.png";

export default function Logo({ size = 64, className = "" }) {
  return (
    <img
      src={LOGO_URL}
      alt="Tea.Talk logo"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}