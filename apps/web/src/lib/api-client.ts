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

export async function apiFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const session = await getSession();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (session?.user?.id) {
    headers.set("x-user-id", session.user.id);
  }
  const res = await fetch(resolveUrl(path), { ...init, headers, credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? res.statusText);
  return data as T;
}

/** Upload product media (image or video) for admin. Returns public URL and storage. */
export async function uploadAdminImage(file: File): Promise<{ url: string; storage: string; kind?: string }> {
  const session = await getSession();

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
  const initData = await initRes.json().catch(() => ({}));
  if (!initRes.ok) throw new Error(initData.error ?? "R2 upload initialization failed");
  if (!initData.direct || !initData.uploadUrl || !initData.publicUrl) {
    throw new Error("R2 upload is not configured.");
  }

  const uploadRes = await fetch(initData.uploadUrl, {
    method: initData.method || "PUT",
    headers: initData.headers || {},
    body: file,
  });
  if (!uploadRes.ok) {
    throw new Error(`R2 upload failed with status ${uploadRes.status}`);
  }
  return {
    url: initData.publicUrl,
    storage: initData.storage,
    kind: initData.kind,
  };
}
