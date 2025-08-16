import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable tree shaking
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          styled: ["styled-components"],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Performance optimizations
  optimizeDeps: {
    include: ["react", "react-dom", "styled-components"],
  },
});
