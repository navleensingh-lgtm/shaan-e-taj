import Link from "next/link";
import { getPublicStoreSettings } from "@/lib/store-settings";
import { getLatestYoutubeVideo } from "@/lib/youtube-latest";
import { siteConfig } from "@/lib/site-config";
import { SocialLinks } from "@/components/SocialLinks";

export async function YouTubeSection() {
  const store = await getPublicStoreSettings();
  const youtube = store.youtubeUrl || siteConfig.social.youtube;
  const handle = siteConfig.social.youtubeHandle;
  const latest = await getLatestYoutubeVideo();

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Watch & Shop</p>
      <h2 className="serif mt-3 text-3xl md:text-4xl">Taj Fashion on YouTube</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted">
        Latest uploads from our Jalandhar boutique — subscribe on{" "}
        <a href={youtube} target="_blank" rel="noopener noreferrer" className="text-rose underline">
          {handle}
        </a>
        .
      </p>

      {latest ? (
        <div className="mt-8 max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-rose">Latest video</p>
          <h3 className="mt-2 text-lg text-brand-text">{latest.title}</h3>
          <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-sm bg-brand-text shadow-soft">
            <iframe
              title={latest.title}
              src={`https://www.youtube.com/embed/${latest.videoId}?rel=0`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={latest.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm bg-rose px-5 py-2 text-[11px] uppercase tracking-wider text-white"
            >
              Watch on YouTube
            </a>
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-brand-border px-5 py-2 text-[11px] uppercase tracking-wider"
            >
              All videos
            </a>
          </div>
        </div>
      ) : (
        <Link
          href={youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mt-8 block aspect-video w-full max-w-4xl overflow-hidden rounded-sm bg-brand-text shadow-soft"
        >
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-brand-text via-rose-dark/90 to-brand-text p-8 text-center">
            <span className="text-4xl text-white">▶</span>
            <p className="mt-4 serif text-xl text-white">Open our YouTube channel</p>
            <p className="mt-2 text-sm text-white/80">{handle}</p>
          </div>
        </Link>
      )}

      <SocialLinks className="mt-6" />
    </section>
  );
}
