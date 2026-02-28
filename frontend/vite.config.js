// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    // removed viteStaticCopy plugin — not needed for Render
  ],

  build: {
    outDir: "dist", // final static files will go here
  }
});