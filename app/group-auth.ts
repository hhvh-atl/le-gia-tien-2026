import { cookies } from "next/headers";
import { env } from "cloudflare:workers";

export const groupCredentials: Record<string, string> = {
  atlanta: "Atlanta",
  boston: "Boston",
  florida: "Florida",
  bentre: "Bến Tre",
  binhduong: "Bình Dương",
  saigon: "Sài Gòn",
  phanrang: "Phan Rang",
  quangninh: "Quảng Ninh",
};

const COOKIE_NAME = "group_session";

function secret() {
  return String((env as unknown as Record<string, unknown>).GROUP_SESSION_SECRET || "local-development-only");
}

async function signature(value: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function createGroupSession(username: string) {
  const expires = Date.now() + 12 * 60 * 60 * 1000;
  const payload = `${username}.${expires}`;
  const token = `${payload}.${await signature(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 12 * 60 * 60 });
}

export async function clearGroupSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getGroupSession(): Promise<{ username: string; groupName: string } | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [username, expiresText, supplied] = token.split(".");
  const payload = `${username}.${expiresText}`;
  if (!username || !supplied || Number(expiresText) < Date.now() || supplied !== await signature(payload)) return null;
  const groupName = groupCredentials[username];
  return groupName ? { username, groupName } : null;
}
