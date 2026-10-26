import React from 'react';

export default function NeironLogo({ className = 'brand-logo-svg' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="36 120 292 68"
      className={className}
      aria-label="Нейрон"
      role="img"
    >
      <text
        x="40"
        y="175"
        fontFamily="Montserrat, 'Helvetica Neue', Arial, sans-serif"
        fontSize="56"
        fontWeight="700"
        letterSpacing="4"
        fill="currentColor"
        className="logo-text"
      >
        НЕЙР
      </text>

      <g transform="translate(245,155)">
        <circle
          r="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          className="logo-ring"
        />
        <circle
          r="9"
          fill="var(--primary)"
          className="logo-dot"
        />
      </g>

      <text
        x="276"
        y="175"
        fontFamily="Montserrat, 'Helvetica Neue', Arial, sans-serif"
        fontSize="56"
        fontWeight="700"
        letterSpacing="4"
        fill="currentColor"
        className="logo-text"
      >
        Н
      </text>
    </svg>
  );
}
