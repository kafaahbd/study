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
                assetFileNames: "assets/[name].[hash].[ext]",
                chunkFileNames: "assets/[name].[hash].js",
                entryFileNames: "assets/[name].[hash].js",
                
                manualChunks(id) {
                    // 📦 node_modules splitting
                    if (id.includes("node_modules")) {
                        
                        // 1. Core React Engine (High Priority to avoid circular chunks)
                        if (
                            id.includes("/react/") || 
                            id.includes("/react-dom/") || 
                            id.includes("/react-router/") || 
                            id.includes("/react-router-dom/") ||
                            id.includes("/scheduler/")
                        ) {
                            return "react-core";
                        }

                        // 2. Math & Physics Rendering (Latex)
                        if (id.includes("katex") || id.includes("react-latex-next")) {
                            return "math-render";
                        }

                        // 3. Animations
                        if (id.includes("framer-motion")) {
                            return "animations";
                        }

                        // 4. API & Utilities
                        if (id.includes("axios")) {
                            return "network";
                        }

                        // 5. PDF Generation
                        if (id.includes("html2pdf.js") || id.includes("html2pdf")) {
                            return "pdf-gen";
                        }

                        // 6. Default Vendor for other small libraries
                        return "vendor";
                    }

                    // 🔥 Pages Splitting - Internal Route Optimization
                    if (id.includes("src/pages/")) {
                        // ফাইলপাথ থেকে পেজের নাম বের করা
                        const pathParts = id.split("src/pages/")[1].split("/");
                        const pageName = pathParts[pathParts.length - 1].split(".")[0].toLowerCase();
                        
                        const mainPages = ["study", "ssccorner", "hsccorner", "admissioncorner", "examcenter", "profile", "verifyemail", "verifycode"];
                        
                        if (mainPages.includes(pageName)) {
                            return `pg-${pageName}`;
                        }
                        return "pages-common";
                    }
                },
            },
        },
        // Terser ব্যবহার করলে এটি নিশ্চিত করুন যে 'terser' ইনস্টল করা আছে
        // npm install -D terser
        minify: "terser", 
        terserOptions: {
          compress: {
            drop_console: true, 
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