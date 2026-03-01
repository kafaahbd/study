import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/study/",
  server: {
    port: 5173,
    open: false,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // ফাইল নেমিং স্ট্রাকচার (Cache busting এর জন্য hash ব্যবহার)
        assetFileNames: "assets/[name].[hash].[ext]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",

        manualChunks(id) {
          // 📦 ১. থার্ড-পার্টি লাইব্রেরি বিভাজন (node_modules)
          if (id.includes("node_modules")) {
            // React Core
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("/react-router/") ||
              id.includes("/react-router-dom/") ||
              id.includes("/scheduler/")
            ) {
              return "react-core";
            }

            // Math & Latex Rendering
            if (id.includes("katex") || id.includes("react-latex-next")) {
              return "math-render";
            }

            // Animations
            if (id.includes("framer-motion")) {
              return "animations";
            }

            // Networking
            if (id.includes("axios")) {
              return "network";
            }

            // বাকি সব লাইব্রেরি vendor চাঙ্কে যাবে
            return "vendor";
          }

          // 🔥 ২. ইন্টারনাল কোড বিভাজন (Circular Dependency Fix)
          // আমরা পুরো 'src/pages' কে একটি চাঙ্কে রাখছি যাতে সার্কুলার এরর না হয়। 
          // কারণ অনেক সময় এক পেজ আরেক পেজ বা কমন কম্পোনেন্ট ইমপোর্ট করে।
          if (id.includes("src/pages/")) {
            return "app-pages";
          }

          // ৩. কমন কম্পোনেন্ট বা ইউটিলস আলাদা করা
          if (id.includes("src/components/") || id.includes("src/utils/")) {
            return "app-common";
          }
        },
      },
    },
    // কোড মিনিফিকেশন (Terser ব্যবহার করে)
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // প্রোডাকশনে console.log রিমুভ করবে
        drop_debugger: true,
      },
    } as any,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-helmet-async",
      "framer-motion",
      "axios",
      "katex",
      "react-latex-next",
    ],
  },
});