export function HeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-orb hero-orb-1 absolute right-[8%] top-[12%] h-72 w-72 rounded-full border border-gold/35" />
      <div className="hero-orb hero-orb-2 absolute bottom-[18%] left-[5%] h-48 w-48 rounded-full border border-rose-light/50" />
      <div className="hero-orb hero-orb-3 absolute left-[42%] top-[55%] h-32 w-32 rounded-full bg-rose/5" />
      <div className="hero-shimmer absolute inset-0 opacity-40" />
      <div className="absolute left-0 top-1/4 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-rose-light/40 to-transparent" />
    </div>
  );
}
