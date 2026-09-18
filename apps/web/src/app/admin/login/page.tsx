"use client";

import { Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole } from "@shaan-e-taj/database";
import { postLoginPath } from "@/lib/post-login";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = params.get("callbackUrl") ?? "/admin";

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === UserRole.ADMIN) {
      router.replace(postLoginPath(session.user.role, callbackUrl, "admin"));
    }
  }, [status, session, router, callbackUrl]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    const password = String(fd.get("password") ?? "");

    if (!email || !password) {
      setError("Email and password required");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error("Invalid admin email or password");
      }

      const meRes = await fetch("/api/auth/session");
      const me = await meRes.json();

      if (me?.user?.role !== UserRole.ADMIN) {
        await fetch("/api/auth/signout", { method: "POST" });
        throw new Error("This account is not authorized for admin access");
      }

      router.push(postLoginPath(UserRole.ADMIN, callbackUrl, "admin"));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-5 py-20">
      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-gold-dark">Staff only</p>
      <h1 className="serif mt-2 text-center text-4xl">Admin Sign In</h1>
      <p className="mt-3 text-center text-sm text-brand-muted">
        Manage products, orders & store settings.
      </p>
      <form onSubmit={onSubmit} className="mt-10 space-y-4">
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="Admin email"
          className="w-full border border-brand-border bg-white px-4 py-3 text-sm"
        />
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          className="w-full border border-brand-border bg-white px-4 py-3 text-sm"
        />
        {error && <p className="text-sm text-rose">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-brand-text py-3 text-[11px] uppercase tracking-wider text-ivory disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Enter admin portal"}
        </button>
      </form>
      <p className="mt-8 text-center text-xs text-brand-subtle">
        <Link href="/">← Back to website</Link>
        {" · "}
        <Link href="/login" className="underline">
          Customer login
        </Link>
      </p>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center">Loading…</p>}>
      <AdminLoginForm />
    </Suspense>
  );
}
