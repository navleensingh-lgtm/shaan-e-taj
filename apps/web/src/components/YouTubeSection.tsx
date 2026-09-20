import { getPublicStoreSettings } from "@/lib/store-settings";
import { getLatestNormalYoutubeVideo } from "@/lib/youtube-latest";
import { siteConfig } from "@/lib/site-config";
import { SocialLinks } from "@/components/SocialLinks";
import { YouTubeFacade } from "@/components/YouTubeFacade";

export async function YouTubeSection() {
  const store = await getPublicStoreSettings();
  const rawYoutubeUrl = store.youtubeUrl || siteConfig.social.youtube;
  const channelVideosUrl = rawYoutubeUrl.replace(/\/+$/, "").includes("/videos")
    ? rawYoutubeUrl
    : `${rawYoutubeUrl.replace(/\/+$/, "")}/videos`;
  const handle = siteConfig.social.youtubeHandle;
  const latest = await getLatestNormalYoutubeVideo();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-brand-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-gold" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-dark font-medium">Watch & Shop</p>
          </div>
          <h2 className="serif mt-2 text-3xl sm:text-4xl md:text-5xl text-brand-text font-normal">
            Taj Fashion on YouTube
          </h2>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-brand-muted font-light leading-relaxed">
            Latest uploads from our Jalandhar boutique — subscribe to{" "}
            <a
              href={channelVideosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-dark hover:underline font-medium"
            >
              {handle}
            </a>{" "}
            for full collection releases, bridal suit trials, and stitching guides.
          </p>
        </div>

        <a
          href={channelVideosUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-luxury-outline group inline-flex items-center self-start md:self-auto rounded-xs px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-medium"
        >
          <span>Watch All Videos</span>
          <span className="arrow-shift ml-1.5 text-gold">↗</span>
        </a>
      </div>

      {/* Main Video Presentation */}
      {latest ? (
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-xs border border-rose/40 bg-rose/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-rose-dark font-medium">
                Latest Release
              </span>
              {latest.duration && (
                <span className="text-[11px] text-brand-muted font-mono">
                  Duration: {latest.duration}
                </span>
              )}
            </div>
            {latest.publishedTimeText && (
              <span className="text-[11px] text-brand-subtle italic">
                {latest.publishedTimeText}
              </span>
            )}
          </div>

          <h3 className="serif text-xl sm:text-2xl text-brand-text mb-4 leading-snug">
            {latest.title}
          </h3>

          {/* Lightweight Facade (zero heavy iframe scripts until user clicks play) */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xs bg-brand-text shadow-md border border-brand-border/80">
            <YouTubeFacade
              videoId={latest.videoId}
              title={latest.title}
              thumbnailUrl={latest.thumbnailUrl}
            />
          </div>

          {/* Action Links */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={latest.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-primary rounded-xs px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-medium"
            >
              <span>Watch on YouTube</span>
              <span className="ml-1.5 text-gold">↗</span>
            </a>
            <a
              href={channelVideosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-outline rounded-xs px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-medium text-brand-muted hover:text-espresso"
            >
              <span>Watch All Videos</span>
              <span className="arrow-shift ml-1.5 text-gold">→</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-8 max-w-5xl mx-auto">
          <a
            href={channelVideosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-video w-full overflow-hidden rounded-xs bg-espresso shadow-md border border-brand-border/80"
          >
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-ivory">
              <span className="text-4xl text-gold">▶</span>
              <p className="serif mt-4 text-2xl">Watch All Videos on YouTube</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-gold-light">{handle}</p>
            </div>
          </a>
        </div>
      )}

      <div className="mt-12 border-t border-brand-border/60 pt-6">
        <SocialLinks className="" />
      </div>
    </section>
  );
}
