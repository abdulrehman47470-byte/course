// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [
    // Compresses every raster asset that ends up in the build output,
    // including public/ (includePublic: true by default) and anything
    // imported from src/assets. Quality 80 is visually lossless at normal
    // viewing sizes but meaningfully smaller than the source uploads.
    ViteImageOptimizer({
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      png: { quality: 80 },
      webp: { lossless: false, quality: 80 },
      cache: true,
    }),
  ],
});
