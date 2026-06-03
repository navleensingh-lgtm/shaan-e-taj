"use client";

import { signOut } from "next-auth/react";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-sm border border-brand-border px-4 py-2 text-[11px] uppercase tracking-wider text-brand-muted transition hover:border-rose hover:text-rose-dark"
    >
      Log out
    </button>
  );
}
