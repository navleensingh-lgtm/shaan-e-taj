/** Latest upload from @Tajfashionjalandhar via public RSS (no API key). */
const YOUTUBE_CHANNEL_ID = "UCVuy4ja0xnUekWUyuIOjOvg";

export type LatestYoutubeVideo = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  watchUrl: string;
  publishedAt?: string;
};

export async function getLatestYoutubeVideo(): Promise<LatestYoutubeVideo | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return null;

    const xml = await res.text();
    const videoId = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    if (!videoId) return null;

    const entry = xml.match(/<entry>[\s\S]*?<\/entry>/)?.[0] ?? xml;
    const title =
      entry.match(/<media:title>([^<]+)<\/media:title>/)?.[1] ??
      entry.match(/<title>([^<]+)<\/title>/)?.[1] ??
      "Latest from Taj Fashion";
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1];

    return {
      videoId,
      title: decodeXmlEntities(title),
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      publishedAt,
    };
  } catch {
    return null;
  }
}

// Augmented function: attempt to also discover Shorts if the RSS feed does not contain them.
export async function getLatestYoutubeVideoIncludingShorts(): Promise<LatestYoutubeVideo | null> {
  // Prefer RSS feed (uploads). If absent, try channel /videos page and look for /shorts/ patterns.
  const fromFeed = await getLatestYoutubeVideo();
  if (fromFeed) return fromFeed;

  try {
    const channelHtml = await fetch(siteChannelPath()).then((r) => (r.ok ? r.text() : ""));
    if (!channelHtml) return null;
    // Look for /shorts/VIDEO_ID occurrences in the HTML
    const m = channelHtml.match(/\/shorts\/([a-zA-Z0-9_-]{6,})/i);
    const id = m?.[1] ?? null;
    if (!id) return null;
    return {
      videoId: id,
      title: "Latest from Taj Fashion (Short)",
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    };
  } catch {
    return null;
  }
}

function siteChannelPath(): string {
  // prefer configured channel path if provided in env or known handle
  // default to the channel handle used elsewhere in the code
  return `https://www.youtube.com/@Tajfashionjalandhar/videos`;
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
