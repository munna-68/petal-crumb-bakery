/**
 * Garden Bakery decorative motifs: organic blobs, leaf sprigs, hand-drawn
 * hearts and arrows, script annotations. All stroke/fill via currentColor
 * or soft palette vars, all purely decorative.
 */

export function HeartDoodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 92" fill="none" className={className} aria-hidden="true">
      <path
        d="M50 84C26 64 8 46 14 28c4-12 20-16 30-6 3 3 5 6 6 9 1-3 3-6 6-9 10-10 26-6 30 6 6 18-12 36-36 56Z"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SquiggleArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 10c14 26 38 38 72 34"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M66 34l14 10 4-17"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ButterBlob({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 180" fill="none" className={className} aria-hidden="true">
      <path
        d="M92 8c34-10 74 8 88 40 13 31 2 68-24 90-27 23-68 26-98 8C28 128 8 96 14 62 20 28 58 18 92 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LeafSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <path
        d="M18 108C34 84 52 58 82 40"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M46 76c-2-14 4-24 18-28 2 14-4 24-18 28Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M60 58c-10-8-12-20-4-32 10 8 12 20 4 32Z"
        fill="currentColor"
        opacity="0.65"
      />
      <path
        d="M78 46c-2-12 3-20 15-24 2 12-3 20-15 24Z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}

export function SprigDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 12h44M92 12h44" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
      <path d="M70 4c4 3 6 6 6 8s-2 5-6 8c-4-3-6-6-6-8s2-5 6-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="56" cy="12" r="1.6" fill="currentColor" />
      <circle cx="84" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function ScriptNote({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`font-script text-[19px] sm:text-[22px] leading-none font-semibold text-[var(--terra)] ${className}`}>
      {children}
    </span>
  );
}
