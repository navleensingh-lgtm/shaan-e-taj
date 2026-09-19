"use client";

import { useEffect, useState } from "react";
import { apiFetch, uploadAdminImage } from "@/lib/api-client";
import {
  inferMediaKind,
  MAX_PRODUCT_IMAGE_MB,
  MAX_PRODUCT_IMAGE_SIZE,
  MAX_PRODUCT_VIDEO_MB,
  MAX_PRODUCT_VIDEO_SIZE,
  validateInstagramReelUrl,
  validateMediaUrl,
  validateYouTubeUrl,
  videoEmbed,
} from "@/lib/product-media";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  priceInPaise: number;
  compareAtPaise: number | null;
  badge: string | null;
  fabric: string | null;
  color: string | null;
  status: string;
  inStock: boolean;
  isNewArrival: boolean;
  images: { url: string; isPrimary: boolean; sortOrder?: number }[];
  media: { url: string; kind: string }[];
};

type CategoryOption = { slug: string; name: string; kind: string };

type ImageItem = { id: string; url: string; isPrimary: boolean };
type MediaItem = { id: string; url: string; kind: string };

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  mainCategory: "PARTY_WEAR",
  subCategory: "PAKISTANI",
  priceRupees: "",
  compareAtRupees: "",
  badge: "",
  fabric: "",
  color: "",
  status: "PUBLISHED",
  inStock: true,
  isNewArrival: true,
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [mainCategories, setMainCategories] = useState<CategoryOption[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryOption[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [draggedImgIdx, setDraggedImgIdx] = useState<number | null>(null);
  const [dragOverImages, setDragOverImages] = useState(false);
  const [dragOverVideo, setDragOverVideo] = useState(false);
  const [youtubeInput, setYoutubeInput] = useState("");
  const [instagramInput, setInstagramInput] = useState("");
  const [mediaUrlInput, setMediaUrlInput] = useState("");

  function loadCategories() {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        const all: CategoryOption[] = d.categories ?? [];
        setMainCategories(all.filter((c) => c.kind === "MAIN"));
        setSubCategories(all.filter((c) => c.kind === "SUB"));
      })
      .catch(() => {
        /* keep datalist fallbacks */
      });
  }

  function load() {
    apiFetch("/admin/products").then((d) => setProducts(d.products ?? []));
  }

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  async function uploadFile(file: File, onUrl: (url: string) => void) {
    setUploading(true);
    setUploadError("");
    setSyncMsg("");
    try {
      const { url, storage } = await uploadAdminImage(file);
      onUrl(url);
      setSyncMsg(
        storage === "local"
          ? "File saved on server. Click Update/Publish to show on the website."
          : "Upload successful. Click Update/Publish to publish."
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  }

  async function handleImageFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (!files.length) return;

    for (const file of files) {
      if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
        setUploadError(`"${file.name}" exceeds the 500 MB limit.`);
        return;
      }
    }

    setUploading(true);
    setUploadError("");
    try {
      for (const file of files) {
        const { url, storage } = await uploadAdminImage(file);
        setImages((prev) => [...prev, { id: uid(), url, isPrimary: prev.length === 0 }]);
        setSyncMsg(
          storage === "local"
            ? "File saved on server. Click Update/Publish to show on the website."
            : "Upload successful. Click Update/Publish to publish."
        );
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleVideoFile(file: File) {
    if (!file) return;
    if (file.size > MAX_PRODUCT_VIDEO_SIZE) {
      setUploadError("Video must be 1 GB or smaller.");
      return;
    }
    await uploadFile(file, (url) => {
      setMediaItems((prev) => [...prev, { id: uid(), url, kind: "VIDEO" }]);
    });
  }

  function reorderImagesByDrag(sourceIdx: number, targetIdx: number) {
    if (sourceIdx === targetIdx) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(sourceIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
  }

  function addYoutube() {
    const url = youtubeInput.trim();
    const err = validateYouTubeUrl(url);
    if (err) {
      setUploadError(err);
      return;
    }
    setMediaItems((prev) => [...prev, { id: uid(), url, kind: "YOUTUBE" }]);
    setYoutubeInput("");
    setUploadError("");
  }

  function addInstagram() {
    const url = instagramInput.trim();
    const err = validateInstagramReelUrl(url);
    if (err) {
      setUploadError(err);
      return;
    }
    setMediaItems((prev) => [...prev, { id: uid(), url, kind: "INSTAGRAM" }]);
    setInstagramInput("");
    setUploadError("");
  }

  function addMediaUrl() {
    const url = mediaUrlInput.trim();
    const err = validateMediaUrl(url);
    if (err) {
      setUploadError(err);
      return;
    }
    setMediaItems((prev) => [...prev, { id: uid(), url, kind: inferMediaKind(url) }]);
    setMediaUrlInput("");
    setUploadError("");
  }

  function setPrimaryImage(id: string) {
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === id })));
  }

  function moveImage(id: string, dir: -1 | 1) {
    setImages((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  function moveMedia(id: string, dir: -1 | 1) {
    setMediaItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  function startEdit(p: ProductRow) {
    setEditingId(p.id);
    setShowForm(true);
    setUploadError("");
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      mainCategory: p.mainCategory,
      subCategory: p.subCategory,
      priceRupees: String(p.priceInPaise / 100),
      compareAtRupees: p.compareAtPaise ? String(p.compareAtPaise / 100) : "",
      badge: p.badge ?? "",
      fabric: p.fabric ?? "",
      color: p.color ?? "",
      status: p.status,
      inStock: p.inStock,
      isNewArrival: p.isNewArrival,
    });
    setYoutubeInput("");
    setInstagramInput("");
    setMediaUrlInput("");
    const sortedImages = [...p.images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setImages(
      sortedImages.map((img) => ({
        id: uid(),
        url: img.url,
        isPrimary: img.isPrimary,
      }))
    );
    setMediaItems(
      p.media.map((m) => ({
        id: uid(),
        url: m.url,
        kind: m.kind || inferMediaKind(m.url),
      }))
    );
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setImages([]);
    setMediaItems([]);
    setYoutubeInput("");
    setInstagramInput("");
    setMediaUrlInput("");
    setShowForm(true);
    setUploadError("");
  }

  async function save() {
    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }
    const priceNum = Number(form.priceRupees);
    if (!priceNum || priceNum <= 0) {
      alert("Enter a valid price in ₹");
      return;
    }
    if (!images.length && !editingId) {
      alert("Please upload at least one product photo.");
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description,
      mainCategory: form.mainCategory,
      subCategory: form.subCategory,
      priceInPaise: Math.round(priceNum * 100),
      compareAtPaise: form.compareAtRupees ? Math.round(Number(form.compareAtRupees) * 100) : null,
      badge: form.badge || null,
      fabric: form.fabric || null,
      color: form.color || null,
      images: images.map((img, index) => ({
        url: img.url,
        isPrimary: img.isPrimary,
        sortOrder: index,
      })),
      imageUrl: images.find((i) => i.isPrimary)?.url ?? images[0]?.url ?? "",
      media: mediaItems.map((m, index) => ({
        url: m.url,
        kind: m.kind,
        sortOrder: index,
      })),
      status: form.status,
      inStock: form.inStock,
      isNewArrival: form.isNewArrival,
    };

    try {
      let slug = form.slug;
      if (editingId) {
        const res = await apiFetch(`/admin/products/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        slug = res.product?.slug ?? slug;
      } else {
        const res = await apiFetch("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        slug = res.product?.slug;
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setImages([]);
      setMediaItems([]);
      setSyncMsg(
        `Saved! Status: ${payload.status}. ${payload.status === "PUBLISHED" ? "Live on shop now." : "Set Published to show on website."}`
      );
      load();
      loadCategories();
      if (slug && payload.status === "PUBLISHED") {
        window.open(`/product/${slug}?t=${Date.now()}`, "_blank");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed — please try again");
    }
  }

  async function removeProduct(id: string, name: string) {
    const ok = confirm(
      `Are you sure you want to delete this product?\n\n"${name}" will be removed from the shop.\n\nThis cannot be undone from the admin panel.`
    );
    if (!ok) return;
    try {
      await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
      }
      setSyncMsg("Product deleted from storefront.");
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const mainOptions = mainCategories.length
    ? mainCategories
    : [
        { slug: "BRIDAL", name: "Bridal", kind: "MAIN" },
        { slug: "PARTY_WEAR", name: "Party Wear", kind: "MAIN" },
        { slug: "FESTIVE", name: "Festive", kind: "MAIN" },
        { slug: "NEW_ARRIVALS", name: "New Arrivals", kind: "MAIN" },
      ];

  const subOptions = subCategories.length
    ? subCategories
    : [
        { slug: "ANARKALI", name: "Anarkali", kind: "SUB" },
        { slug: "PAKISTANI", name: "Pakistani", kind: "SUB" },
        { slug: "LEHENGA", name: "Lehenga", kind: "SUB" },
        { slug: "OTHER", name: "Other", kind: "SUB" },
      ];

  return (
    <div className="mt-12 border border-brand-border bg-white p-6">
      {syncMsg && (
        <p className="mb-4 rounded-sm border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose-dark">
          {syncMsg}{" "}
          <a href="/catalog" target="_blank" rel="noopener noreferrer" className="underline">
            View shop →
          </a>
        </p>
      )}
      {uploadError && (
        <p className="mb-4 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{uploadError}</p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="serif text-2xl">Collections & Products</h2>
          <p className="mt-1 text-sm text-brand-muted">
            Upload photos & videos → assign categories → Publish. All media is stored on the server or cloud storage.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="rounded-sm bg-rose px-6 py-2 text-[11px] uppercase tracking-wider text-white"
        >
          + Add product
        </button>
      </div>

      {showForm && (
        <div className="mt-8 border border-rose/30 bg-ivory-2 p-6">
          <h3 className="serif text-xl">{editingId ? "Edit product" : "New product"}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm md:col-span-2">
              Name *
              <input
                className="mt-1 w-full border px-3 py-2"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Slug (optional)
              <input
                className="mt-1 w-full border px-3 py-2"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Badge (e.g. Sale, New)
              <input
                className="mt-1 w-full border px-3 py-2"
                value={form.badge}
                onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Price (₹) *
              <input
                type="number"
                className="mt-1 w-full border px-3 py-2"
                value={form.priceRupees}
                onChange={(e) => setForm((f) => ({ ...f, priceRupees: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              MRP / Compare price (₹)
              <input
                type="number"
                className="mt-1 w-full border px-3 py-2"
                value={form.compareAtRupees}
                onChange={(e) => setForm((f) => ({ ...f, compareAtRupees: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Main category
              <select
                className="mt-1 w-full border px-3 py-2"
                value={form.mainCategory}
                onChange={(e) => setForm((f) => ({ ...f, mainCategory: e.target.value }))}
              >
                {mainOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Style / sub-category
              <select
                className="mt-1 w-full border px-3 py-2"
                value={form.subCategory}
                onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}
              >
                {subOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Fabric
              <input
                className="mt-1 w-full border px-3 py-2"
                value={form.fabric}
                onChange={(e) => setForm((f) => ({ ...f, fabric: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Color
              <input
                className="mt-1 w-full border px-3 py-2"
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              />
            </label>

            {/* PRODUCT MEDIA SECTION */}
            <div className="md:col-span-2 rounded-sm border border-brand-border bg-white p-5 shadow-xs">
              <div className="border-b border-brand-border/60 pb-3">
                <p className="text-base font-medium uppercase tracking-wider text-brand-text">PRODUCT MEDIA</p>
                <p className="mt-1 text-xs text-brand-muted">
                  Manage product images and video in one place. Images appear in the gallery; video plays alongside the product.
                </p>
              </div>

              {/* Side-by-side on desktop (grid-cols-1 lg:grid-cols-2), stacked on mobile */}
              <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* LEFT COLUMN: Product Images */}
                <div className="flex flex-col rounded-sm border border-brand-border/70 bg-ivory/30 p-4">
                  <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-text">
                      Product Images {images.length > 0 && `(${images.length})`}
                    </h3>
                    <span className="text-[11px] text-brand-muted">Max 500 MB per image</span>
                  </div>

                  {/* Drag & Drop / Click Upload Area */}
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverImages(true);
                    }}
                    onDragLeave={() => setDragOverImages(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverImages(false);
                      if (e.dataTransfer.files?.length) {
                        handleImageFiles(e.dataTransfer.files);
                      }
                    }}
                    className={`mt-3 flex flex-col items-center justify-center rounded border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                      dragOverImages
                        ? "border-rose bg-rose/10 text-rose"
                        : "border-brand-border bg-white hover:border-rose/60 hover:bg-ivory-2/50 text-brand-muted"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                      multiple
                      disabled={uploading}
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          handleImageFiles(e.target.files);
                          e.target.value = "";
                        }
                      }}
                      className="hidden"
                    />
                    <svg className="h-8 w-8 text-rose mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs font-medium text-brand-text">Drag &amp; drop images here</p>
                    <p className="text-[11px] text-brand-subtle mt-0.5">or <span className="text-rose underline font-semibold">Click to upload</span></p>
                    <p className="text-[10px] text-brand-subtle mt-1.5">JPG, PNG, WebP, HEIC &bull; Maximum 500 MB per image</p>
                    <p className="text-[10px] text-brand-subtle">Select multiple files at once</p>
                  </label>

                  {/* Uploading progress indicator */}
                  {uploading && (
                    <div className="mt-3 flex items-center justify-center gap-2 rounded bg-rose/10 p-2 text-xs text-rose font-medium animate-pulse">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Uploading media to storage…
                    </div>
                  )}

                  {/* Uploaded Images Thumbnails Grid */}
                  {images.length > 0 ? (
                    <div className="mt-4 flex-1">
                      <div className="flex items-center justify-between text-[11px] text-brand-muted pb-1.5">
                        <span>Drag thumbnails to reorder</span>
                        <span>Click star to set Primary</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                        {images.map((img, idx) => (
                          <div
                            key={img.id}
                            draggable
                            onDragStart={() => setDraggedImgIdx(idx)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (draggedImgIdx !== null) {
                                reorderImagesByDrag(draggedImgIdx, idx);
                                setDraggedImgIdx(null);
                              }
                            }}
                            className={`group relative aspect-[3/4] overflow-hidden rounded border bg-white shadow-2xs transition-all cursor-move ${
                              img.isPrimary
                                ? "border-rose ring-2 ring-rose ring-offset-1"
                                : "border-brand-border/70 hover:border-brand-border"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt="" className="h-full w-full object-cover select-none pointer-events-none" />

                            {/* Primary Badge or Selector Button */}
                            {img.isPrimary ? (
                              <span className="absolute left-1 top-1 rounded bg-rose px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-xs">
                                Primary
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(img.id)}
                                title="Set as primary"
                                className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 hover:bg-rose transition"
                              >
                                Set Primary
                              </button>
                            )}

                            {/* Reorder Arrows & Remove Button Overlay */}
                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/70 px-1 py-1 text-white opacity-0 group-hover:opacity-100 transition">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveImage(img.id, -1);
                                  }}
                                  className="rounded px-1 text-[10px] hover:bg-white/20 disabled:opacity-30"
                                  title="Move left"
                                >
                                  ◀
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === images.length - 1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveImage(img.id, 1);
                                  }}
                                  className="rounded px-1 text-[10px] hover:bg-white/20 disabled:opacity-30"
                                  title="Move right"
                                >
                                  ▶
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImages((prev) => {
                                    const next = prev.filter((i) => i.id !== img.id);
                                    if (img.isPrimary && next.length) next[0].isPrimary = true;
                                    return next;
                                  });
                                }}
                                className="rounded px-1 text-[10px] text-red-300 hover:bg-red-500/30 hover:text-white"
                                title="Remove image"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-1 items-center justify-center rounded border border-dashed border-brand-border/60 bg-white/60 p-4 text-center text-xs text-brand-subtle">
                      No images added yet. Drag or browse images above.
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: Product Video */}
                <div className="flex flex-col rounded-sm border border-brand-border/70 bg-ivory/30 p-4">
                  <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-text">
                      Product Video {mediaItems.length > 0 && `(${mediaItems.length})`}
                    </h3>
                    <span className="text-[11px] text-brand-muted">Max 1 GB</span>
                  </div>

                  {/* Video Drag & Drop / Click Upload Area */}
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverVideo(true);
                    }}
                    onDragLeave={() => setDragOverVideo(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverVideo(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleVideoFile(file);
                    }}
                    className={`mt-3 flex flex-col items-center justify-center rounded border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
                      dragOverVideo
                        ? "border-rose bg-rose/10 text-rose"
                        : "border-brand-border bg-white hover:border-rose/60 hover:bg-ivory-2/50 text-brand-muted"
                    }`}
                  >
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVideoFile(file);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                    <svg className="h-7 w-7 text-rose mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs font-medium text-brand-text">Drag &amp; drop video here</p>
                    <p className="text-[11px] text-brand-subtle mt-0.5">or <span className="text-rose underline font-semibold">Click to upload</span></p>
                    <p className="text-[10px] text-brand-subtle mt-1">MP4, WebM, MOV &bull; Up to 1000 MB (1 GB)</p>
                  </label>

                  {/* Video URL Inputs (YouTube / Instagram Reel / Direct URL) */}
                  <div className="mt-3 rounded border border-brand-border/70 bg-white p-3 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text">Or Add Video Link</p>

                    <div className="flex gap-2">
                      <input
                        className="min-w-0 flex-1 border border-brand-border px-2.5 py-1 text-xs focus:border-rose focus:outline-none"
                        placeholder="YouTube video or Shorts URL"
                        value={youtubeInput}
                        onChange={(e) => setYoutubeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addYoutube();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addYoutube}
                        className="rounded-sm border border-brand-border bg-ivory-2 px-3 py-1 text-xs font-medium uppercase tracking-wider hover:bg-ivory shrink-0"
                      >
                        + YouTube
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        className="min-w-0 flex-1 border border-brand-border px-2.5 py-1 text-xs focus:border-rose focus:outline-none"
                        placeholder="Instagram Reel or Post URL"
                        value={instagramInput}
                        onChange={(e) => setInstagramInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addInstagram();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addInstagram}
                        className="rounded-sm border border-brand-border bg-ivory-2 px-3 py-1 text-xs font-medium uppercase tracking-wider hover:bg-ivory shrink-0"
                      >
                        + Reel
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        className="min-w-0 flex-1 border border-brand-border px-2.5 py-1 text-xs focus:border-rose focus:outline-none"
                        placeholder="Direct video URL (https://…/video.mp4)"
                        value={mediaUrlInput}
                        onChange={(e) => setMediaUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addMediaUrl();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addMediaUrl}
                        className="rounded-sm border border-brand-border bg-ivory-2 px-3 py-1 text-xs font-medium uppercase tracking-wider hover:bg-ivory shrink-0"
                      >
                        + URL
                      </button>
                    </div>
                  </div>

                  {/* Video Previews and Media Item List */}
                  {mediaItems.length > 0 ? (
                    <div className="mt-4 flex-1 space-y-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                        Attached Video ({mediaItems.length})
                      </p>
                      {mediaItems.map((m, index) => {
                        const embed = videoEmbed(m.url);
                        return (
                          <div
                            key={m.id}
                            className="rounded border border-brand-border/70 bg-white p-2.5 shadow-2xs space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="rounded bg-rose/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose">
                                {m.kind}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => moveMedia(m.id, -1)}
                                  className="rounded border border-brand-border px-1.5 py-0.5 text-[10px] hover:bg-ivory-2 disabled:opacity-30"
                                  title="Move up"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  disabled={index === mediaItems.length - 1}
                                  onClick={() => moveMedia(m.id, 1)}
                                  className="rounded border border-brand-border px-1.5 py-0.5 text-[10px] hover:bg-ivory-2 disabled:opacity-30"
                                  title="Move down"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setMediaItems((p) => p.filter((i) => i.id !== m.id))}
                                  className="rounded border border-rose/30 px-2 py-0.5 text-[10px] text-rose hover:bg-rose/10"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            {/* In-Admin Preview of the video/link */}
                            <div className="aspect-video w-full overflow-hidden rounded bg-black">
                              {embed.type === "video" ? (
                                <video
                                  src={embed.src}
                                  controls
                                  playsInline
                                  preload="metadata"
                                  className="h-full w-full object-contain"
                                />
                              ) : embed.type === "instagram" ? (
                                <div className="flex h-full flex-col items-center justify-center p-3 text-center text-white bg-neutral-900">
                                  <p className="text-xs text-white/90">Instagram Reel attached</p>
                                  <a
                                    href={embed.canonicalUrl ?? m.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 rounded border border-white/40 px-3 py-1 text-[10px] uppercase tracking-wider text-white hover:bg-white/10"
                                  >
                                    Preview on Instagram ↗
                                  </a>
                                </div>
                              ) : (
                                <iframe
                                  src={embed.src}
                                  title={`Video ${index + 1}`}
                                  className="h-full w-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  loading="lazy"
                                />
                              )}
                            </div>

                            <p className="break-all font-mono text-[10px] text-brand-subtle">{m.url}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-1 items-center justify-center rounded border border-dashed border-brand-border/60 bg-white/60 p-4 text-center text-xs text-brand-subtle">
                      No video attached. Drag, upload, or paste a link above.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <label className="text-sm md:col-span-2">
              Description
              <textarea
                className="mt-1 w-full border px-3 py-2"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Status
              <select
                className="mt-1 w-full border px-3 py-2"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="PUBLISHED">Published (live)</option>
                <option value="DRAFT">Draft (hidden)</option>
              </select>
            </label>
            <div className="flex flex-col gap-2 pt-6 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))} />
                In stock
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isNewArrival}
                  onChange={(e) => setForm((f) => ({ ...f, isNewArrival: e.target.checked }))}
                />
                Show in New Arrivals
              </label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={save}
              className="rounded-sm bg-rose px-6 py-2 text-[11px] uppercase tracking-wider text-white"
            >
              {editingId ? "Update product" : "Publish product"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="border border-brand-border px-6 py-2 text-[11px] uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b text-[10px] uppercase tracking-wider text-brand-subtle">
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((p) => p.status !== "ARCHIVED")
              .map((p) => (
                <tr key={p.id} className="border-b border-brand-border/60">
                  <td className="py-3 pr-4">
                    <strong>{p.name}</strong>
                    <br />
                    <span className="text-brand-subtle">{p.mainCategory.replace(/_/g, " ")}</span>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-[10px]">
                      {p.images.length > 0 && (
                        <span className="rounded bg-ivory-2 px-1.5 py-0.5 text-brand-muted">
                          📷 {p.images.length} {p.images.length === 1 ? "image" : "images"}
                        </span>
                      )}
                      {p.media && p.media.length > 0 && (
                        <span className="rounded bg-rose/10 px-1.5 py-0.5 font-medium text-rose">
                          ▶ {p.media.length} {p.media.length === 1 ? "video" : "videos"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    ₹{(p.priceInPaise / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 pr-4">{p.inStock ? "Yes" : "Out"}</td>
                  <td className="py-3 pr-4">{p.status}</td>
                  <td className="py-3">
                    {p.status === "PUBLISHED" && (
                      <a href={`/product/${p.slug}`} target="_blank" rel="noopener noreferrer" className="mr-3 text-gold-dark underline">
                        View
                      </a>
                    )}
                    <button type="button" className="mr-3 text-rose underline" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button type="button" className="text-rose underline hover:text-rose-dark" onClick={() => removeProduct(p.id, p.name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="mt-6 text-sm text-brand-muted">No products yet — click Add product.</p>}
      </div>
    </div>
  );
}
