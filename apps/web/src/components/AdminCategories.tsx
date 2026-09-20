"use client";

import { useEffect, useState } from "react";
import { apiFetch, uploadAdminImage } from "@/lib/api-client";
import { AdminConfirmModal } from "@/components/AdminConfirmModal";

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  kind: "MAIN" | "SUB";
  sortOrder: number;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  kind: "MAIN" as "MAIN" | "SUB",
  sortOrder: "0",
};

export function AdminCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    apiFetch("/admin/categories")
      .then((d) => setCategories(d.categories ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load categories"));
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(c: CategoryRow) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      imageUrl: c.imageUrl ?? "",
      kind: c.kind,
      sortOrder: String(c.sortOrder),
    });
    setError("");
    setMessage("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await uploadAdminImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
      setMessage("Category image uploaded. Save to apply.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.name.trim()) {
      setError("Category name is required");
      return;
    }
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      kind: form.kind,
      sortOrder: Number(form.sortOrder) || 0,
    };
    try {
      if (editingId) {
        await apiFetch(`/admin/categories/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage("Category updated. It will appear across the shop automatically.");
      } else {
        await apiFetch("/admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Category created. Assign products to show items in this collection.");
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function confirmRemoveCategory() {
    if (!deleteTarget) return;
    setError("");
    setDeleting(true);
    try {
      await apiFetch(`/admin/categories/${deleteTarget.id}`, { method: "DELETE" });
      setMessage(`Deleted "${deleteTarget.name}".`);
      if (editingId === deleteTarget.id) resetForm();
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const main = categories.filter((c) => c.kind === "MAIN");
  const sub = categories.filter((c) => c.kind === "SUB");

  return (
    <div className="mt-12 border border-brand-border bg-white p-6">
      <h2 className="serif text-2xl">Categories</h2>
      <p className="mt-1 text-sm text-brand-muted">
        Create collections and styles. Products use category slugs — new categories appear in catalog filters automatically.
      </p>

      {message && (
        <p className="mt-4 rounded-sm border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose-dark">{message}</p>
      )}
      {error && (
        <p className="mt-4 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <form onSubmit={save} className="mt-8 grid gap-4 border border-brand-border bg-ivory-2 p-6 md:grid-cols-2">
        <h3 className="serif text-xl md:col-span-2">{editingId ? "Edit category" : "New category"}</h3>
        <label className="text-sm">
          Name *
          <input
            className="mt-1 w-full border px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </label>
        <label className="text-sm">
          Slug (optional, auto from name)
          <input
            className="mt-1 w-full border px-3 py-2 uppercase"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="SUMMER_COLLECTION"
          />
        </label>
        <label className="text-sm">
          Type
          <select
            className="mt-1 w-full border px-3 py-2"
            value={form.kind}
            onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as "MAIN" | "SUB" }))}
          >
            <option value="MAIN">Main collection</option>
            <option value="SUB">Style / sub-category</option>
          </select>
        </label>
        <label className="text-sm">
          Sort order
          <input
            type="number"
            className="mt-1 w-full border px-3 py-2"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
          />
        </label>
        <label className="text-sm md:col-span-2">
          Description (optional)
          <textarea
            className="mt-1 w-full border px-3 py-2"
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </label>
        <div className="md:col-span-2">
          <p className="text-sm font-medium">Category image (optional)</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={onImageFile}
            className="mt-2 block w-full text-sm"
          />
          {form.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="" className="mt-3 h-24 w-24 rounded object-cover border" />
          )}
        </div>
        <div className="flex gap-3 md:col-span-2">
          <button type="submit" className="rounded-sm bg-rose px-6 py-2 text-[11px] uppercase tracking-wider text-white">
            {editingId ? "Update category" : "Create category"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="border border-brand-border px-6 py-2 text-[11px] uppercase">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-brand-subtle">Main collections</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {main.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-2 border-b border-brand-border/60 py-2">
                <span>
                  <strong>{c.name}</strong>
                  <br />
                  <span className="text-brand-subtle">{c.slug}</span>
                </span>
                <span className="shrink-0 space-x-2">
                  <button type="button" className="text-rose underline" onClick={() => startEdit(c)}>
                    Edit
                  </button>
                  <button type="button" className="text-rose underline" onClick={() => setDeleteTarget(c)}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-brand-subtle">Styles</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {sub.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-2 border-b border-brand-border/60 py-2">
                <span>
                  <strong>{c.name}</strong>
                  <br />
                  <span className="text-brand-subtle">{c.slug}</span>
                </span>
                <span className="shrink-0 space-x-2">
                  <button type="button" className="text-rose underline" onClick={() => startEdit(c)}>
                    Edit
                  </button>
                  <button type="button" className="text-rose underline" onClick={() => setDeleteTarget(c)}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Category"
        message={
          deleteTarget
            ? `Are you sure you want to delete category "${deleteTarget.name}" (${deleteTarget.slug})?\n\nThis action cannot be undone. You can only delete categories that have no active products attached.`
            : ""
        }
        confirmLabel="Delete Category"
        cancelLabel="Keep Category"
        variant="danger"
        isLoading={deleting}
        onConfirm={confirmRemoveCategory}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
