import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "/study/",
    server: { port: 5173, open: false },
    build: {
        chunkSizeWarningLimit: 800, 
        sourcemap: false,
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                assetFileNames: "assets/[name].[hash].[ext]",
                chunkFileNames: "assets/[name].[hash].js",
                entryFileNames: "assets/[name].[hash].js",
                
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        // 1. Core React dependencies
                        if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom") || id.includes("scheduler")) {
                            return "react-core";
                        }
                        // 2. Heavy animations (Framer Motion)
                        if (id.includes("framer-motion")) {
                            return "animations";
                        }
                        // 3. API & Utilities
                        if (id.includes("axios")) {
                            return "network-layer";
                        }
                        // 4. Large specific libraries
                        if (id.includes("html2pdf.js")) {
                            return "pdf-gen";
                        }
                        // 5. Everything else from node_modules
                        return "vendor";
                    }

                    // 🔥 Pages Splitting - Dynamic chunks for internal routes
                    if (id.includes("src/pages/")) {
                        const pageName = id.split("src/pages/")[1].split(".")[0].toLowerCase();
                        
                        // নির্দিষ্ট বড় পেজগুলো আলাদা নাম পাবে
                        if (["study", "ssccorner", "hsccorner", "admissioncorner", "examcenter", "profile"].includes(pageName)) {
                            return `pg-${pageName}`;
                        }
                        return "pages-common";
                    }
                },
            },
        },
        minify: "terser", // Terser ব্যবহারে কোড আরও ছোট হয় (ইন্সটল না থাকলে esbuild রাখতে পারেন)
        terserOptions: {
          compress: {
            drop_console: true, // প্রোডাকশনে কনসোল লগ রিমুভ করবে
            drop_debugger: true,
          },
        },
    },
    optimizeDeps: {
        include: ["react", "react-dom", "react-router-dom", "react-helmet-async", "framer-motion", "axios"],
    },
});