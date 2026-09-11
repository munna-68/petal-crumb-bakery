/**
 * Quiet Patisserie Editorial: a compact, handcrafted flower-and-crumb symbol
 * that supports the high-key editorial identity without relying on text.
 */
type BakeryMarkProps = {
  size?: "sm" | "md" | "lg";
  inverse?: boolean;
};

export default function BakeryMark({ size = "md", inverse = false }: BakeryMarkProps) {
  const sizing = { sm: "h-8 w-8", md: "h-11 w-11", lg: "h-16 w-16" }[size];

  return (
    <span
      className={`logo-bloom ${sizing} ${inverse ? "logo-bloom--inverse" : ""}`}
      aria-label="Petal and Crumb mark"
      role="img"
    >
      <i />
      <i />
      <i />
      <i />
      <b />
    </span>
  );
}
