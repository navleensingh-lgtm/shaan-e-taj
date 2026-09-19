"use client";

import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function resolveUrl(path: string): string {
  if (
    path.startsWith("/admin") ||
    path.startsWith("/orders") ||
    path.startsWith("/account")
  ) {
    return `/api${path}`;
  }
  return `${API_URL}${path}`;
}

export async function apiFetch(path: string, init?: RequestInit) {
  const session = await getSession();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (session?.user?.id) {
    headers.set("x-user-id", session.user.id);
  }
  const res = await fetch(resolveUrl(path), { ...init, headers, credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? res.statusText);
  return data;
}

/** Upload product media (image or video) for admin. Returns public URL and storage. */
export async function uploadAdminImage(file: File): Promise<{ url: string; storage: string; kind?: string }> {
  const session = await getSession();

  // Try direct-to-storage presigned upload first (supports files up to 500 MB / 1 GB without proxy/body size limits)
  try {
    const params = new URLSearchParams({
      filename: file.name,
      contentType: file.type,
      size: String(file.size),
    });

    const initRes = await fetch(`/api/admin/upload?${params.toString()}`, {
      method: "GET",
      credentials: "same-origin",
      headers: session?.user?.id ? { "x-user-id": session.user.id } : {},
    });

    if (initRes.ok) {
      const initData = await initRes.json();
      if (initData.direct && initData.uploadUrl) {
        const uploadRes = await fetch(initData.uploadUrl, {
          method: initData.method || "PUT",
          headers: initData.headers || {},
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error(`Direct storage upload failed with status ${uploadRes.status}`);
        }

        return {
          url: initData.publicUrl,
          storage: initData.storage,
          kind: initData.kind,
        };
      }
    } else {
      const errData = await initRes.json().catch(() => ({}));
      if (errData.error) {
        throw new Error(errData.error);
      }
    }
  } catch (err) {
    // If the error was a validation error from GET /api/admin/upload, don't attempt fallback
    if (err instanceof Error && (err.message.includes("smaller") || err.message.includes("Use JPG"))) {
      throw err;
    }
    console.warn("[uploadAdminImage] Direct upload failed, attempting multipart fallback:", err);
  }

  // Multipart fallback (local storage development / single server)
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: form,
    credentials: "same-origin",
    headers: session?.user?.id ? { "x-user-id": session.user.id } : {},
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return data;
}
