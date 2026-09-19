export const MAX_PRODUCT_IMAGE_MB = 500;
export const MAX_PRODUCT_IMAGE_SIZE = MAX_PRODUCT_IMAGE_MB * 1024 * 1024;

export const MAX_PRODUCT_VIDEO_MB = 1000;
export const MAX_PRODUCT_VIDEO_SIZE = MAX_PRODUCT_VIDEO_MB * 1024 * 1024;

export const ALLOWED_PRODUCT_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const ALLOWED_PRODUCT_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export type ProductMediaInput = { url: string; kind: string };

export type ProductImageInput = {
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
  alt?: string | null;
};

export function videoEmbed(
  url: string
): { type: "youtube" | "instagram" | "video"; src: string; canonicalUrl?: string } {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) {
        return {
          type: "youtube",
          src: `https://www.youtube.com/embed/${id}?rel=0`,
          canonicalUrl: url,
        };
      }
    }
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const id =
        parsed.searchParams.get("v") ||
        parsed.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/)?.[1];
      if (id) {
        return {
          type: "youtube",
          src: `https://www.youtube.com/embed/${id}?rel=0`,
          canonicalUrl: url,
        };
      }
    }
    if (host === "instagram.com" || host.endsWith(".instagram.com")) {
      const match = parsed.pathname.match(/^\/(?:reel|p|tv)\/([^/?#]+)/);
      if (match) {
        const reelPath = parsed.pathname.startsWith("/p/")
          ? `/p/${match[1]}/`
          : `/reel/${match[1]}/`;
        return {
          type: "instagram",
          src: `https://www.instagram.com${reelPath}embed/captioned/`,
          canonicalUrl: parsed.toString(),
        };
      }
    }
  } catch {
    // fall through
  }
  return { type: "video", src: url, canonicalUrl: url };
}

export function inferMediaKind(url: string): string {
  const embed = videoEmbed(url);
  if (embed.type === "youtube") return "YOUTUBE";
  if (embed.type === "instagram") return "INSTAGRAM";
  return "VIDEO";
}

export function validateYouTubeUrl(url: string): string | null {
  const embed = videoEmbed(url);
  if (embed.type !== "youtube") return "Enter a valid YouTube or YouTube Shorts link";
  return null;
}

export function validateInstagramReelUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host !== "instagram.com" && !host.endsWith(".instagram.com")) {
      return "Enter a valid Instagram Reel link";
    }
    if (!/^\/(?:reel|p|tv)\/[^/?#]+/.test(parsed.pathname)) {
      return "Use an Instagram Reel or post URL (instagram.com/reel/…)";
    }
    return null;
  } catch {
    return "Enter a valid Instagram Reel link";
  }
}

export function validateMediaUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return "URL is required";
  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "URL must start with http:// or https://";
    }
  } catch {
    return "Invalid URL";
  }
  if (/youtube\.com|youtu\.be/i.test(trimmed)) return validateYouTubeUrl(trimmed);
  if (/instagram\.com/i.test(trimmed)) return validateInstagramReelUrl(trimmed);
  return null;
}

export function normalizeProductMedia(value: unknown): ProductMediaInput[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const out: ProductMediaInput[] = [];

  for (const item of value) {
    const url = typeof item === "string" ? item.trim() : String(item?.url ?? "").trim();
    if (!url || seen.has(url)) continue;

    const kindRaw =
      typeof item === "object" && item && item.kind != null
        ? String(item.kind).toUpperCase()
        : inferMediaKind(url);

    if (url.startsWith("data:")) {
      seen.add(url);
      out.push({ url, kind: kindRaw === "IMAGE" ? "VIDEO" : kindRaw });
      continue;
    }

    const validation = validateMediaUrl(url);
    if (validation && !url.match(/\.(mp4|webm|mov)(\?|$)/i)) {
      continue;
    }

    seen.add(url);
    out.push({ url, kind: kindRaw });
  }

  return out;
}

export function normalizeProductImages(value: unknown): ProductImageInput[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const images: ProductImageInput[] = [];

  for (const item of value) {
    const url = typeof item === "string" ? item.trim() : String(item?.url ?? "").trim();
    if (!url || seen.has(url)) continue;
    try {
      const parsed = new URL(url);
      if (!["http:", "https:", "data:"].includes(parsed.protocol)) continue;
    } catch {
      continue;
    }
    seen.add(url);
    images.push({
      url,
      isPrimary: Boolean(typeof item === "object" && item && item.isPrimary),
      alt: typeof item === "object" && item && item.alt != null ? String(item.alt) : null,
    });
  }

  if (images.length && !images.some((i) => i.isPrimary)) {
    images[0].isPrimary = true;
  }

  return images.map((img, index) => ({ ...img, sortOrder: index }));
}
