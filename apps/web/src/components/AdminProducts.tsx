"use client";

import { useEffect, useState } from "react";
import { apiFetch, uploadAdminImage } from "@/lib/api-client";

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
  images: { url: string; isPrimary: boolean }[];
};

const MAIN_CATEGORIES = ["BRIDAL", "PARTY_WEAR", "FESTIVE", "NEW_ARRIVALS"];
const SUB_CATEGORIES = [
  "ANARKALI",
  "SHARARA",
  "GHARARA",
  "PAKISTANI",
  "INDO_WESTERN",
  "LEHENGA",
  "KURTI_SET",
  "SALWAR_SUIT",
  "DUPATTA",
  "OTHER",
];

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
  imageUrl: "",
  status: "PUBLISHED",
  inStock: true,
  isNewArrival: true,
};

export function AdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  async function onImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSyncMsg("");
    try {
      const { url, storage } = await uploadAdminImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
      setSyncMsg(
        storage === "r2"
          ? "Photo uploaded to cloud. Click Update/Publish to show on website."
          : "Photo saved. Click Update/Publish — then refresh shop page."
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function load() {
    apiFetch("/admin/products").then((d) => setProducts(d.products ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p: ProductRow) {
    setEditingId(p.id);
    setShowForm(true);
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
      imageUrl: p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url ?? "",
      status: p.status,
      inStock: p.inStock,
      isNewArrival: p.isNewArrival,
    });
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  async function save() {
    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }
    if (!form.imageUrl && !editingId) {
      alert("Please upload a photo first (button below).");
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description,
      mainCategory: form.mainCategory,
      subCategory: form.subCategory,
      priceInPaise: Math.round(Number(form.priceRupees) * 100),
      compareAtPaise: form.compareAtRupees
        ? Math.round(Number(form.compareAtRupees) * 100)
        : null,
      badge: form.badge || null,
      fabric: form.fabric || null,
      color: form.color || null,
      imageUrl: form.imageUrl || undefined,
      status: form.status,
      inStock: form.inStock,
      isNewArrival: form.isNewArrival,
    };

    if (editingId) {
      await apiFetch(`/admin/products/${editingId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } else {
      await apiFetch("/admin/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setSyncMsg("Saved — website updated. Open Catalog to verify.");
    load();
  }

  async function archive(id: string) {
    if (!confirm("Archive this product? It will be hidden from the shop.")) return;
    await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
    load();
  }

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="serif text-2xl">Collections & Products</h2>
          <p className="mt-1 text-sm text-brand-muted">
            Upload photo → fill details → Publish. Changes sync to website instantly.
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
              MRP / Compare price (₹) — shows discount
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
                {MAIN_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Style
              <select
                className="mt-1 w-full border px-3 py-2"
                value={form.subCategory}
                onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}
              >
                {SUB_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ")}
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
              <p className="text-sm font-medium text-brand-text">Product photo *</p>
              <p className="mt-1 text-xs text-brand-muted">
                Upload from phone/gallery (JPG/PNG, max 4 MB). Customers see this on catalog.
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading}
                onChange={onImageFile}
                className="mt-3 block w-full text-sm"
              />
              {uploading && <p className="mt-2 text-sm text-rose">Uploading…</p>}
              {form.imageUrl && (
                <div className="mt-4 flex flex-wrap items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="h-40 w-32 rounded-sm object-cover border"
                  />
                  <p className="max-w-xs break-all text-xs text-brand-subtle">{form.imageUrl.slice(0, 80)}…</p>
                </div>
              )}
              <label className="mt-4 block text-xs text-brand-muted">
                Or paste image link
                <input
                  className="mt-1 w-full border px-3 py-2 text-sm"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </label>
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
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
                />
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
                    {p.compareAtPaise && p.compareAtPaise > p.priceInPaise && (
                      <span className="ml-1 text-brand-subtle line-through">
                        ₹{(p.compareAtPaise / 100).toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">{p.inStock ? "Yes" : "Out"}</td>
                  <td className="py-3 pr-4">{p.status}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="mr-3 text-rose underline"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-brand-subtle underline"
                      onClick={() => archive(p.id)}
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="mt-6 text-sm text-brand-muted">No products yet — click Add product.</p>
        )}
      </div>
    </div>
  );
}
