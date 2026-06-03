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
