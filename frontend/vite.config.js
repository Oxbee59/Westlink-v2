import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Copy _redirects file into dist
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, "public/_redirects"),
          dest: "./"
        }
      ]
    })
  ],

  build: {
    outDir: "dist",
  }
});
