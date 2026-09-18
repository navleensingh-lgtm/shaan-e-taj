import { UserRole } from "@shaan-e-taj/database";

/** Where to send the user after a successful sign-in. */
export function postLoginPath(
  role: UserRole | string | undefined,
  callbackUrl: string | null,
  context: "customer" | "admin"
): string {
  const cb = callbackUrl?.trim();
  if (cb && cb.startsWith("/") && !cb.startsWith("//")) {
    if (context === "admin" && !cb.startsWith("/admin")) {
      return "/admin";
    }
    if (context === "customer" && cb.startsWith("/admin")) {
      return "/account";
    }
    return cb;
  }
  if (context === "admin") return "/admin";
  return "/account";
}
