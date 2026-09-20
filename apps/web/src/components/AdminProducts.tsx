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
import {
  MASTER_SIZE_CHART,
  type SizeChartRow,
  type SizeGuideData,
  type MeasurementType,
} from "@/lib/size-guide";

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
  sku?: string | null;
  productType?: string | null;
  fit?: string | null;
  availability?: string | null;
  prepTimeline?: string | null;
  components?: string[];
  fabricDetails?: string | null;
  careInstructions?: string | null;
  deliveryInfo?: string | null;
  customStitchingInfo?: string | null;
  returnsInfo?: string | null;
  customMeasurements?: { fields?: string[] } | null;
  useMasterSizeGuide?: boolean;
  sizeGuide?: SizeGuideData | null;
  images: { url: string; isPrimary: boolean; sortOrder?: number }[];
  media: { url: string; kind: string }[];
};

type CategoryOption = { slug: string; name: string; kind: string };

type ImageItem = { id: string; url: string; isPrimary: boolean };
type MediaItem = { id: string; url: string; kind: string };

const emptyForm = {
  name: "",
  slug: "",
  sku: "",
  productType: "Suit Set",
  fit: "Straight Fit",
  availability: "READY_TO_SHIP",
  prepTimeline: "Ready to ship within 24-48 hours",
  componentsStr: "1 Kurti\n1 Bottom / Pants\n1 Dupatta",
  fabricDetails: "",
  careInstructions: "Dry clean only. Store in a muslin cloth to maintain handcrafted embroidery.",
  deliveryInfo: "Complimentary domestic shipping across India. Standard transit takes 3-5 business days. For international shipping, rates and transit are calculated at checkout.",
  customStitchingInfo: "Custom tailoring available on unstitched and semi-stitched suits. Contact our boutique style assistant on WhatsApp with your measurements.",
  returnsInfo: "Due to bespoke boutique craftsmanship, each piece is quality inspected before dispatch. Alteration assistance is gladly offered.",
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
  // Size Guide States
  const [useMasterSizeGuide, setUseMasterSizeGuide] = useState(true);
  const [sizeGuideTitle, setSizeGuideTitle] = useState("SIZE GUIDE");
  const [sizeGuideSubtitle, setSizeGuideSubtitle] = useState("FIND YOUR PERFECT FIT");
  const [measurementType, setMeasurementType] = useState<MeasurementType>("BODY");
  const [customRows, setCustomRows] = useState<SizeChartRow[]>(MASTER_SIZE_CHART);
  const [customNotes, setCustomNotes] = useState<string>("");

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
      sku: p.sku ?? "",
      productType: p.productType ?? "Suit Set",
      fit: p.fit ?? "Straight Fit",
      availability: p.availability ?? "READY_TO_SHIP",
      prepTimeline: p.prepTimeline ?? "",
      componentsStr: Array.isArray(p.components) && p.components.length ? p.components.join("\n") : "",
      fabricDetails: p.fabricDetails ?? "",
      careInstructions: p.careInstructions ?? "",
      deliveryInfo: p.deliveryInfo ?? "",
      customStitchingInfo: p.customStitchingInfo ?? "",
      returnsInfo: p.returnsInfo ?? "",
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
    // Populate Size Guide state
    const useMaster = p.useMasterSizeGuide !== false;
    setUseMasterSizeGuide(useMaster);
    if (p.sizeGuide && typeof p.sizeGuide === "object") {
      const g = p.sizeGuide as SizeGuideData;
      setSizeGuideTitle(g.title || "SIZE GUIDE");
      setSizeGuideSubtitle(g.subtitle || "FIND YOUR PERFECT FIT");
      setMeasurementType(g.measurementType === "GARMENT" ? "GARMENT" : "BODY");
      setCustomRows(Array.isArray(g.sizeChart) && g.sizeChart.length ? g.sizeChart : MASTER_SIZE_CHART);
      setCustomNotes(Array.isArray(g.notes) ? g.notes.join("\n") : "");
    } else {
      setSizeGuideTitle("SIZE GUIDE");
      setSizeGuideSubtitle("FIND YOUR PERFECT FIT");
      setMeasurementType("BODY");
      setCustomRows(MASTER_SIZE_CHART);
      setCustomNotes("");
    }
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setImages([]);
    setMediaItems([]);
    setYoutubeInput("");
    setInstagramInput("");
    setMediaUrlInput("");
    setUseMasterSizeGuide(true);
    setSizeGuideTitle("SIZE GUIDE");
    setSizeGuideSubtitle("FIND YOUR PERFECT FIT");
    setMeasurementType("BODY");
    setCustomRows(MASTER_SIZE_CHART);
    setCustomNotes("");
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
      sku: form.sku.trim() || null,
      productType: form.productType.trim() || null,
      fit: form.fit || "Straight Fit",
      availability: form.availability || "READY_TO_SHIP",
      prepTimeline: form.prepTimeline.trim() || null,
      components: form.componentsStr.trim()
        ? form.componentsStr.split("\n").map((c) => c.trim()).filter(Boolean)
        : [],
      fabricDetails: form.fabricDetails.trim() || null,
      careInstructions: form.careInstructions.trim() || null,
      deliveryInfo: form.deliveryInfo.trim() || null,
      customStitchingInfo: form.customStitchingInfo.trim() || null,
      returnsInfo: form.returnsInfo.trim() || null,
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
      useMasterSizeGuide,
      sizeGuide: useMasterSizeGuide
        ? null
        : {
            title: sizeGuideTitle.trim() || "SIZE GUIDE",
            subtitle: sizeGuideSubtitle.trim() || "PRODUCT MEASUREMENTS",
            measurementType,
            sizeChart: customRows,
            notes: customNotes.trim()
              ? customNotes.split("\n").map((n) => n.trim()).filter(Boolean)
              : undefined,
          },
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

            {/* PRODUCT IDENTITY & AVAILABILITY */}
            <label className="text-sm">
              SKU (Stock Keeping Unit)
              <input
                className="mt-1 w-full border px-3 py-2 font-mono uppercase"
                placeholder="e.g. SET-LUM-01"
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value.toUpperCase() }))}
              />
            </label>
            <label className="text-sm">
              Product Type
              <input
                className="mt-1 w-full border px-3 py-2"
                placeholder="e.g. Kurti, Farshi Set, Sharara, Lehenga"
                value={form.productType}
                onChange={(e) => setForm((f) => ({ ...f, productType: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Silhouette / Fit
              <select
                className="mt-1 w-full border px-3 py-2"
                value={form.fit}
                onChange={(e) => setForm((f) => ({ ...f, fit: e.target.value }))}
              >
                <option value="Straight Fit">Straight Fit</option>
                <option value="Fitted">Fitted</option>
                <option value="A-Line">A-Line</option>
                <option value="Flared">Flared</option>
                <option value="Relaxed">Relaxed</option>
                <option value="Oversized">Oversized</option>
              </select>
            </label>
            <label className="text-sm">
              Availability
              <select
                className="mt-1 w-full border px-3 py-2"
                value={form.availability}
                onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))}
              >
                <option value="READY_TO_SHIP">Ready to Ship (Dispatches in 24–48h)</option>
                <option value="MADE_TO_ORDER">Made to Order (Bespoke tailoring timeline)</option>
                <option value="CUSTOM">Custom Tailored (Crafted to measurements)</option>
                <option value="LOW_STOCK">Low Stock (Limited inventory remaining)</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </label>
            <label className="text-sm md:col-span-2">
              Preparation / Dispatch Timeline
              <input
                className="mt-1 w-full border px-3 py-2"
                placeholder="e.g. Ready to ship in 24–48 hours OR Made to order: 15–20 days"
                value={form.prepTimeline}
                onChange={(e) => setForm((f) => ({ ...f, prepTimeline: e.target.value }))}
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

            {/* SIZE GUIDE SECTION */}
            <div className="md:col-span-2 rounded-sm border border-brand-border bg-white p-5 shadow-xs">
              <div className="border-b border-brand-border/60 pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-base font-medium uppercase tracking-wider text-brand-text">SIZE GUIDE CONFIGURATION</p>
                  <p className="mt-1 text-xs text-brand-muted">
                    Choose whether this product follows the Shaan-e-Taj Master Size Guide or custom product-specific measurements.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-muted">Use Master Size Guide?</span>
                  <button
                    type="button"
                    onClick={() => setUseMasterSizeGuide(!useMasterSizeGuide)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      useMasterSizeGuide ? "bg-rose" : "bg-neutral-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        useMasterSizeGuide ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-semibold text-rose-dark">
                    {useMasterSizeGuide ? "YES (Master)" : "NO (Custom)"}
                  </span>
                </div>
              </div>

              {!useMasterSizeGuide ? (
                <div className="mt-5 space-y-5 rounded-sm border border-rose/30 bg-ivory/40 p-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="text-xs">
                      Guide Title
                      <input
                        className="mt-1 w-full border border-brand-border bg-white px-3 py-1.5 text-xs"
                        value={sizeGuideTitle}
                        onChange={(e) => setSizeGuideTitle(e.target.value)}
                        placeholder="e.g. SIZE GUIDE"
                      />
                    </label>
                    <label className="text-xs">
                      Subtitle
                      <input
                        className="mt-1 w-full border border-brand-border bg-white px-3 py-1.5 text-xs"
                        value={sizeGuideSubtitle}
                        onChange={(e) => setSizeGuideSubtitle(e.target.value)}
                        placeholder="e.g. READY-MADE KURTI MEASUREMENTS"
                      />
                    </label>
                    <label className="text-xs">
                      Measurement Type
                      <select
                        className="mt-1 w-full border border-brand-border bg-white px-3 py-1.5 text-xs"
                        value={measurementType}
                        onChange={(e) => setMeasurementType(e.target.value as MeasurementType)}
                      >
                        <option value="BODY">Body Measurements (Customer Body Size)</option>
                        <option value="GARMENT">Garment Measurements (Finished Outfit Size)</option>
                      </select>
                    </label>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-text">
                        Custom Size Chart Rows (Measurements in Inches)
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomRows(MASTER_SIZE_CHART)}
                          className="rounded-xs border border-brand-border bg-white px-2.5 py-1 text-[10px] uppercase tracking-wider text-brand-muted hover:bg-ivory-2"
                        >
                          Reset to Master
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCustomRows((prev) => [
                              ...prev,
                              { size: "Custom", ukIndSize: "-", bust: 38, waist: 32, hip: 40 },
                            ])
                          }
                          className="rounded-xs bg-rose px-2.5 py-1 text-[10px] uppercase tracking-wider text-white"
                        >
                          + Add Row
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded border border-brand-border bg-white">
                      <table className="w-full min-w-[620px] text-xs">
                        <thead>
                          <tr className="border-b border-brand-border bg-ivory-2 text-[10px] uppercase tracking-wider text-brand-muted">
                            <th className="p-2 text-left">Size</th>
                            <th className="p-2 text-left">UK/Ind</th>
                            <th className="p-2 text-left">Bust (in)</th>
                            <th className="p-2 text-left">Waist (in)</th>
                            <th className="p-2 text-left">Hip (in)</th>
                            <th className="p-2 text-left">Length (in)</th>
                            <th className="p-2 text-left">Shoulder (in)</th>
                            <th className="p-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/60">
                          {customRows.map((r, idx) => (
                            <tr key={idx} className="hover:bg-ivory/40">
                              <td className="p-1.5">
                                <input
                                  className="w-16 border px-1.5 py-1 font-medium"
                                  value={r.size}
                                  onChange={(e) => {
                                    const next = [...customRows];
                                    next[idx] = { ...next[idx], size: e.target.value };
                                    setCustomRows(next);
                                  }}
                                />
                              </td>
                              <td className="p-1.5">
                                <input
                                  className="w-14 border px-1.5 py-1 font-mono text-center"
                                  value={r.ukIndSize}
                                  onChange={(e) => {
                                    const next = [...customRows];
                                    next[idx] = { ...next[idx], ukIndSize: e.target.value };
                                    setCustomRows(next);
                                  }}
                                />
                              </td>
                              <td className="p-1.5">
                                <input
                                  type="number"
                                  step="0.5"
                                  className="w-16 border px-1.5 py-1"
                                  value={r.bust}
                                  onChange={(e) => {
                                    const next = [...customRows];
                                    next[idx] = { ...next[idx], bust: Number(e.target.value) };
                                    setCustomRows(next);
                                  }}
                                />
                              </td>
                              <td className="p-1.5">
                                <input
                                  type="number"
                                  step="0.5"
                                  className="w-16 border px-1.5 py-1"
                                  value={r.waist}
                                  onChange={(e) => {
                                    const next = [...customRows];
                                    next[idx] = { ...next[idx], waist: Number(e.target.value) };
                                    setCustomRows(next);
                                  }}
                                />
                              </td>
                              <td className="p-1.5">
                                <input
                                  type="number"
                                  step="0.5"
                                  className="w-16 border px-1.5 py-1"
                                  value={r.hip}
                                  onChange={(e) => {
                                    const next = [...customRows];
                                    next[idx] = { ...next[idx], hip: Number(e.target.value) };
                                    setCustomRows(next);
                                  }}
                                />
                              </td>
                              <td className="p-1.5">
                                <input
                                  type="number"
                                  step="0.5"
                                  placeholder="opt"
                                  className="w-16 border px-1.5 py-1"
                                  value={r.topLength ?? ""}
                                  onChange={(e) => {
                                    const next = [...customRows];
                                    next[idx] = {
                                      ...next[idx],
                                      topLength: e.target.value ? Number(e.target.value) : undefined,
                                    };
                                    setCustomRows(next);
                                  }}
                                />
                              </td>
                              <td className="p-1.5">
                                <input
                                  type="number"
                                  step="0.5"
                                  placeholder="opt"
                                  className="w-16 border px-1.5 py-1"
                                  value={r.shoulder ?? ""}
                                  onChange={(e) => {
                                    const next = [...customRows];
                                    next[idx] = {
                                      ...next[idx],
                                      shoulder: e.target.value ? Number(e.target.value) : undefined,
                                    };
                                    setCustomRows(next);
                                  }}
                                />
                              </td>
                              <td className="p-1.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => setCustomRows((prev) => prev.filter((_, i) => i !== idx))}
                                  disabled={customRows.length <= 1}
                                  className="rounded text-[11px] text-red-600 hover:underline disabled:opacity-30"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <label className="block text-xs">
                    Custom Notes / Policy Disclaimers (one per line)
                    <textarea
                      rows={2}
                      className="mt-1 w-full border border-brand-border bg-white px-3 py-1.5 text-xs"
                      placeholder="e.g. This outfit includes an extra 2-inch margin inside for easy loosening."
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                    />
                  </label>
                </div>
              ) : (
                <div className="mt-3 rounded border border-brand-border/60 bg-ivory/50 p-3 text-xs text-brand-muted">
                  ✓ This product will display the standard <strong>Shaan-e-Taj Master Size Guide</strong> (XS to 3XL, UK 6–18 body measurements, height length guide, and fit guide silhouettes).
                </div>
              )}
            </div>

            <label className="text-sm md:col-span-2">
              Description (Silhouette, Craftsmanship & Detailing)
              <textarea
                className="mt-1 w-full border px-3 py-2"
                rows={3}
                placeholder="Editorial description of the silhouette, artisan handwork, embroidery, and styling..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>

            <label className="text-sm md:col-span-2">
              What&apos;s Included / Components (One per line)
              <textarea
                className="mt-1 w-full border px-3 py-2"
                rows={3}
                placeholder={"1 Kurti\n1 Bottom / Pants\n1 Dupatta"}
                value={form.componentsStr}
                onChange={(e) => setForm((f) => ({ ...f, componentsStr: e.target.value }))}
              />
            </label>

            <label className="text-sm md:col-span-2">
              Fabric & Details
              <textarea
                className="mt-1 w-full border px-3 py-2"
                rows={2}
                placeholder="e.g. Pure Chanderi Silk with Zari embroidery and organza dupatta border..."
                value={form.fabricDetails}
                onChange={(e) => setForm((f) => ({ ...f, fabricDetails: e.target.value }))}
              />
            </label>

            <label className="text-sm">
              Care Instructions
              <textarea
                className="mt-1 w-full border px-3 py-2"
                rows={2}
                placeholder="e.g. Dry clean only. Protect intricate zardozi work."
                value={form.careInstructions}
                onChange={(e) => setForm((f) => ({ ...f, careInstructions: e.target.value }))}
              />
            </label>

            <label className="text-sm">
              Delivery & Shipping Information
              <textarea
                className="mt-1 w-full border px-3 py-2"
                rows={2}
                placeholder="e.g. Domestic dispatch in 3-5 days. International shipping calculated at checkout."
                value={form.deliveryInfo}
                onChange={(e) => setForm((f) => ({ ...f, deliveryInfo: e.target.value }))}
              />
            </label>

            <label className="text-sm">
              Custom Stitching Information
              <textarea
                className="mt-1 w-full border px-3 py-2"
                rows={2}
                placeholder="e.g. Bespoke measurements tailored by master artisans in Jalandhar."
                value={form.customStitchingInfo}
                onChange={(e) => setForm((f) => ({ ...f, customStitchingInfo: e.target.value }))}
              />
            </label>

            <label className="text-sm">
              Returns & Exchanges Policy
              <textarea
                className="mt-1 w-full border px-3 py-2"
                rows={2}
                placeholder="e.g. Quality inspected prior to dispatch. Alteration support gladly provided."
                value={form.returnsInfo}
                onChange={(e) => setForm((f) => ({ ...f, returnsInfo: e.target.value }))}
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
