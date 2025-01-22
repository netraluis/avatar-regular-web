// widget-embed/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js", // Asegúrate de que TailwindCSS esté configurado en PostCSS
  },
  build: {
    outDir: path.resolve(__dirname, "../dist"),  // Compila a /public
    emptyOutDir: true,                            // No borra todo /public
    rollupOptions: {
      // El punto de entrada principal
      input: path.resolve(__dirname, "widget-entry.tsx"),
      // Ajuste del nombre final
      output: {
        entryFileNames: `widget-bundle.js`
      }
    }
  }
});
