// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function verificationMetaPlugin(mode) {
  const env = loadEnv(mode, __dirname, "");
  const verificationTags = [
    ["google-site-verification", env.VITE_GSC_VERIFICATION],
    ["msvalidate.01", env.VITE_BING_VERIFICATION],
  ]
    .filter(([, content]) => String(content || "").trim())
    .map(([name, content]) => ({
      tag: "meta",
      attrs: { name, content: String(content).trim() },
      injectTo: "head",
    }));

  return {
    name: "mspixelpulse-verification-meta",
    transformIndexHtml() {
      return verificationTags;
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), verificationMetaPlugin(mode)],
  base: "/",
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    host: true,
    port: 5173,
    open: true,
    // Dev-only proxy so localhost can call your Vercel Serverless Functions
    proxy: {
      // Any request to /vercel-api/* will be proxied to the production contact functions.
      "/vercel-api": {
        target: "https://mspixelpulse.com",
        changeOrigin: true,
        secure: true,
        rewrite: (pathStr) => pathStr.replace(/^\/vercel-api/, "/api"),
      },
    },
  },
  preview: { port: 4173 },
  build: {
    outDir: "dist",
    manifest: true,
    target: "es2020",
    sourcemap: mode !== "production",
    assetsInlineLimit: 0,
  },
  define: { "process.env": {} },
}));
