"use client";

import { Suspense } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole } from "@shaan-e-taj/database";
import { postLoginPath } from "@/lib/post-login";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = params.get("callbackUrl");

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    if (session.user.role === UserRole.ADMIN) return;
    router.replace(postLoginPath(session.user.role, callbackUrl, "customer"));
  }, [status, session, router, callbackUrl]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    const phone = String(fd.get("phone") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const name = String(fd.get("name") ?? "");

    if (mode === "login" && !email && !phone) {
      setError("Enter email or phone");
      setLoading(false);
      return;
    }

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: email || undefined, phone: phone || undefined, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Registration failed");
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: email || undefined,
        phone: phone || undefined,
        password,
      });

      if (result?.error) {
        throw new Error(
          result.error === "CredentialsSignin"
            ? "Wrong email/phone or password. New customer? Register below."
            : `Sign-in failed (${result.error})`
        );
      }

      const meRes = await fetch("/api/auth/session");
      const me = await meRes.json();
      const role = me?.user?.role as UserRole | undefined;

      if (role === UserRole.ADMIN) {
        setError("This is a staff account. Sign in at /admin/login instead.");
        await signOut({ redirect: false });
        return;
      }

      router.push(postLoginPath(role, callbackUrl, "customer"));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-5 py-20">
      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-rose">Customer</p>
      <h1 className="serif mt-2 text-center text-4xl">
        {mode === "login" ? "Sign In" : "Create Account"}
      </h1>
      <p className="mt-3 text-center text-sm text-brand-muted">
        Track orders, saved addresses & wishlist.
      </p>
      <form onSubmit={onSubmit} className="mt-10 space-y-4">
        {mode === "register" && (
          <input
            name="name"
            required
            placeholder="Full name"
            className="w-full border border-brand-border bg-white px-4 py-3 text-sm"
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border border-brand-border bg-white px-4 py-3 text-sm"
        />
        <input
          name="phone"
          placeholder="Phone (optional if email set)"
          className="w-full border border-brand-border bg-white px-4 py-3 text-sm"
        />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Password"
          className="w-full border border-brand-border bg-white px-4 py-3 text-sm"
        />
        {error && <p className="text-sm text-rose">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-rose py-3 text-[11px] uppercase tracking-wider text-white disabled:opacity-60"
        >
          {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Register"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-brand-muted">
        {mode === "login" ? (
          <>
            New here?{" "}
            <button type="button" className="text-rose underline" onClick={() => setMode("register")}>
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button type="button" className="text-rose underline" onClick={() => setMode("login")}>
              Sign in
            </button>
          </>
        )}
      </p>
      <p className="mt-4 text-center text-xs text-brand-subtle">
        <Link href="/">← Back to shop</Link>
      </p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}
