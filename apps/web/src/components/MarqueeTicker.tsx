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
  const bg = variant === "rose" ? "bg-rose text-white" : "bg-gold/20 text-brand-text";

  return (
    <div className={`marquee-wrap overflow-hidden py-3 ${bg}`}>
      <div className="marquee-track flex w-max gap-12">
        {track.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="flex shrink-0 items-center gap-12 text-[11px] uppercase tracking-[0.22em]"
          >
            {text}
            <span className="text-gold opacity-80" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
