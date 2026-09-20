/**
 * Official Instagram Meta Graph API Client with Server-Side Caching
 *
 * Requirements for live automatic Instagram Reels:
 * 1. Meta for Developers App (Instagram Graph API)
 * 2. Instagram Professional/Business Account connected to a Facebook Page
 * 3. User or Page Long-Lived Access Token (or Instagram User Access Token)
 * 4. Instagram User ID (IG Business Account ID)
 */

import { prisma } from "@shaan-e-taj/database";

export type InstagramReelItem = {
  id: string;
  caption?: string;
  mediaUrl: string;
  permalink: string;
  thumbnailUrl?: string;
  timestamp: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
};

export type SocialConfig = {
  instagramUserId?: string;
  instagramAccessToken?: string;
  instagramUsername?: string;
  instagramProfileUrl?: string;
  youtubeChannelUrl?: string;
  youtubeHandle?: string;
  whatsappNumber?: string;
  defaultWhatsAppMessage?: string;
};

// In-memory server cache with 30 minute TTL
let cachedReels: InstagramReelItem[] = [];
let cacheTimestamp = 0;
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function getSocialConfig(): Promise<SocialConfig> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    const jsonConfig = (row?.socialConfig as SocialConfig) || {};
    return {
      instagramUserId: jsonConfig.instagramUserId || process.env.INSTAGRAM_USER_ID,
      instagramAccessToken: jsonConfig.instagramAccessToken || process.env.INSTAGRAM_ACCESS_TOKEN,
      instagramUsername: jsonConfig.instagramUsername || "shaan_e_taj",
      instagramProfileUrl: row?.instagramUrl || "https://www.instagram.com/shaan_e_taj/",
      youtubeChannelUrl: row?.youtubeUrl || "https://www.youtube.com/@Tajfashionjalandhar",
      youtubeHandle: "@Tajfashionjalandhar",
      whatsappNumber: row?.whatsappNumber || "919464385993",
      defaultWhatsAppMessage:
        jsonConfig.defaultWhatsAppMessage ||
        "Hello Shaan-e-Taj, I would like to inquire about this outfit from your collection.",
    };
  } catch {
    return {
      instagramUsername: "shaan_e_taj",
      instagramProfileUrl: "https://www.instagram.com/shaan_e_taj/",
      youtubeChannelUrl: "https://www.youtube.com/@Tajfashionjalandhar",
      youtubeHandle: "@Tajfashionjalandhar",
      whatsappNumber: "919464385993",
    };
  }
}

export async function fetchLatestInstagramReels(limit = 8): Promise<{
  reels: InstagramReelItem[];
  configured: boolean;
  source: "api" | "catalog_fallback";
}> {
  const config = await getSocialConfig();

  if (!config.instagramAccessToken || !config.instagramUserId) {
    return {
      reels: [],
      configured: false,
      source: "catalog_fallback",
    };
  }

  const now = Date.now();
  if (cachedReels.length > 0 && now - cacheTimestamp < CACHE_TTL_MS) {
    return {
      reels: cachedReels.slice(0, limit),
      configured: true,
      source: "api",
    };
  }

  try {
    const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
    const url = `https://graph.instagram.com/v21.0/${config.instagramUserId}/media?fields=${fields}&access_token=${config.instagramAccessToken}&limit=${limit * 2}`;

    const res = await fetch(url, {
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      console.warn("Instagram API returned non-200 status:", res.status);
      return { reels: cachedReels.slice(0, limit), configured: true, source: "api" };
    }

    const json = await res.json();
    const data: any[] = json.data || [];

    // Filter for video reels
    const filtered: InstagramReelItem[] = data
      .filter((item) => item.media_type === "VIDEO" && item.media_url)
      .map((item) => ({
        id: item.id,
        caption: item.caption,
        mediaUrl: item.media_url,
        permalink: item.permalink,
        thumbnailUrl: item.thumbnail_url || item.media_url,
        timestamp: item.timestamp,
        mediaType: item.media_type,
      }));

    if (filtered.length > 0) {
      cachedReels = filtered;
      cacheTimestamp = now;
    }

    return {
      reels: filtered.slice(0, limit),
      configured: true,
      source: "api",
    };
  } catch (err) {
    console.warn("Error fetching Instagram Reels via Graph API:", err);
    return {
      reels: cachedReels.slice(0, limit),
      configured: true,
      source: "api",
    };
  }
}
