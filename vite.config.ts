import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "/", // required for GitHub Pages root domain
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached indefinitely
          "vendor-react": ["react", "react-dom"],
          // Routing
          "vendor-router": ["react-router-dom"],
          // Data fetching
          "vendor-query": ["@tanstack/react-query"],
          // Heavy animation library — separate chunk so homepage doesn't pay the cost
          "vendor-motion": ["framer-motion"],
          // Swiper slider
          "vendor-swiper": ["swiper"],
        },
      },
    },
  },
  server: {
    port: 5175,
  },
});
