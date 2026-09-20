const lines = [
  "Luxury Indian Couture",
  "Hand Embroidered Lehengas & Suits",
  "Bridal · Party · Festive",
  "Custom Stitching Available",
  "Pan India Shipping",
  "Shaan·e·Taj · Jalandhar",
  "Visit Our Boutique on Gulmarg Ave",
];

export function MarqueeTicker({ variant = "rose" }: { variant?: "rose" | "gold" }) {
  const track = [...lines, ...lines];
  const bg =
    variant === "rose"
      ? "bg-espresso text-ivory border-b border-gold/20"
      : "bg-ivory-2 text-brand-text border-y border-brand-border/60";

  return (
    <div className={`marquee-wrap overflow-hidden py-2.5 ${bg}`}>
      <div className="marquee-track flex w-max gap-12">
        {track.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="flex shrink-0 items-center gap-12 text-[10px] uppercase tracking-[0.24em] font-medium"
          >
            <span>{text}</span>
            <span className="text-gold opacity-90 text-xs" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
