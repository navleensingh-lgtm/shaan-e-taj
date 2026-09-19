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

  async function onImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
      setUploadError("Image must be 500 MB or smaller.");
      e.target.value = "";
      return;
    }
    await uploadFile(file, (url) => {
      setImages((prev) => {
        const next = [...prev, { id: uid(), url, isPrimary: prev.length === 0 }];
        return next;
      });
    });
    e.target.value = "";
  }

  async function onVideoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PRODUCT_VIDEO_SIZE) {
      setUploadError("Video must be 1 GB or smaller.");
      e.target.value = "";
      return;
    }
    await uploadFile(file, (url) => {
      setMediaItems((prev) => [...prev, { id: uid(), url, kind: "VIDEO" }]);
    });
    e.target.value = "";
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

            <div className="md:col-span-2 rounded-sm border border-brand-border bg-white p-4">
              <p className="text-sm font-medium text-brand-text">Product images *</p>
              <p className="mt-1 text-xs text-brand-muted">
                JPG, PNG, WebP, HEIC — max 500 MB each. Set one as primary (catalog thumbnail).
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                disabled={uploading}
                onChange={onImageFile}
                className="mt-3 block w-full text-sm"
              />
              {uploading && <p className="mt-2 text-sm text-rose">Uploading…</p>}
              <ul className="mt-4 space-y-3">
                {images.map((img, index) => (
                  <li key={img.id} className="flex flex-wrap items-center gap-3 rounded border border-brand-border/60 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="h-20 w-16 rounded object-cover border" />
                    <div className="min-w-0 flex-1 text-xs text-brand-subtle break-all">{img.url.slice(0, 72)}…</div>
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="radio"
                        name="primary-image"
                        checked={img.isPrimary}
                        onChange={() => setPrimaryImage(img.id)}
                      />
                      Primary
                    </label>
                    <button type="button" className="text-xs underline" onClick={() => moveImage(img.id, -1)} disabled={index === 0}>
                      ↑
                    </button>
                    <button
                      type="button"
                      className="text-xs underline"
                      onClick={() => moveImage(img.id, 1)}
                      disabled={index === images.length - 1}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="text-xs text-rose underline"
                      onClick={() =>
                        setImages((prev) => {
                          const next = prev.filter((i) => i.id !== img.id);
                          if (img.isPrimary && next.length) next[0].isPrimary = true;
                          return next;
                        })
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 rounded-sm border border-brand-border bg-white p-4">
              <p className="text-sm font-medium text-brand-text">Videos & social media</p>
              <p className="mt-1 text-xs text-brand-muted">
                Upload MP4/WebM/MOV (1000 MB max), or add YouTube / Shorts / Instagram Reel links.
              </p>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                disabled={uploading}
                onChange={onVideoFile}
                className="mt-3 block w-full text-sm"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <input
                  className="min-w-[200px] flex-1 border px-3 py-2 text-sm"
                  placeholder="YouTube or Shorts URL"
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                />
                <button type="button" onClick={addYoutube} className="border border-brand-border px-4 py-2 text-xs uppercase">
                  Add YouTube
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  className="min-w-[200px] flex-1 border px-3 py-2 text-sm"
                  placeholder="Instagram Reel URL"
                  value={instagramInput}
                  onChange={(e) => setInstagramInput(e.target.value)}
                />
                <button type="button" onClick={addInstagram} className="border border-brand-border px-4 py-2 text-xs uppercase">
                  Add Reel
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  className="min-w-[200px] flex-1 border px-3 py-2 text-sm"
                  placeholder="Direct video URL (https://…)"
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                />
                <button type="button" onClick={addMediaUrl} className="border border-brand-border px-4 py-2 text-xs uppercase">
                  Add URL
                </button>
              </div>
              <ul className="mt-4 space-y-2">
                {mediaItems.map((m, index) => (
                  <li key={m.id} className="flex flex-wrap items-center gap-2 rounded border border-brand-border/60 p-2 text-xs">
                    <span className="rounded bg-ivory-2 px-2 py-0.5 uppercase tracking-wider text-brand-subtle">{m.kind}</span>
                    <span className="min-w-0 flex-1 break-all">{m.url.slice(0, 80)}</span>
                    <button type="button" className="underline" onClick={() => moveMedia(m.id, -1)} disabled={index === 0}>
                      ↑
                    </button>
                    <button type="button" className="underline" onClick={() => moveMedia(m.id, 1)} disabled={index === mediaItems.length - 1}>
                      ↓
                    </button>
                    <button type="button" className="text-rose underline" onClick={() => setMediaItems((p) => p.filter((i) => i.id !== m.id))}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
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
