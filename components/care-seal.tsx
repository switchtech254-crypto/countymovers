// Gold starburst medallion with a red ribbon. Pure SVG, so it stays sharp at any size.
const cx = 120;
const cy = 108;
const spikes = 32;
const burst = Array.from({ length: spikes * 2 }, (_, i) => {
  const angle = (Math.PI * i) / spikes - Math.PI / 2;
  const radius = i % 2 === 0 ? 106 : 94;
  return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

export function CareSeal({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 230"
      role="img"
      aria-label="Packed with care, from start to finish"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="seal-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0a0" />
          <stop offset="0.45" stopColor="#e9b824" />
          <stop offset="1" stopColor="#b07d10" />
        </linearGradient>
        <linearGradient id="seal-face" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#f3c93a" />
          <stop offset="0.5" stopColor="#fbe678" />
          <stop offset="1" stopColor="#d9a21b" />
        </linearGradient>
        <linearGradient id="seal-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8801f" />
          <stop offset="1" stopColor="#6e4f0c" />
        </linearGradient>
        <linearGradient id="seal-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0402f" />
          <stop offset="1" stopColor="#b8180f" />
        </linearGradient>
        <path id="seal-ribbon-path" d="M30 172 Q120 150 210 172" />
      </defs>

      {/* Starburst and rings */}
      <polygon points={burst} fill="url(#seal-gold)" />
      <circle cx={cx} cy={cy} r="76" fill="url(#seal-ring)" />
      <circle cx={cx} cy={cy} r="71" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="66" fill="url(#seal-face)" />
      <circle cx={cx} cy={cy} r="61" fill="none" stroke="#b07d10" strokeOpacity="0.5" strokeWidth="1" />

      {/* Text inside the medallion */}
      <g fontFamily="var(--font-display), sans-serif" fill="#5a3b00" textAnchor="middle">
        <text x={cx} y="82" fontSize="13" fontWeight="700" letterSpacing="3">
          PACKED
        </text>
        <text x={cx} y="112" fontSize="26" fontWeight="800">
          WITH CARE
        </text>
        <path d="M92 122 H148" stroke="#5a3b00" strokeOpacity="0.55" strokeWidth="1.2" />
      </g>

      {/* Ribbon tails (behind) */}
      <path d="M10 150 L34 160 L34 198 L10 190 L20 170 Z" fill="#8f1209" />
      <path d="M230 150 L206 160 L206 198 L230 190 L220 170 Z" fill="#8f1209" />

      {/* Ribbon (front) */}
      <path
        d="M22 156 Q120 130 218 156 L218 196 Q120 170 22 196 Z"
        fill="url(#seal-red)"
        stroke="#f3c93a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text
        className="seal-ribbon-text"
        fill="#fff"
        fontFamily="var(--font-display), sans-serif"
        fontSize="10.5"
        fontWeight="700"
        letterSpacing="1.2"
        textAnchor="middle"
      >
        <textPath href="#seal-ribbon-path" startOffset="50%">
          FROM START TO FINISH
        </textPath>
      </text>
    </svg>
  );
}