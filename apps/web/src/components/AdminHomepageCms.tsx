"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch, uploadAdminImage } from "@/lib/api-client";
import { AdminConfirmModal } from "@/components/AdminConfirmModal";
import {
  DEFAULT_HOMEPAGE_CMS,
  type HomepageCmsConfig,
  type OccasionCardItem,
  type CategoryCardItem,
} from "@/lib/homepage-cms";

type CmsTab =
  | "sections"
  | "hero"
  | "occasions"
  | "categories"
  | "bespoke"
  | "newArrivals"
  | "shopTheLook"
  | "testimonials"
  | "preview";

export function AdminHomepageCms() {
  const [cms, setCms] = useState<HomepageCmsConfig | null>(null);
  const [activeTab, setActiveTab] = useState<CmsTab>("hero");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteOccasionTarget, setDeleteOccasionTarget] = useState<OccasionCardItem | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<CategoryCardItem | null>(null);

  useEffect(() => {
    apiFetch("/admin/cms/homepage")
      .then((d) => setCms(d.cms))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load homepage CMS"));
  }, []);

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await uploadAdminImage(file);
      callback(url);
      setMessage("Media uploaded successfully!");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function saveCms() {
    if (!cms) return;
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await apiFetch("/admin/cms/homepage", {
        method: "PATCH",
        body: JSON.stringify(cms),
      });
      setCms(res.cms);
      setMessage("Homepage content saved and published live! Check your homepage.");
      setTimeout(() => setMessage(""), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save homepage CMS");
    } finally {
      setSaving(false);
    }
  }

  if (!cms) return <p className="p-10 text-center text-sm text-brand-muted">Loading Homepage CMS…</p>;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Save */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/70 pb-4">
        <div>
          <h2 className="serif text-2xl font-normal text-brand-text">Homepage Content Management</h2>
          <p className="mt-1 text-xs text-brand-muted">
            Edit text, images, occasion cards, category visual merchandising, and section order without code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xs border border-brand-border px-3.5 py-2 text-xs text-brand-text hover:border-gold transition"
          >
            View Live Site ↗
          </a>
          <button
            type="button"
            onClick={saveCms}
            disabled={saving || uploading}
            className="rounded-xs bg-rose px-6 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-rose-dark active:scale-98 transition disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {saving ? "Publishing…" : "Publish Changes ✓"}
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-xs border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 font-medium">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xs border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-800 font-medium">
          {error}
        </div>
      )}

      {/* Editor Sub-Navigation Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-brand-border pb-2 text-xs no-scrollbar">
        {[
          { id: "hero", label: "1. Hero Campaign" },
          { id: "occasions", label: "2. Shop by Occasion" },
          { id: "categories", label: "3. Shop by Category" },
          { id: "bespoke", label: "4. Bespoke Atelier" },
          { id: "newArrivals", label: "5. New Arrivals" },
          { id: "shopTheLook", label: "6. Shop The Look" },
          { id: "testimonials", label: "7. Testimonials" },
          { id: "sections", label: "8. Section Order & Visibility" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as CmsTab)}
            className={`shrink-0 rounded-xs px-3.5 py-2 text-[11px] uppercase tracking-wider font-medium transition cursor-pointer ${
              activeTab === t.id
                ? "bg-espresso text-ivory shadow-xs"
                : "text-brand-muted hover:bg-ivory-2 hover:text-espresso"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO CAMPAIGN */}
      {activeTab === "hero" && (
        <div className="space-y-6 rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <h3 className="serif text-xl font-medium">Hero Campaign & Cinematic Media</h3>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={cms.hero.enabled}
                onChange={(e) =>
                  setCms({ ...cms, hero: { ...cms.hero, enabled: e.target.checked } })
                }
              />
              <span className="font-medium">Section Enabled</span>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs sm:col-span-2">
              <span className="font-medium text-brand-text">Eyebrow Tag</span>
              <input
                type="text"
                value={cms.hero.eyebrow}
                onChange={(e) =>
                  setCms({ ...cms, hero: { ...cms.hero, eyebrow: e.target.value } })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs sm:col-span-2">
              <span className="font-medium text-brand-text">Main Heading</span>
              <input
                type="text"
                value={cms.hero.heading}
                onChange={(e) =>
                  setCms({ ...cms, hero: { ...cms.hero, heading: e.target.value } })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs font-serif text-base"
              />
            </label>

            <label className="block text-xs sm:col-span-2">
              <span className="font-medium text-brand-text">Subheading / Description</span>
              <textarea
                rows={3}
                value={cms.hero.subheading}
                onChange={(e) =>
                  setCms({ ...cms, hero: { ...cms.hero, subheading: e.target.value } })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Primary CTA Text</span>
              <input
                type="text"
                value={cms.hero.primaryCtaText}
                onChange={(e) =>
                  setCms({ ...cms, hero: { ...cms.hero, primaryCtaText: e.target.value } })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Primary CTA Link</span>
              <input
                type="text"
                value={cms.hero.primaryCtaHref}
                onChange={(e) =>
                  setCms({ ...cms, hero: { ...cms.hero, primaryCtaHref: e.target.value } })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Secondary CTA Text</span>
              <input
                type="text"
                value={cms.hero.secondaryCtaText}
                onChange={(e) =>
                  setCms({ ...cms, hero: { ...cms.hero, secondaryCtaText: e.target.value } })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Secondary CTA Link</span>
              <input
                type="text"
                value={cms.hero.secondaryCtaHref}
                onChange={(e) =>
                  setCms({ ...cms, hero: { ...cms.hero, secondaryCtaHref: e.target.value } })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs sm:col-span-2">
              <span className="font-medium text-brand-text">
                Hero Background Video URL (YouTube or Direct MP4)
              </span>
              <input
                type="text"
                value={cms.hero.videoUrl ?? ""}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    hero: { ...cms.hero, videoUrl: e.target.value || null },
                  })
                }
                placeholder="https://www.youtube.com/watch?v=... or https://.../hero.mp4"
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs font-mono"
              />
              <span className="mt-1 block text-[10px] text-brand-subtle">
                ✦ Optimized: Never blocks homepage initial render; loads deferred in the background.
              </span>
            </label>

            {/* Image Uploaders */}
            <div className="sm:col-span-2 border-t border-brand-border/60 pt-4">
              <p className="text-xs font-semibold text-brand-text">Desktop Image / Poster Fallback</p>
              <div className="mt-2 flex items-center gap-4">
                {cms.hero.desktopImageUrl && (
                  <div className="relative h-20 w-36 overflow-hidden rounded-xs border border-brand-border">
                    <Image
                      src={cms.hero.desktopImageUrl}
                      alt="Hero preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) =>
                      handleImageUpload(e, (url) =>
                        setCms({ ...cms, hero: { ...cms.hero, desktopImageUrl: url } })
                      )
                    }
                    className="text-xs"
                  />
                  <input
                    type="text"
                    value={cms.hero.desktopImageUrl ?? ""}
                    onChange={(e) =>
                      setCms({ ...cms, hero: { ...cms.hero, desktopImageUrl: e.target.value } })
                    }
                    placeholder="Or paste image URL"
                    className="mt-1.5 w-full max-w-sm rounded-xs border border-brand-border px-2.5 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHOP BY OCCASION */}
      {activeTab === "occasions" && (
        <div className="space-y-6 rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div>
              <h3 className="serif text-xl font-medium">Shop by Occasion Cards</h3>
              <p className="mt-0.5 text-xs text-brand-muted">
                Manage occasion cards, replace imagery, update names, tags, and category links.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newOccasion: OccasionCardItem = {
                  id: `occ-${Date.now()}`,
                  title: "New Occasion",
                  tag: "Celebration",
                  description: "Custom celebratory ensemble tailored for royalty.",
                  href: "/catalog",
                  image:
                    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
                  videoUrl: null,
                  displayOrder: cms.shopByOccasion.items.length + 1,
                  active: true,
                };
                setCms({
                  ...cms,
                  shopByOccasion: {
                    ...cms.shopByOccasion,
                    items: [...cms.shopByOccasion.items, newOccasion],
                  },
                });
              }}
              className="rounded-xs border border-brand-border px-3 py-1.5 text-xs text-brand-text hover:border-gold transition active:scale-95"
            >
              + Add Occasion Card
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {cms.shopByOccasion.items.map((occ, idx) => (
              <div
                key={occ.id}
                className="rounded-xs border border-brand-border bg-ivory-2 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-brand-border/60">
                    <span className="text-xs font-semibold text-espresso">
                      Occasion #{idx + 1}: {occ.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteOccasionTarget(occ)}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xs border border-brand-border/80 mb-3 bg-white">
                    <Image src={occ.image} alt={occ.title} fill className="object-cover" />
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <label className="block">
                      <span className="font-medium text-brand-text">Title</span>
                      <input
                        type="text"
                        value={occ.title}
                        onChange={(e) => {
                          const updated = [...cms.shopByOccasion.items];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setCms({
                            ...cms,
                            shopByOccasion: { ...cms.shopByOccasion, items: updated },
                          });
                        }}
                        className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2.5 py-1.5"
                      />
                    </label>

                    <label className="block">
                      <span className="font-medium text-brand-text">Tag Pill</span>
                      <input
                        type="text"
                        value={occ.tag}
                        onChange={(e) => {
                          const updated = [...cms.shopByOccasion.items];
                          updated[idx] = { ...updated[idx], tag: e.target.value };
                          setCms({
                            ...cms,
                            shopByOccasion: { ...cms.shopByOccasion, items: updated },
                          });
                        }}
                        className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2.5 py-1.5"
                      />
                    </label>

                    <label className="block">
                      <span className="font-medium text-brand-text">Description</span>
                      <input
                        type="text"
                        value={occ.description}
                        onChange={(e) => {
                          const updated = [...cms.shopByOccasion.items];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setCms({
                            ...cms,
                            shopByOccasion: { ...cms.shopByOccasion, items: updated },
                          });
                        }}
                        className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2.5 py-1.5"
                      />
                    </label>

                    <label className="block">
                      <span className="font-medium text-brand-text">Destination URL / Category</span>
                      <input
                        type="text"
                        value={occ.href}
                        onChange={(e) => {
                          const updated = [...cms.shopByOccasion.items];
                          updated[idx] = { ...updated[idx], href: e.target.value };
                          setCms({
                            ...cms,
                            shopByOccasion: { ...cms.shopByOccasion, items: updated },
                          });
                        }}
                        className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2.5 py-1.5"
                      />
                    </label>

                    <div>
                      <span className="font-medium text-brand-text block mb-1">Replace Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={(e) =>
                          handleImageUpload(e, (url) => {
                            const updated = [...cms.shopByOccasion.items];
                            updated[idx] = { ...updated[idx], image: url };
                            setCms({
                              ...cms,
                              shopByOccasion: { ...cms.shopByOccasion, items: updated },
                            });
                          })
                        }
                        className="text-xs"
                      />
                      <input
                        type="text"
                        value={occ.image}
                        onChange={(e) => {
                          const updated = [...cms.shopByOccasion.items];
                          updated[idx] = { ...updated[idx], image: e.target.value };
                          setCms({
                            ...cms,
                            shopByOccasion: { ...cms.shopByOccasion, items: updated },
                          });
                        }}
                        placeholder="Or paste image URL"
                        className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2.5 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SHOP BY CATEGORY */}
      {activeTab === "categories" && (
        <div className="space-y-6 rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div>
              <h3 className="serif text-xl font-medium">Shop by Category Visual Cards</h3>
              <p className="mt-0.5 text-xs text-brand-muted">
                Visual merchandising cards linked directly to catalog categories.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newCat: CategoryCardItem = {
                  id: `cat-${Date.now()}`,
                  title: "New Category",
                  tag: "Collection",
                  description: "Explore our latest handcrafted pieces.",
                  href: "/catalog",
                  image:
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
                  displayOrder: cms.shopByCategory.items.length + 1,
                  active: true,
                };
                setCms({
                  ...cms,
                  shopByCategory: {
                    ...cms.shopByCategory,
                    items: [...cms.shopByCategory.items, newCat],
                  },
                });
              }}
              className="rounded-xs border border-brand-border px-3 py-1.5 text-xs text-brand-text hover:border-gold transition active:scale-95"
            >
              + Add Category Card
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {cms.shopByCategory.items.map((cat, idx) => (
              <div
                key={cat.id}
                className="rounded-xs border border-brand-border bg-ivory-2 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-brand-border/60">
                    <span className="text-xs font-semibold text-espresso">
                      Category #{idx + 1}: {cat.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteCategoryTarget(cat)}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xs border border-brand-border/80 mb-3 bg-white">
                    <Image src={cat.image} alt={cat.title} fill className="object-cover" />
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <label className="block">
                      <span className="font-medium text-brand-text">Category Name</span>
                      <input
                        type="text"
                        value={cat.title}
                        onChange={(e) => {
                          const updated = [...cms.shopByCategory.items];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setCms({
                            ...cms,
                            shopByCategory: { ...cms.shopByCategory, items: updated },
                          });
                        }}
                        className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2.5 py-1.5"
                      />
                    </label>

                    <label className="block">
                      <span className="font-medium text-brand-text">Description</span>
                      <input
                        type="text"
                        value={cat.description}
                        onChange={(e) => {
                          const updated = [...cms.shopByCategory.items];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setCms({
                            ...cms,
                            shopByCategory: { ...cms.shopByCategory, items: updated },
                          });
                        }}
                        className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2.5 py-1.5"
                      />
                    </label>

                    <label className="block">
                      <span className="font-medium text-brand-text">Catalog URL Link</span>
                      <input
                        type="text"
                        value={cat.href}
                        onChange={(e) => {
                          const updated = [...cms.shopByCategory.items];
                          updated[idx] = { ...updated[idx], href: e.target.value };
                          setCms({
                            ...cms,
                            shopByCategory: { ...cms.shopByCategory, items: updated },
                          });
                        }}
                        className="mt-1 w-full rounded-xs border border-brand-border bg-white px-2.5 py-1.5"
                      />
                    </label>

                    <div>
                      <span className="font-medium text-brand-text block mb-1">Replace Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={(e) =>
                          handleImageUpload(e, (url) => {
                            const updated = [...cms.shopByCategory.items];
                            updated[idx] = { ...updated[idx], image: url };
                            setCms({
                              ...cms,
                              shopByCategory: { ...cms.shopByCategory, items: updated },
                            });
                          })
                        }
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BESPOKE ATELIER COUTURE */}
      {activeTab === "bespoke" && (
        <div className="space-y-6 rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <h3 className="serif text-xl font-medium">Bespoke Couture Experience Section</h3>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={cms.bespokeCouture.enabled}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    bespokeCouture: { ...cms.bespokeCouture, enabled: e.target.checked },
                  })
                }
              />
              <span className="font-medium">Section Enabled</span>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs sm:col-span-2">
              <span className="font-medium text-brand-text">Section Eyebrow</span>
              <input
                type="text"
                value={cms.bespokeCouture.eyebrow}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    bespokeCouture: { ...cms.bespokeCouture, eyebrow: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs sm:col-span-2">
              <span className="font-medium text-brand-text">Heading</span>
              <input
                type="text"
                value={cms.bespokeCouture.heading}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    bespokeCouture: { ...cms.bespokeCouture, heading: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs font-serif text-base"
              />
            </label>

            <label className="block text-xs sm:col-span-2">
              <span className="font-medium text-brand-text">Description</span>
              <textarea
                rows={3}
                value={cms.bespokeCouture.description}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    bespokeCouture: { ...cms.bespokeCouture, description: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            {/* Features/Stats */}
            <div className="sm:col-span-2 grid grid-cols-3 gap-3">
              {cms.bespokeCouture.features.map((f, i) => (
                <div key={i} className="p-3 bg-ivory-2 rounded-xs border border-brand-border">
                  <label className="block text-[11px] font-medium text-brand-muted">Stat #{i + 1}</label>
                  <input
                    type="text"
                    value={f.stat}
                    onChange={(e) => {
                      const feats = [...cms.bespokeCouture.features];
                      feats[i] = { ...feats[i], stat: e.target.value };
                      setCms({
                        ...cms,
                        bespokeCouture: { ...cms.bespokeCouture, features: feats },
                      });
                    }}
                    className="mt-1 w-full bg-white border border-brand-border px-2 py-1 text-xs"
                  />
                  <label className="block text-[11px] font-medium text-brand-muted mt-2">Label</label>
                  <input
                    type="text"
                    value={f.label}
                    onChange={(e) => {
                      const feats = [...cms.bespokeCouture.features];
                      feats[i] = { ...feats[i], label: e.target.value };
                      setCms({
                        ...cms,
                        bespokeCouture: { ...cms.bespokeCouture, features: feats },
                      });
                    }}
                    className="mt-1 w-full bg-white border border-brand-border px-2 py-1 text-xs"
                  />
                </div>
              ))}
            </div>

            {/* CTAs */}
            <label className="block text-xs">
              <span className="font-medium text-brand-text">Primary CTA Text (Size Guide)</span>
              <input
                type="text"
                value={cms.bespokeCouture.primaryCtaText}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    bespokeCouture: { ...cms.bespokeCouture, primaryCtaText: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Primary CTA Link</span>
              <input
                type="text"
                value={cms.bespokeCouture.primaryCtaHref}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    bespokeCouture: { ...cms.bespokeCouture, primaryCtaHref: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Secondary CTA Text (Appointment)</span>
              <input
                type="text"
                value={cms.bespokeCouture.secondaryCtaText}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    bespokeCouture: { ...cms.bespokeCouture, secondaryCtaText: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Secondary CTA Link</span>
              <input
                type="text"
                value={cms.bespokeCouture.secondaryCtaHref}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    bespokeCouture: { ...cms.bespokeCouture, secondaryCtaHref: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            {/* Atelier Image */}
            <div className="sm:col-span-2 border-t border-brand-border/60 pt-4">
              <p className="text-xs font-semibold text-brand-text">Atelier Showcase Image</p>
              <div className="mt-2 flex items-center gap-4">
                {cms.bespokeCouture.imageUrl && (
                  <div className="relative h-24 w-20 overflow-hidden rounded-xs border border-brand-border">
                    <Image
                      src={cms.bespokeCouture.imageUrl}
                      alt="Bespoke atelier"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) =>
                      handleImageUpload(e, (url) =>
                        setCms({
                          ...cms,
                          bespokeCouture: { ...cms.bespokeCouture, imageUrl: url },
                        })
                      )
                    }
                    className="text-xs"
                  />
                  <input
                    type="text"
                    value={cms.bespokeCouture.imageUrl}
                    onChange={(e) =>
                      setCms({
                        ...cms,
                        bespokeCouture: { ...cms.bespokeCouture, imageUrl: e.target.value },
                      })
                    }
                    placeholder="Or paste image URL"
                    className="mt-1.5 w-full rounded-xs border border-brand-border px-2.5 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NEW ARRIVALS */}
      {activeTab === "newArrivals" && (
        <div className="space-y-6 rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <h3 className="serif text-xl font-medium">New Arrivals Section</h3>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={cms.newArrivals.enabled}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    newArrivals: { ...cms.newArrivals, enabled: e.target.checked },
                  })
                }
              />
              <span className="font-medium">Section Enabled</span>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs">
              <span className="font-medium text-brand-text">Section Eyebrow</span>
              <input
                type="text"
                value={cms.newArrivals.eyebrow}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    newArrivals: { ...cms.newArrivals, eyebrow: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Section Title</span>
              <input
                type="text"
                value={cms.newArrivals.title}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    newArrivals: { ...cms.newArrivals, title: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs sm:col-span-2">
              <span className="font-medium text-brand-text">Subtitle</span>
              <input
                type="text"
                value={cms.newArrivals.subtitle}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    newArrivals: { ...cms.newArrivals, subtitle: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Number of Products to Display</span>
              <input
                type="number"
                min={2}
                max={24}
                value={cms.newArrivals.limit}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    newArrivals: { ...cms.newArrivals, limit: Number(e.target.value) || 8 },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">CTA Button Text</span>
              <input
                type="text"
                value={cms.newArrivals.ctaText}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    newArrivals: { ...cms.newArrivals, ctaText: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>
          </div>
        </div>
      )}

      {/* TAB 6: SHOP THE LOOK / REELS */}
      {activeTab === "shopTheLook" && (
        <div className="space-y-6 rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div>
              <h3 className="serif text-xl font-medium">Shop The Look (Reel Stories)</h3>
              <p className="mt-0.5 text-xs text-brand-muted">
                Controls the horizontal vertical story reel on the homepage.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={cms.shopTheLook.enabled}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    shopTheLook: { ...cms.shopTheLook, enabled: e.target.checked },
                  })
                }
              />
              <span className="font-medium">Section Enabled</span>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs">
              <span className="font-medium text-brand-text">Title</span>
              <input
                type="text"
                value={cms.shopTheLook.title}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    shopTheLook: { ...cms.shopTheLook, title: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-brand-text">Eyebrow Tag</span>
              <input
                type="text"
                value={cms.shopTheLook.eyebrow}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    shopTheLook: { ...cms.shopTheLook, eyebrow: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <label className="block text-xs sm:col-span-2">
              <span className="font-medium text-brand-text">Subtitle</span>
              <input
                type="text"
                value={cms.shopTheLook.subtitle}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    shopTheLook: { ...cms.shopTheLook, subtitle: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xs border border-brand-border px-3 py-2 text-xs"
              />
            </label>

            <div className="sm:col-span-2 rounded-xs border border-brand-border/80 bg-ivory-2 p-3.5">
              <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={cms.shopTheLook.autoInstagramReels}
                  onChange={(e) =>
                    setCms({
                      ...cms,
                      shopTheLook: { ...cms.shopTheLook, autoInstagramReels: e.target.checked },
                    })
                  }
                />
                <span>Automatically sync latest Instagram Reels if Meta API configured</span>
              </label>
              <p className="mt-1 text-[11px] text-brand-muted pl-6">
                When enabled and API token is present, new Reels appear automatically. Otherwise, seamlessly displays video looks from your published product catalog.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: TESTIMONIALS */}
      {activeTab === "testimonials" && (
        <div className="space-y-6 rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div>
              <h3 className="serif text-xl font-medium">Patrons of Taj (Client Reviews)</h3>
              <p className="mt-0.5 text-xs text-brand-muted">
                Worldwide reviews from brides and patrons across Canada, UK, USA, and India.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={cms.testimonials.enabled}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    testimonials: { ...cms.testimonials, enabled: e.target.checked },
                  })
                }
              />
              <span className="font-medium">Section Enabled</span>
            </label>
          </div>

          <div className="space-y-4">
            {cms.testimonials.items.map((t, i) => (
              <div key={i} className="p-4 bg-ivory-2 rounded-xs border border-brand-border space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Patron Review #{i + 1}</span>
                </div>
                <textarea
                  rows={2}
                  value={t.quote}
                  onChange={(e) => {
                    const items = [...cms.testimonials.items];
                    items[i] = { ...items[i], quote: e.target.value };
                    setCms({ ...cms, testimonials: { ...cms.testimonials, items } });
                  }}
                  className="w-full bg-white border border-brand-border px-3 py-2 text-xs"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    placeholder="Author name"
                    value={t.author}
                    onChange={(e) => {
                      const items = [...cms.testimonials.items];
                      items[i] = { ...items[i], author: e.target.value };
                      setCms({ ...cms, testimonials: { ...cms.testimonials, items } });
                    }}
                    className="bg-white border border-brand-border px-2 py-1 text-xs"
                  />
                  <input
                    placeholder="Location (e.g. Vancouver, Canada)"
                    value={t.location}
                    onChange={(e) => {
                      const items = [...cms.testimonials.items];
                      items[i] = { ...items[i], location: e.target.value };
                      setCms({ ...cms, testimonials: { ...cms.testimonials, items } });
                    }}
                    className="bg-white border border-brand-border px-2 py-1 text-xs"
                  />
                  <input
                    placeholder="Occasion (e.g. Bridal Ensemble)"
                    value={t.occasion}
                    onChange={(e) => {
                      const items = [...cms.testimonials.items];
                      items[i] = { ...items[i], occasion: e.target.value };
                      setCms({ ...cms, testimonials: { ...cms.testimonials, items } });
                    }}
                    className="bg-white border border-brand-border px-2 py-1 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: SECTION ORDER & VISIBILITY */}
      {activeTab === "sections" && (
        <div className="space-y-6 rounded-xs border border-brand-border bg-white p-6 shadow-2xs">
          <div className="border-b border-brand-border/60 pb-3">
            <h3 className="serif text-xl font-medium">Homepage Section Hierarchy & Toggles</h3>
            <p className="mt-0.5 text-xs text-brand-muted">
              Configure which sections appear on the homepage and their vertical sequence number.
            </p>
          </div>

          <div className="divide-y divide-brand-border/60 text-xs">
            {[
              { key: "hero", name: "1. Cinematic Campaign Hero", obj: cms.hero },
              { key: "shopTheLook", name: "2. Shop The Look / Reel Stories", obj: cms.shopTheLook },
              { key: "newArrivals", name: "3. Curated New Arrivals", obj: cms.newArrivals },
              { key: "shopByOccasion", name: "4. Shop by Occasion", obj: cms.shopByOccasion },
              { key: "shopByCategory", name: "5. Curated Categories", obj: cms.shopByCategory },
              { key: "bestsellers", name: "6. Signature Bestsellers", obj: cms.bestsellers },
              { key: "bespokeCouture", name: "7. Bespoke Atelier Experience", obj: cms.bespokeCouture },
              { key: "testimonials", name: "8. Patrons of Taj (Reviews)", obj: cms.testimonials },
              { key: "youtube", name: "9. YouTube Channel Section", obj: cms.youtube },
              { key: "boutiqueCta", name: "10. Boutique WhatsApp CTA", obj: cms.boutiqueCta },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-brand-subtle w-6">
                    #{s.obj.displayOrder}
                  </span>
                  <span className="font-medium text-brand-text">{s.name}</span>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-brand-subtle">
                    <span>Order:</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={s.obj.displayOrder}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 1;
                        setCms({
                          ...cms,
                          [s.key]: { ...(cms as any)[s.key], displayOrder: val },
                        });
                      }}
                      className="w-14 rounded-xs border border-brand-border px-2 py-1 text-center bg-white"
                    />
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={s.obj.enabled}
                      onChange={(e) => {
                        setCms({
                          ...cms,
                          [s.key]: { ...(cms as any)[s.key], enabled: e.target.checked },
                        });
                      }}
                    />
                    <span>{s.obj.enabled ? "Visible" : "Hidden"}</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Occasion deletion confirmation */}
      <AdminConfirmModal
        isOpen={Boolean(deleteOccasionTarget)}
        title="Remove Occasion Card"
        message={
          deleteOccasionTarget
            ? `Are you sure you want to remove "${deleteOccasionTarget.title}" from the homepage "Shop by Occasion" section?`
            : ""
        }
        confirmLabel="Remove Card"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          if (!deleteOccasionTarget || !cms) return;
          setCms({
            ...cms,
            shopByOccasion: {
              ...cms.shopByOccasion,
              items: cms.shopByOccasion.items.filter((x) => x.id !== deleteOccasionTarget.id),
            },
          });
          setDeleteOccasionTarget(null);
        }}
        onCancel={() => setDeleteOccasionTarget(null)}
      />

      {/* Category card deletion confirmation */}
      <AdminConfirmModal
        isOpen={Boolean(deleteCategoryTarget)}
        title="Remove Category Card"
        message={
          deleteCategoryTarget
            ? `Are you sure you want to remove "${deleteCategoryTarget.title}" from the homepage "Shop by Category" section?`
            : ""
        }
        confirmLabel="Remove Card"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          if (!deleteCategoryTarget || !cms) return;
          setCms({
            ...cms,
            shopByCategory: {
              ...cms.shopByCategory,
              items: cms.shopByCategory.items.filter((x) => x.id !== deleteCategoryTarget.id),
            },
          });
          setDeleteCategoryTarget(null);
        }}
        onCancel={() => setDeleteCategoryTarget(null)}
      />
    </div>
  );
}
