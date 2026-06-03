"use client";

import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function resolveUrl(path: string): string {
  if (path.startsWith("/admin")) {
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

/** Upload product image (admin). Returns public URL for catalog. */
export async function uploadAdminImage(file: File): Promise<{ url: string; storage: string }> {
  const session = await getSession();
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
