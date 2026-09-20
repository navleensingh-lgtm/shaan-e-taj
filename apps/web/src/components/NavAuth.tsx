"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
export function NavAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="hidden h-8 w-14 sm:inline-block" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="flex min-h-[44px] items-center px-1 text-[11px] uppercase tracking-[0.12em] text-brand-muted transition hover:text-rose-dark"
      >
        Login
      </Link>
    );
  }

  const label =
    session.user.name?.split(" ")[0] ??
    session.user.email?.split("@")[0] ??
    "Account";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/account"
        className="hidden min-h-[44px] items-center text-[11px] uppercase tracking-[0.12em] text-brand-muted transition hover:text-rose-dark sm:inline-flex"
        title="My account"
      >
        {label}
      </Link>
      <Link
        href="/account"
        className="flex min-h-[44px] items-center text-[11px] uppercase tracking-[0.12em] text-brand-muted transition hover:text-rose-dark sm:hidden"
      >
        Account
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex min-h-[44px] items-center text-[11px] uppercase tracking-[0.12em] text-brand-subtle hover:text-rose-dark"
      >
        Log out
      </button>
    </div>
  );
}
