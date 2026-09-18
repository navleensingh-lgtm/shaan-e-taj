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
          className="inline-flex items-center gap-2 rounded-sm border border-brand-border px-4 py-2 text-[11px] uppercase tracking-wider transition hover:border-rose hover:text-rose-dark"
        >
          <span aria-hidden>{s.icon}</span>
          {s.label}
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
