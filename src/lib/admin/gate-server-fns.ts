import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { ADMIN_GATE_COOKIE, createGateToken, isGateTokenValid } from "./gate";

export const checkAdminGate = createServerFn({ method: "GET" }).handler(async () => {
  return { ok: isGateTokenValid(getCookie(ADMIN_GATE_COOKIE)) };
});

export const verifyAdminGatePassword = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ password: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_ACCESS_PASSWORD"];
    if (!expected || data.password !== expected) {
      throw new Error("Incorrect password.");
    }
    setCookie(ADMIN_GATE_COOKIE, createGateToken(), {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return { success: true as const };
  });
