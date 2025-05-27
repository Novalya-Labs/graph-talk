import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		server: {
			host: true,
			port: 3333,
			proxy: {
				"/api": {
					target: "http://localhost:8888",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			}
		},
		resolve: {
			alias: {
				"@/configs": path.resolve(__dirname, "./src/configs"),
				"@/assets": path.resolve(__dirname, "./src/assets"),
				"@/lib": path.resolve(__dirname, "./src/lib"),
				"@/hooks": path.resolve(__dirname, "./src/hooks"),
				"@/i18n": path.resolve(__dirname, "./src/i18n"),
				"@/navigations": path.resolve(__dirname, "./src/navigations"),
				"@/pages": path.resolve(__dirname, "./src/pages"),
				"@/contexts": path.resolve(__dirname, "./src/contexts"),
				"@/features": path.resolve(__dirname, "./src/features"),
				"@/layouts": path.resolve(__dirname, "./src/layouts"),
				"@/services": path.resolve(__dirname, "./src/services"),
				"@/styles": path.resolve(__dirname, "./src/styles"),
				"@/types": path.resolve(__dirname, "./src/types"),
				"@/components": path.resolve(__dirname, "./src/components"),
				"@/src": path.resolve(__dirname, "./src"),
				"@": path.resolve(__dirname, "."),
			},
		},
		plugins: [
			react(),
			tailwindcss(),
			createHtmlPlugin({
				minify: true,
				inject: {
					data: {
						assetsPath: ".",
						appName: env.VITE_APP_NAME,
					},
				},
			}),
			VitePWA({
				registerType: "autoUpdate",
				includeAssets: ["src/assets/images/logo.png"],
				injectRegister: "auto",
				workbox: {
					globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
				},
				manifest: {
					name: env.VITE_PWA_NAME,
					short_name: env.VITE_PWA_SHORT_NAME,
					description: env.VITE_PWA_DESCRIPTION,
					theme_color: env.VITE_PWA_THEME_COLOR,
					background_color: env.VITE_PWA_BACKGROUND_COLOR,
					start_url: "/",
					icons: [
						{
							src: "pwa-64x64.png",
							sizes: "64x64",
							type: "image/png",
						},
						{
							src: "pwa-192x192.png",
							sizes: "192x192",
							type: "image/png",
						},
						{
							src: "pwa-512x512.png",
							sizes: "512x512",
							type: "image/png",
							purpose: "any",
						},
						{
							src: "maskable-icon-512x512.png",
							sizes: "512x512",
							type: "image/png",
							purpose: "maskable",
						},
					],
					screenshots: [],
				},
			}),
		].filter(Boolean),
	};
});
