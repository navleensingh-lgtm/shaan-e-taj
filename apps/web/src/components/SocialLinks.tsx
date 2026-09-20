import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const items = [
  {
    href: siteConfig.social.instagram,
    label: "Instagram",
    icon: "📸",
    handle: siteConfig.social.instagramHandle,
  },
  {
    href: siteConfig.social.youtube,
    label: "YouTube",
    icon: "▶",
    handle: siteConfig.social.youtubeHandle,
  },
] as const;

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {items.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-luxury-outline inline-flex items-center gap-2 rounded-xs px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] font-medium"
        >
          <span aria-hidden className="text-xs">{s.icon}</span>
          <span>{s.label}</span>
        </Link>
      ))}
    </div>
  );
}

export function SocialLinksFooter() {
  return (
    <div className="flex gap-3 text-xs sm:gap-4 sm:text-sm">
      {items.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-subtle transition hover:text-gold"
        >
          {s.label}
        </Link>
      ))}
    </div>
  );
}
