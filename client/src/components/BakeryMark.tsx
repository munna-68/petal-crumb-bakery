/**
 * Garden Bakery mark: a hand-drawn six-petal bloom with a butter-gold center
 * and a pair of sage leaves. Soft, botanical, a little imperfect on purpose.
 */
type BakeryMarkProps = {
  size?: "sm" | "md" | "lg";
  inverse?: boolean;
};

export default function BakeryMark({ size = "md", inverse = false }: BakeryMarkProps) {
  const px = { sm: 30, md: 40, lg: 56 }[size];

  const petal = inverse ? "oklch(0.82 0.07 28)" : "oklch(0.615 0.115 27)";
  const petalSoft = inverse ? "oklch(0.74 0.06 30)" : "oklch(0.7 0.095 25)";
  const center = inverse ? "oklch(0.93 0.06 95)" : "oklch(0.85 0.1 90)";
  const leaf = inverse ? "oklch(0.7 0.05 128)" : "oklch(0.62 0.08 140)";

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Petal and Crumb bloom mark"
      className="shrink-0"
    >
      {/* sage leaves */}
      <path
        d="M10.5 40.5c3.6-.4 6.2-2.2 7.6-5.4-3.4-.9-6.5.2-8.6 3.3-.3.5-.5 1.2-1 2.1Z"
        fill={leaf}
        opacity="0.9"
      />
      <path
        d="M8.8 43.7c4.8-1 8.3-3.4 10.6-7.4"
        stroke={leaf}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* petals — six soft teardrops around the center */}
      <ellipse cx="24" cy="10.6" rx="6.1" ry="8.3" fill={petal} transform="rotate(0 24 24)" />
      <ellipse cx="24" cy="10.6" rx="6.1" ry="8.3" fill={petal} transform="rotate(60 24 24)" opacity="0.92" />
      <ellipse cx="24" cy="10.6" rx="6.1" ry="8.3" fill={petalSoft} transform="rotate(120 24 24)" />
      <ellipse cx="24" cy="10.6" rx="6.1" ry="8.3" fill={petal} transform="rotate(180 24 24)" opacity="0.92" />
      <ellipse cx="24" cy="10.6" rx="6.1" ry="8.3" fill={petalSoft} transform="rotate(240 24 24)" />
      <ellipse cx="24" cy="10.6" rx="6.1" ry="8.3" fill={petal} transform="rotate(300 24 24)" />
      {/* butter-gold center */}
      <circle cx="24" cy="24" r="5.4" fill={center} />
      <circle cx="22.4" cy="22.4" r="1.5" fill={petal} opacity="0.55" />
    </svg>
  );
}
