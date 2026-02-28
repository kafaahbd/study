import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "/study/",
    server: { 
        port: 5173, 
        open: false 
    },
    build: {
        chunkSizeWarningLimit: 1000, 
        sourcemap: false,
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                // ফাইল নেমিং স্ট্রাকচার
                assetFileNames: "assets/[name].[hash].[ext]",
                chunkFileNames: "assets/[name].[hash].js",
                entryFileNames: "assets/[name].[hash].js",
                
                manualChunks(id) {
                    // 📦 ১. লাইব্রেরি বা node_modules বিভাজন (Vendor Splitting)
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

                        // Networking & PDF
                        if (id.includes("axios")) return "network";
                        if (id.includes("html2pdf.js") || id.includes("html2pdf")) return "pdf-gen";

                        // অন্যান্য ছোট লাইব্রেরিগুলো 'vendor' এ যাবে
                        return "vendor";
                    }

                    // 🔥 ২. পেজ বিভাজন (Internal Route Optimization)
                    if (id.includes("src/pages/")) {
                        // পাথ থেকে ফাইলের নাম বের করা
                        const pathParts = id.split("src/pages/")[1].split("/");
                        const fileName = pathParts[pathParts.length - 1].split(".")[0].toLowerCase();
                        
                        // নির্দিষ্টভাবে ExamCenter কে আলাদা চাঙ্ক 'pg-examcenter' এ রাখা হচ্ছে
                        if (fileName === "examcenter") {
                            return "pg-examcenter";
                        }
                        
                        // বাকি সব পেজকে (Home, Profile, Dashboard ইত্যাদি) 'pages-common' এ রাখা হচ্ছে
                        return "pages-common";
                    }
                },
            },
        },
        // কোড ছোট (Minify) করার জন্য Terser ব্যবহার
        minify: "terser", 
        terserOptions: {
          compress: {
            drop_console: true, // প্রোডাকশন বিল্ডে কনসোল লগ রিমুভ করবে
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
            "react-latex-next"
        ],
    },
});