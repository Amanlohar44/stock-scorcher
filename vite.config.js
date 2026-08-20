import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",

      workbox: {
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
},

      manifest: {
        name: "StockScorcher",
        short_name: "StockScorcher",
        description: "Learn Trading, Investing & AI Analysis",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
  {
    src: "/logo.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/logo.png",
    sizes: "512x512",
    type: "image/png",
  },
],
      },
    }),
  ],
});