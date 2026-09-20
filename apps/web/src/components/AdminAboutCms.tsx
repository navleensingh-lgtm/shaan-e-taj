"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api-client";
import { DEFAULT_ABOUT_CMS, type AboutCmsConfig } from "@/lib/about-cms";
import { AdminConfirmModal } from "./AdminConfirmModal";

export function AdminAboutCms() {
  const [cms, setCms] = useState<AboutCmsConfig>(DEFAULT_ABOUT_CMS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  useEffect(() => {
    loadCms();
  }, []);

  async function loadCms() {
    setLoading(true);
    try {
      const data = await apiFetch<{ cms: AboutCmsConfig }>("/admin/cms/about");
      if (data?.cms) {
        setCms(data.cms);
      }
    } catch (err: any) {
      console.error("Failed to load about CMS", err);
      setMsg({ type: "error", text: "Failed to load current About content." });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await apiFetch<{ ok: boolean; cms: AboutCmsConfig }>("/admin/cms/about", {
        method: "PATCH",
        body: JSON.stringify(cms),
      });
      if (res?.cms) {
        setCms(res.cms);
        setMsg({ type: "success", text: "About page editorial content saved & published!" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to save About CMS." });
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, onUploaded: (url: string) => void) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        onUploaded(data.url);
        setMsg({ type: "success", text: "Image uploaded successfully." });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Image upload failed." });
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-sm text-brand-muted">Loading About Page CMS...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <h2 className="serif text-2xl font-medium">About Page Editorial CMS</h2>
          <p className="mt-1 text-xs text-brand-muted">
            Manage the luxury brand story, craftsmanship pillars, workshop heritage, and atelier visit details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="rounded-xs border border-brand-border px-3 py-1.5 text-xs text-brand-muted hover:border-gold hover:text-brand-text cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="rounded-xs bg-rose px-5 py-2 text-xs font-semibold text-white hover:bg-rose-dark cursor-pointer disabled:opacity-50 transition"
          >
            {saving ? "Publishing..." : "Publish Changes"}
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`rounded-xs p-3 text-xs ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Section 1: Hero */}
      <div className="rounded-xs border border-brand-border bg-white p-6 shadow-2xs space-y-4">
        <h3 className="serif text-lg font-medium border-b border-brand-border/60 pb-2">1. Hero Section</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Eyebrow</span>
            <input
              type="text"
              value={cms.hero.eyebrow}
              onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, eyebrow: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Main Heading</span>
            <input
              type="text"
              value={cms.hero.heading}
              onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, heading: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs serif text-base"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Subheading / Editorial Lead</span>
            <textarea
              rows={2}
              value={cms.hero.subheading}
              onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, subheading: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <div className="sm:col-span-2">
            <span className="font-medium text-brand-text text-xs block mb-1">Hero Visual / Background Image</span>
            <div className="flex items-center gap-4">
              {cms.hero.imageUrl && (
                <div className="relative h-20 w-32 overflow-hidden rounded-xs border border-brand-border">
                  <Image src={cms.hero.imageUrl} alt="Hero" fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => handleImageUpload(e, (url) => setCms({ ...cms, hero: { ...cms.hero, imageUrl: url } }))}
                  className="text-xs"
                />
                <input
                  type="text"
                  value={cms.hero.imageUrl}
                  onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, imageUrl: e.target.value } })}
                  placeholder="Or paste image URL"
                  className="mt-1.5 w-full rounded-xs border border-brand-border px-2.5 py-1 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Our Story */}
      <div className="rounded-xs border border-brand-border bg-white p-6 shadow-2xs space-y-4">
        <h3 className="serif text-lg font-medium border-b border-brand-border/60 pb-2">2. Our Story (Jalandhar Roots)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Eyebrow</span>
            <input
              type="text"
              value={cms.story.eyebrow}
              onChange={(e) => setCms({ ...cms, story: { ...cms.story, eyebrow: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Story Heading</span>
            <input
              type="text"
              value={cms.story.heading}
              onChange={(e) => setCms({ ...cms, story: { ...cms.story, heading: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs serif text-base"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Paragraph 1</span>
            <textarea
              rows={3}
              value={cms.story.paragraph1}
              onChange={(e) => setCms({ ...cms, story: { ...cms.story, paragraph1: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Paragraph 2</span>
            <textarea
              rows={3}
              value={cms.story.paragraph2}
              onChange={(e) => setCms({ ...cms, story: { ...cms.story, paragraph2: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Featured Pull Quote</span>
            <input
              type="text"
              value={cms.story.quote}
              onChange={(e) => setCms({ ...cms, story: { ...cms.story, quote: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs italic"
            />
          </label>
          <div className="sm:col-span-2">
            <span className="font-medium text-brand-text text-xs block mb-1">Story Feature Image</span>
            <div className="flex items-center gap-4">
              {cms.story.imageUrl && (
                <div className="relative h-24 w-20 overflow-hidden rounded-xs border border-brand-border">
                  <Image src={cms.story.imageUrl} alt="Story" fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => handleImageUpload(e, (url) => setCms({ ...cms, story: { ...cms.story, imageUrl: url } }))}
                  className="text-xs"
                />
                <input
                  type="text"
                  value={cms.story.imageUrl}
                  onChange={(e) => setCms({ ...cms, story: { ...cms.story, imageUrl: e.target.value } })}
                  placeholder="Or paste image URL"
                  className="mt-1.5 w-full rounded-xs border border-brand-border px-2.5 py-1 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Craftsmanship Pillars */}
      <div className="rounded-xs border border-brand-border bg-white p-6 shadow-2xs space-y-4">
        <h3 className="serif text-lg font-medium border-b border-brand-border/60 pb-2">3. Craftsmanship Section</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Eyebrow</span>
            <input
              type="text"
              value={cms.craftsmanship.eyebrow}
              onChange={(e) => setCms({ ...cms, craftsmanship: { ...cms.craftsmanship, eyebrow: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Heading</span>
            <input
              type="text"
              value={cms.craftsmanship.heading}
              onChange={(e) => setCms({ ...cms, craftsmanship: { ...cms.craftsmanship, heading: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs serif text-base"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Description</span>
            <textarea
              rows={2}
              value={cms.craftsmanship.description}
              onChange={(e) => setCms({ ...cms, craftsmanship: { ...cms.craftsmanship, description: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>

          <div className="sm:col-span-2 grid gap-4 md:grid-cols-3 pt-2">
            {cms.craftsmanship.pillars.map((p, idx) => (
              <div key={idx} className="p-3 bg-ivory-2 rounded-xs border border-brand-border space-y-2">
                <span className="text-[11px] font-semibold text-brand-muted uppercase">Pillar #{idx + 1}</span>
                <label className="block text-xs">
                  <span className="font-medium text-brand-text">Title</span>
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => {
                      const updated = [...cms.craftsmanship.pillars];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setCms({ ...cms, craftsmanship: { ...cms.craftsmanship, pillars: updated } });
                    }}
                    className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2 py-1 text-xs"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-medium text-brand-text">Description</span>
                  <textarea
                    rows={2}
                    value={p.description}
                    onChange={(e) => {
                      const updated = [...cms.craftsmanship.pillars];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setCms({ ...cms, craftsmanship: { ...cms.craftsmanship, pillars: updated } });
                    }}
                    className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2 py-1 text-xs"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-medium text-brand-text">Image URL</span>
                  <input
                    type="text"
                    value={p.image}
                    onChange={(e) => {
                      const updated = [...cms.craftsmanship.pillars];
                      updated[idx] = { ...updated[idx], image: e.target.value };
                      setCms({ ...cms, craftsmanship: { ...cms.craftsmanship, pillars: updated } });
                    }}
                    className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2 py-1 text-xs"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Jalandhar to World */}
      <div className="rounded-xs border border-brand-border bg-white p-6 shadow-2xs space-y-4">
        <h3 className="serif text-lg font-medium border-b border-brand-border/60 pb-2">4. From Jalandhar to the World</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Eyebrow</span>
            <input
              type="text"
              value={cms.jalandharToWorld.eyebrow}
              onChange={(e) => setCms({ ...cms, jalandharToWorld: { ...cms.jalandharToWorld, eyebrow: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Heading</span>
            <input
              type="text"
              value={cms.jalandharToWorld.heading}
              onChange={(e) => setCms({ ...cms, jalandharToWorld: { ...cms.jalandharToWorld, heading: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs serif text-base"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Description</span>
            <textarea
              rows={3}
              value={cms.jalandharToWorld.description}
              onChange={(e) => setCms({ ...cms, jalandharToWorld: { ...cms.jalandharToWorld, description: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>

          <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {cms.jalandharToWorld.stats.map((s, idx) => (
              <div key={idx} className="p-3 bg-ivory-2 rounded-xs border border-brand-border">
                <label className="block text-[10px] uppercase font-semibold text-brand-muted">Stat</label>
                <input
                  type="text"
                  value={s.stat}
                  onChange={(e) => {
                    const updated = [...cms.jalandharToWorld.stats];
                    updated[idx] = { ...updated[idx], stat: e.target.value };
                    setCms({ ...cms, jalandharToWorld: { ...cms.jalandharToWorld, stats: updated } });
                  }}
                  className="mt-1 w-full bg-white border border-brand-border px-2 py-1 text-xs"
                />
                <label className="block text-[10px] uppercase font-semibold text-brand-muted mt-2">Label</label>
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => {
                    const updated = [...cms.jalandharToWorld.stats];
                    updated[idx] = { ...updated[idx], label: e.target.value };
                    setCms({ ...cms, jalandharToWorld: { ...cms.jalandharToWorld, stats: updated } });
                  }}
                  className="mt-1 w-full bg-white border border-brand-border px-2 py-1 text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 5: The Shaan-e-Taj Experience */}
      <div className="rounded-xs border border-brand-border bg-white p-6 shadow-2xs space-y-4">
        <h3 className="serif text-lg font-medium border-b border-brand-border/60 pb-2">5. The Shaan-e-Taj Experience</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Eyebrow</span>
            <input
              type="text"
              value={cms.experience.eyebrow}
              onChange={(e) => setCms({ ...cms, experience: { ...cms.experience, eyebrow: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Heading</span>
            <input
              type="text"
              value={cms.experience.heading}
              onChange={(e) => setCms({ ...cms, experience: { ...cms.experience, heading: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs serif text-base"
            />
          </label>

          <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2 pt-2">
            {cms.experience.blocks.map((b, idx) => (
              <div key={idx} className="p-3 bg-ivory-2 rounded-xs border border-brand-border space-y-2">
                <span className="text-[11px] font-semibold text-rose uppercase">Step {b.number}</span>
                <label className="block text-xs">
                  <span className="font-medium text-brand-text">Title</span>
                  <input
                    type="text"
                    value={b.title}
                    onChange={(e) => {
                      const updated = [...cms.experience.blocks];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setCms({ ...cms, experience: { ...cms.experience, blocks: updated } });
                    }}
                    className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2 py-1 text-xs"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-medium text-brand-text">Description</span>
                  <textarea
                    rows={2}
                    value={b.description}
                    onChange={(e) => {
                      const updated = [...cms.experience.blocks];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setCms({ ...cms, experience: { ...cms.experience, blocks: updated } });
                    }}
                    className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2 py-1 text-xs"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 6: Custom Stitching CTA */}
      <div className="rounded-xs border border-brand-border bg-white p-6 shadow-2xs space-y-4">
        <h3 className="serif text-lg font-medium border-b border-brand-border/60 pb-2">6. Custom Stitching CTA</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Heading</span>
            <input
              type="text"
              value={cms.customStitchingCta.heading}
              onChange={(e) => setCms({ ...cms, customStitchingCta: { ...cms.customStitchingCta, heading: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs serif text-base"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Description</span>
            <textarea
              rows={2}
              value={cms.customStitchingCta.description}
              onChange={(e) => setCms({ ...cms, customStitchingCta: { ...cms.customStitchingCta, description: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Primary CTA Text</span>
            <input
              type="text"
              value={cms.customStitchingCta.primaryCtaText}
              onChange={(e) => setCms({ ...cms, customStitchingCta: { ...cms.customStitchingCta, primaryCtaText: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Primary CTA Link</span>
            <input
              type="text"
              value={cms.customStitchingCta.primaryCtaHref}
              onChange={(e) => setCms({ ...cms, customStitchingCta: { ...cms.customStitchingCta, primaryCtaHref: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Secondary CTA Text</span>
            <input
              type="text"
              value={cms.customStitchingCta.secondaryCtaText}
              onChange={(e) => setCms({ ...cms, customStitchingCta: { ...cms.customStitchingCta, secondaryCtaText: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Secondary CTA Link</span>
            <input
              type="text"
              value={cms.customStitchingCta.secondaryCtaHref}
              onChange={(e) => setCms({ ...cms, customStitchingCta: { ...cms.customStitchingCta, secondaryCtaHref: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
        </div>
      </div>

      {/* Section 7: Visit Boutique */}
      <div className="rounded-xs border border-brand-border bg-white p-6 shadow-2xs space-y-4">
        <h3 className="serif text-lg font-medium border-b border-brand-border/60 pb-2">7. Visit Jalandhar Boutique</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Heading</span>
            <input
              type="text"
              value={cms.boutiqueVisit.heading}
              onChange={(e) => setCms({ ...cms, boutiqueVisit: { ...cms.boutiqueVisit, heading: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs serif text-base"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Address</span>
            <input
              type="text"
              value={cms.boutiqueVisit.address}
              onChange={(e) => setCms({ ...cms, boutiqueVisit: { ...cms.boutiqueVisit, address: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Weekday Hours</span>
            <input
              type="text"
              value={cms.boutiqueVisit.hoursWeekdays}
              onChange={(e) => setCms({ ...cms, boutiqueVisit: { ...cms.boutiqueVisit, hoursWeekdays: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs">
            <span className="font-medium text-brand-text">Sunday Hours</span>
            <input
              type="text"
              value={cms.boutiqueVisit.hoursSunday}
              onChange={(e) => setCms({ ...cms, boutiqueVisit: { ...cms.boutiqueVisit, hoursSunday: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
          <label className="block text-xs sm:col-span-2">
            <span className="font-medium text-brand-text">Google Maps Link</span>
            <input
              type="text"
              value={cms.boutiqueVisit.mapUrl}
              onChange={(e) => setCms({ ...cms, boutiqueVisit: { ...cms.boutiqueVisit, mapUrl: e.target.value } })}
              className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
            />
          </label>
        </div>
      </div>

      {/* Save button sticky/bottom */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          className="rounded-xs bg-rose px-6 py-2.5 text-xs font-semibold text-white hover:bg-rose-dark cursor-pointer disabled:opacity-50 transition"
        >
          {saving ? "Publishing..." : "Publish All Changes"}
        </button>
      </div>

      <AdminConfirmModal
        isOpen={resetModalOpen}
        title="Reset About Content to Defaults?"
        message="This will restore the original luxury brand narrative and showroom details. Any unsaved edits will be discarded."
        confirmLabel="Reset Defaults"
        variant="danger"
        onConfirm={() => {
          setCms(DEFAULT_ABOUT_CMS);
          setResetModalOpen(false);
          setMsg({ type: "success", text: "Reset to defaults. Remember to click Publish Changes to save." });
        }}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
}
