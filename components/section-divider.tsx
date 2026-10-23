type Surface = "paper" | "soft" | "dark" | "deep";
type Variant = "wave" | "curl";

// Two wave characters, so section breaks alternate instead of repeating one shape.
const WAVE_EDGE = "M0 62 C 240 82, 480 82, 720 60 C 960 38, 1200 38, 1440 62";
const CURL_EDGE = "M0 78 C 210 100, 430 32, 720 54 C 950 70, 1180 94, 1440 50";

export function SectionDivider({
  from = "paper",
  to = "soft",
  variant = "wave",
}: {
  from?: Surface;
  to?: Surface;
  variant?: Variant;
}) {
  const edge = variant === "curl" ? CURL_EDGE : WAVE_EDGE;
  return (
    <div
      className={`section-divider divider-from-${from} divider-to-${to} divider-${variant}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" focusable="false">
        {variant === "curl" && (
          <path
            className="divider-echo"
            d={`${CURL_EDGE} L1440 120 L0 120 Z`}
            transform="translate(0 -12)"
          />
        )}
        <path className="divider-fill" d={`${edge} L1440 120 L0 120 Z`} />
        <path className="divider-trace" d={edge} />
      </svg>
    </div>
  );
}
