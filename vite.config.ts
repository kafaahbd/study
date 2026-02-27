import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/frontend/",
	server: { port: 5173, open: false },
	build: {
		chunkSizeWarningLimit: 1000, // সতর্কতা সীমা বাড়ানো
		sourcemap: false,
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				assetFileNames: "assets/[name].[hash].[ext]",
				// ✅ উন্নত manualChunks: React আলাদা, বড় লাইব্রেরি আলাদা
				manualChunks(id) {
					// 📦 node_modules split
					if (id.includes("node_modules")) {
						if (
							id.includes("react") ||
							id.includes("react-dom") ||
							id.includes("react-router-dom") ||
							id.includes("scheduler")
						) {
							return "react-vendor";
						}
						if (id.includes("html2pdf.js")) {
							return "pdf-generator";
						}
						if (id.includes("react-helmet-async")) {
							return "utils";
						}
						return "vendor";
					}

					// 🔥 pages আলাদা chunk
					if (id.includes("src/pages/Study")) return "study";
					if (id.includes("src/pages/SSCCorner")) return "ssc";
					if (id.includes("src/pages/HSCCorner")) return "hsc";
					if (id.includes("src/pages/AdmissionCorner")) return "admission";
					if (id.includes("src/pages/ExamCenter")) return "exam";

					if (id.includes("src/pages/Profile")) return "profile";
				},
				chunkFileNames: "assets/[name].[hash].js",
				entryFileNames: "assets/[name].[hash].js",
			},
		},
		minify: "esbuild", // দ্রুত মিনিফাই
	},
	optimizeDeps: {
		include: ["react", "react-dom", "react-router-dom", "react-helmet-async"],
	},
});
