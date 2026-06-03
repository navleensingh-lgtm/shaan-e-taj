/** Quick production login check (credentials flow). */
const base = process.argv[2] ?? "https://www.shaanetaj.com";
const email = "navleensingh05@gmail.com";
const password = "Cupid.1907";

const csrfRes = await fetch(`${base}/api/auth/csrf`);
const { csrfToken } = await csrfRes.json();

const body = new URLSearchParams({
  csrfToken,
  email,
  password,
  callbackUrl: `${base}/admin`,
  json: "true",
});

const signInRes = await fetch(`${base}/api/auth/callback/credentials`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body,
  redirect: "manual",
});

console.log("status:", signInRes.status);
console.log("location:", signInRes.headers.get("location"));
const setCookie = signInRes.headers.get("set-cookie");
console.log("session cookie:", setCookie?.includes("session-token") ? "yes" : "no");
