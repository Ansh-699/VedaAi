import { cn } from "@/lib/cn";

export function EmptyAssignmentsArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 360"
      role="img"
      aria-label="No assignments illustration"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bgCircle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EFEFEF" />
          <stop offset="100%" stopColor="#E4E4E7" />
        </radialGradient>
        <linearGradient id="lensGlass" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFE0E0" />
        </linearGradient>
      </defs>

      {/* Big soft background halo */}
      <circle cx="180" cy="190" r="155" fill="url(#bgCircle)" />

      {/* Document page — large, centered-left */}
      <g>
        <rect
          x="118"
          y="98"
          width="140"
          height="180"
          rx="18"
          ry="18"
          fill="#FFFFFF"
        />
      </g>

      {/* Title — ROUNDED RECTANGLE (not oval) */}
      <rect x="138" y="128" width="74" height="16" rx="5" fill="#011625" />

      {/* 4 grey lines — rounded rectangles, not pills */}
      <rect x="132" y="170" width="112" height="11" rx="3" fill="#D9D9DC" />
      <rect x="132" y="194" width="112" height="11" rx="3" fill="#D9D9DC" />
      <rect x="132" y="218" width="112" height="11" rx="3" fill="#D9D9DC" />
      <rect x="132" y="242" width="112" height="11" rx="3" fill="#D9D9DC" />

      {/* Cloud badge — top-right, bigger */}
      <g>
        <rect x="244" y="92" width="76" height="38" rx="13" fill="#FFFFFF" />
      </g>
      <circle cx="261" cy="111" r="6" fill="#CCC6D9" />
      <rect x="274" y="106" width="36" height="11" rx="6" fill="#D9D9DC" />

      {/* Magnifying glass — handle drawn FIRST (behind rim), goes BOTTOM-RIGHT */}
      <g>
        {/* Handle shaft — line from inside the rim out to bottom-right */}
        <line
          x1="262"
          y1="256"
          x2="332"
          y2="326"
          stroke="#B7B0CD"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Tip cap (slightly lighter) */}
        <circle cx="332" cy="326" r="11" fill="#CCC6D9" />

        {/* outer ring */}
        <circle cx="232" cy="226" r="68" fill="#CCC6D9" />
        {/* inner band */}
        <circle cx="232" cy="226" r="60" fill="#E1DCEB" />
        {/* glass */}
        <circle cx="232" cy="226" r="52" fill="url(#lensGlass)" />
        {/* glass overlay */}
        <circle cx="232" cy="226" r="52" fill="rgba(255,255,255,0.40)" />
      </g>

      {/* Red X — bold, centered in lens */}
      <g stroke="#FF4040" strokeWidth="13" strokeLinecap="round">
        <line x1="214" y1="208" x2="250" y2="244" />
        <line x1="250" y1="208" x2="214" y2="244" />
      </g>

      {/* Sparkle — bottom-left of page */}
      <g transform="translate(135,275)" fill="#417BA4">
        <path d="M0 -12 L2.6 -2.6 L12 0 L2.6 2.6 L0 12 L-2.6 2.6 L-12 0 L-2.6 -2.6 Z" />
      </g>

      {/* Blue dot — middle-right */}
      <circle cx="320" cy="206" r="7" fill="#417BA4" />
    </svg>
  );
}
