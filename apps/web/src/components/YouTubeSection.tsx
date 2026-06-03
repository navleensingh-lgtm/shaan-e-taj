import Link from "next/link";
import { getPublicStoreSettings } from "@/lib/store-settings";
import { siteConfig } from "@/lib/site-config";
import { SocialLinks } from "@/components/SocialLinks";

export async function YouTubeSection() {
  const store = await getPublicStoreSettings();
  const youtube = store.youtubeUrl || siteConfig.social.youtube;
  const handle = siteConfig.social.youtubeHandle;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Watch & Shop</p>
      <h2 className="serif mt-3 text-3xl md:text-4xl">Taj Fashion on YouTube</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted">
        New arrivals, suit showcases, and styling from our Jalandhar boutique — subscribe on{" "}
        <a href={youtube} target="_blank" rel="noopener noreferrer" className="text-rose underline">
          {handle}
        </a>
        .
      </p>

      <Link
        href={youtube}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 flex aspect-video w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br from-brand-text via-rose-dark/90 to-brand-text shadow-soft transition hover:opacity-95"
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-4xl text-white backdrop-blur-sm transition group-hover:scale-105">
          ▶
        </span>
        <p className="mt-6 serif text-2xl text-white">Watch on YouTube</p>
        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/80">{handle}</p>
        <p className="mt-4 text-xs text-white/60">Tap to open our channel — latest videos & collections</p>
      </Link>

      <SocialLinks className="mt-6" />
    </section>
  );
}
