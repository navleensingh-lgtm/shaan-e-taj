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

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
