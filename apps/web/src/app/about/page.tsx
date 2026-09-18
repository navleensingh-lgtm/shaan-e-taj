import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "About" };
import { SocialLinks } from "@/components/SocialLinks";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Our Heritage</p>
      <h1 className="serif mt-3 text-4xl md:text-5xl">About {siteConfig.brand}</h1>
      <p className="mt-2 text-sm text-brand-subtle">{siteConfig.subtitle}</p>

      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-brand-muted">
        <p>{siteConfig.about.intro}</p>
        {siteConfig.about.story.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="serif text-lg italic text-rose-dark">
          From Jalandhar to your wardrobe — every piece tells a story of grace, craft, and celebration.
        </p>
      </div>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {siteConfig.about.highlights.map((h) => (
          <li
            key={h}
            className="rounded-sm border border-brand-border bg-white px-4 py-3 text-sm text-brand-text"
          >
            ✦ {h}
          </li>
        ))}
      </ul>

      <div className="mt-12 border-t border-brand-border pt-10">
        <p className="text-[10px] uppercase tracking-[0.25em] text-rose">Follow Us</p>
        <SocialLinks className="mt-4" />
      </div>
    </section>
  );
}
