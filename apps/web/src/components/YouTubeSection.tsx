import { siteConfig } from "@/lib/site-config";
import { SocialLinks } from "@/components/SocialLinks";

export function YouTubeSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Watch & Shop</p>
      <h2 className="serif mt-3 text-3xl md:text-4xl">Taj Fashion on YouTube</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted">
        New arrivals, suit showcases, and styling from our Jalandhar boutique — subscribe on{" "}
        <a
          href={siteConfig.social.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose underline"
        >
          {siteConfig.social.youtubeHandle}
        </a>
        .
      </p>
      <div className="mt-8 aspect-video w-full max-w-4xl overflow-hidden rounded-sm bg-brand-text shadow-soft">
        <iframe
          title="Taj Fashion Jalandhar YouTube"
          src="https://www.youtube.com/embed?listType=user_uploads&list=Tajfashionjalandhar"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <SocialLinks className="mt-6" />
    </section>
  );
}
