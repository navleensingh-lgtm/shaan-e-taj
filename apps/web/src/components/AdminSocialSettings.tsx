"use client";

import { useEffect, useState } from "react";
import { apiFetch, uploadAdminImage } from "@/lib/api-client";
import type { SocialConfig } from "@/lib/instagram-service";

export function AdminSocialSettings() {
  const [config, setConfig] = useState<SocialConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/admin/social")
      .then((d) => setConfig(d.config))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load social config"));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await apiFetch("/admin/social", {
        method: "PATCH",
        body: JSON.stringify(config),
      });
      setMessage("Social media & Meta integration settings saved successfully!");
      setTimeout(() => setMessage(""), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save social settings");
    } finally {
      setSaving(false);
    }
  }

  if (!config) return <p className="p-8 text-center text-sm text-brand-muted">Loading social settings…</p>;

  const isInstagramConnected = Boolean(config.instagramAccessToken && config.instagramUserId);

  return (
    <div className="space-y-8">
      {message && (
        <p className="rounded-xs border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 font-medium">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-xs border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-800 font-medium">
          {error}
        </p>
      )}

      <form onSubmit={save} className="space-y-8">
        {/* 1. Instagram Meta Integration */}
        <div className="rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border/60 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📸</span>
                <h3 className="serif text-xl font-medium text-espresso">Instagram Reels Integration</h3>
              </div>
              <p className="mt-1 text-xs text-brand-muted">
                Connect official Meta Graph API to automatically stream the latest video reels into &ldquo;Shop The Look&rdquo;.
              </p>
            </div>
            <span
              className={`rounded-xs px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                isInstagramConnected
                  ? "border border-emerald-300 bg-emerald-100 text-emerald-800"
                  : "border border-amber-300 bg-amber-100 text-amber-800"
              }`}
            >
              {isInstagramConnected ? "● Connected (Live API)" : "○ Fallback to Boutique Media"}
            </span>
          </div>

          {!isInstagramConnected && (
            <div className="mb-4 rounded-xs border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 leading-relaxed">
              <strong className="block font-semibold">How to activate automatic Instagram Reels:</strong>
              1. Create an app in Meta Developer Portal (Instagram Graph API).<br />
              2. Generate an Instagram User Access Token with <code>instagram_basic</code> & <code>instagram_content_publish</code> permissions.<br />
              3. Enter your Instagram User ID and Long-Lived Token below.<br />
              <em>Note: Until entered, the website safely displays video reels from your published catalog products without scraping.</em>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs">
              <span className="font-medium text-brand-text">Instagram Username</span>
              <input
                type="text"
                value={config.instagramUsername ?? ""}
                onChange={(e) => setConfig({ ...config, instagramUsername: e.target.value })}
                placeholder="shaan_e_taj"
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs outline-none focus:border-rose"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Instagram Profile Link</span>
              <input
                type="url"
                value={config.instagramProfileUrl ?? ""}
                onChange={(e) => setConfig({ ...config, instagramProfileUrl: e.target.value })}
                placeholder="https://www.instagram.com/shaan_e_taj/"
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs outline-none focus:border-rose"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Meta Instagram User ID (IG Business ID)</span>
              <input
                type="text"
                value={config.instagramUserId ?? ""}
                onChange={(e) => setConfig({ ...config, instagramUserId: e.target.value })}
                placeholder="e.g. 17841400000000000"
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs font-mono outline-none focus:border-rose"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Meta Long-Lived Access Token</span>
              <input
                type="password"
                value={config.instagramAccessToken ?? ""}
                onChange={(e) => setConfig({ ...config, instagramAccessToken: e.target.value })}
                placeholder="IGQVJ..."
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs font-mono outline-none focus:border-rose"
              />
            </label>
          </div>
        </div>

        {/* 2. YouTube Channel Settings */}
        <div className="rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-brand-border/60 pb-3 mb-4">
            <span className="text-xl">▶</span>
            <h3 className="serif text-xl font-medium text-espresso">YouTube Channel Integration</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs">
              <span className="font-medium text-brand-text">YouTube Channel Handle</span>
              <input
                type="text"
                value={config.youtubeHandle ?? ""}
                onChange={(e) => setConfig({ ...config, youtubeHandle: e.target.value })}
                placeholder="@Tajfashionjalandhar"
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs outline-none focus:border-rose"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">YouTube Channel URL</span>
              <input
                type="url"
                value={config.youtubeChannelUrl ?? ""}
                onChange={(e) => setConfig({ ...config, youtubeChannelUrl: e.target.value })}
                placeholder="https://www.youtube.com/@Tajfashionjalandhar"
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs outline-none focus:border-rose"
              />
            </label>
          </div>

          <p className="mt-3 text-[11px] text-brand-subtle">
            ✦ Homepage automatically detects the latest eligible normal YouTube video uploaded to this channel while excluding Shorts.
          </p>
        </div>

        {/* 3. WhatsApp Concierge Settings */}
        <div className="rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-brand-border/60 pb-3 mb-4">
            <span className="text-xl">💬</span>
            <h3 className="serif text-xl font-medium text-espresso">WhatsApp Concierge & Ordering</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs">
              <span className="font-medium text-brand-text">WhatsApp Phone Number</span>
              <input
                type="text"
                value={config.whatsappNumber ?? ""}
                onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                placeholder="919464385993"
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs outline-none focus:border-rose"
              />
              <span className="mt-1 block text-[10px] text-brand-subtle">Country code without + (e.g. 91 for India)</span>
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Default Consultation Greeting</span>
              <input
                type="text"
                value={config.defaultWhatsAppMessage ?? ""}
                onChange={(e) => setConfig({ ...config, defaultWhatsAppMessage: e.target.value })}
                placeholder="Hello Shaan-e-Taj, I'd like to inquire about..."
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs outline-none focus:border-rose"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xs bg-rose px-8 py-3 text-xs font-medium uppercase tracking-wider text-white hover:bg-rose-dark active:scale-98 transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving…" : "Save Social Settings"}
        </button>
      </form>
    </div>
  );
}
