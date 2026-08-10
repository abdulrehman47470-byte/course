import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
//
// Guarded because some Nitro build targets (observed on the Vercel preset,
// with nitro still on a pre-RC v3 beta) bundle this named export as
// `undefined` at runtime even though it resolves fine locally/in dev —
// crashing every request with "createCsrfMiddleware is not a function".
// Falling back to no CSRF middleware keeps the app up under that bundling
// bug; investigate/report upstream so real CSRF protection can come back.
const csrfMiddleware =
  typeof createCsrfMiddleware === "function"
    ? createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" })
    : undefined;

export const startInstance = createStart(() => ({
  requestMiddleware: csrfMiddleware ? [errorMiddleware, csrfMiddleware] : [errorMiddleware],
}));
