import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { site } from "./site/config";
export default defineConfig({
  root: "site",
  base: site.base,
  publicDir: false,
  plugins: [react()],
  build: {
    reportCompressedSize: false,
    outDir: "dist",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: { input: "site/src/client.tsx" },
  },
});
