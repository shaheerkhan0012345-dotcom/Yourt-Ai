import React from "react";

interface YourtLogoProps {
  size?: number;
  withBackground?: boolean;
  className?: string;
}

export default function YourtLogo({ size = 36, withBackground = true, className = "" }: YourtLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none pointer-events-none transition-all duration-300 ${className}`}
      id="yourt-brand-logo-svg"
    >
      {/* 1. BRAND ORANGE BACKGROUND COVER (Using robust solid color to prevent ID-clash linearGradient bugs) */}
      {withBackground && (
        <rect
          width="100"
          height="100"
          rx="24"
          fill="#ff6b00"
        />
      )}

      {/* 2. GLYPH - ORIGINAL STYLE 'Y' FORK SHAPE WITH EXTRA BOTTOM OFFSET */}
      <path
        d="M20 18C20 18 22 36 43 52V85C43 89.5 46.5 92 50 92C53.5 92 57 89.5 57 85V52C78 36 80 18 80 18C70 15 57 30 50 44C43 30 30 15 20 18Z"
        fill={withBackground ? "white" : "#ff6b00"}
      />

      {/* 3. CAPSULE ELEMENT (FRONT PANEL OVER STEM) WITH SUBTLE DROP SHADOW MOCKUP */}
      <rect
        x="31"
        y="60"
        width="38"
        height="22"
        rx="7"
        fill={withBackground ? "white" : "#0D0D0D"}
      />

      {/* 4. HIGH CONTRAST ORIGINAL ORANGE RIGHT-POINTING ARROW INSIDE CAPSULE */}
      <path
        d="M41 71H59M59 71L53 65M59 71L53 77"
        stroke={withBackground ? "#ff6b00" : "white"}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
