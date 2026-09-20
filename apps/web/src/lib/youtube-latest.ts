/**
 * Automatic latest YouTube video resolver for @Tajfashionjalandhar.
 * Strictly fetches and isolates full-length NORMAL YouTube videos, excluding YouTube Shorts.
 */

export type LatestYoutubeVideo = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  watchUrl: string;
  duration?: string;
  publishedTimeText?: string;
};

// Known reliable fallback normal video from @Tajfashionjalandhar in case network is down
const FALLBACK_NORMAL_VIDEO: LatestYoutubeVideo = {
  videoId: "Xmo4ROd-iGw",
  title: "Festive Readymade Collection | Shaan-E-Taj",
  thumbnailUrl: "https://i.ytimg.com/vi/Xmo4ROd-iGw/hqdefault.jpg",
  watchUrl: "https://www.youtube.com/watch?v=Xmo4ROd-iGw",
  duration: "19:06",
};

/**
 * Fetches the latest normal video from the channel's /videos tab.
 * YouTube's /videos tab exclusively lists regular uploaded videos, while Shorts are housed under /shorts.
 * Revalidates every 30 minutes (1800s).
 */
export async function getLatestNormalYoutubeVideo(): Promise<LatestYoutubeVideo | null> {
  try {
    const channelVideosUrl = "https://www.youtube.com/@Tajfashionjalandhar/videos";
    const res = await fetch(channelVideosUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 1800 }, // 30 minutes automatic revalidation
    });

    if (!res.ok) {
      return FALLBACK_NORMAL_VIDEO;
    }

    const html = await res.text();
    const match =
      html.match(/var ytInitialData = ({[\s\S]*?});<\/script>/) ||
      html.match(/ytInitialData\s*=\s*({[\s\S]*?});/);

    if (!match) {
      return FALLBACK_NORMAL_VIDEO;
    }

    const data = JSON.parse(match[1]);

    function findRichItems(obj: unknown, results: any[] = []): any[] {
      if (!obj || typeof obj !== "object") return results;
      if ((obj as any).richItemRenderer) {
        results.push((obj as any).richItemRenderer);
      }
      for (const key of Object.keys(obj as any)) {
        findRichItems((obj as any)[key], results);
      }
      return results;
    }

    const items = findRichItems(data);

    for (const item of items) {
      const lvm = item.content?.lockupViewModel;
      if (!lvm) continue;

      const contentId = lvm.contentId;
      const url =
        lvm.rendererContext?.commandContext?.onTap?.innertubeCommand?.commandMetadata
          ?.webCommandMetadata?.url;

      // EXCLUSION CHECK:
      // 1. Must have contentId (11 chars video ID)
      // 2. Must be a normal watch URL (/watch?v=...)
      // 3. Must NOT be a /shorts/ URL
      if (contentId && url && url.startsWith("/watch") && !url.includes("/shorts/")) {
        const title =
          lvm.metadata?.lockupMetadataViewModel?.title?.content ||
          "Latest from Taj Fashion";

        // Extract duration badge if available
        const overlays = lvm.contentImage?.thumbnailViewModel?.overlays || [];
        const duration =
          overlays[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]
            ?.thumbnailBadgeViewModel?.text;

        // Extract published time text if available
        const metaRows =
          lvm.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel
            ?.metadataRows || [];
        const publishedTimeText =
          metaRows[0]?.metadataParts?.[1]?.text?.content;

        const thumbs = lvm.contentImage?.thumbnailViewModel?.image?.sources || [];
        const highestThumb =
          thumbs[thumbs.length - 1]?.url ||
          `https://i.ytimg.com/vi/${contentId}/hqdefault.jpg`;

        return {
          videoId: contentId,
          title: decodeXmlEntities(title),
          thumbnailUrl: highestThumb,
          watchUrl: `https://www.youtube.com/watch?v=${contentId}`,
          duration,
          publishedTimeText,
        };
      }
    }

    return FALLBACK_NORMAL_VIDEO;
  } catch (err) {
    console.warn("Could not fetch latest YouTube video, using verified fallback:", err);
    return FALLBACK_NORMAL_VIDEO;
  }
}

/** Legacy alias pointing directly to normal videos (Shorts strictly excluded) */
export async function getLatestYoutubeVideo(): Promise<LatestYoutubeVideo | null> {
  return getLatestNormalYoutubeVideo();
}

export async function getLatestYoutubeVideoIncludingShorts(): Promise<LatestYoutubeVideo | null> {
  return getLatestNormalYoutubeVideo();
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
