// Server-only. Signs/verifies the /admin unlock cookie with an HMAC over an
// expiry timestamp, keyed off ADMIN_ACCESS_PASSWORD — so the cookie can't be
// forged without knowing the password, and expires on its own. This is a
// friction/obscurity layer on top of real auth (Supabase sign-in + the
// admin role check), not a replacement for it — RLS is still what actually
// protects the data.
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_GATE_COOKIE = "mma_admin_gate";
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret(): string {
  const value = process.env["ADMIN_ACCESS_PASSWORD"];
  if (!value) throw new Error("ADMIN_ACCESS_PASSWORD is not configured.");
  return value;
}

function sign(expiresAt: number): string {
  const mac = createHmac("sha256", secret()).update(String(expiresAt)).digest("hex");
  return `${expiresAt}.${mac}`;
}

export function createGateToken(): string {
  return sign(Date.now() + TTL_MS);
}

export function isGateTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  const [expiresAtStr, mac] = token.split(".");
  if (!expiresAtStr || !mac) return false;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expected = createHmac("sha256", secret()).update(expiresAtStr).digest("hex");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
