import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: "/index.html",
        // Поддержка HTTP для разработки
        disableDevLogs: false,
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === "document" ||
              request.destination === "script" ||
              request.destination === "style",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "app-shell" },
          },
          // Кэширование изображений
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
              },
            },
          },
        ],
      },
      manifest: {
        name: "Freedom Hub",
        short_name: "FreedomHub",
        description: "PWA приложение для управления запросами",
        display: "standalone",
        display_override: ["standalone", "minimal-ui"],
        start_url: "/",
        scope: "/",
        background_color: "#0f172a",
        theme_color: "#0f172a",
        orientation: "portrait-primary",
        categories: ["productivity", "utilities"],
        lang: "ru",
        dir: "ltr",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        // Android специфичные настройки
        prefer_related_applications: false,
        related_applications: [],
      },
    }),
  ],
  server: {
    host: true,
    port: 80,
    // Поддержка HTTP для PWA
    https: false,
  },
  // Оптимизация для PWA
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          store: ["zustand"],
        },
      },
    },
  },
});
