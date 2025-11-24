import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

const defaultDevPort = Number(process.env.VITE_PORT ?? 5173);
const hmrPort = Number(process.env.VITE_HMR_PORT ?? defaultDevPort);

export default defineConfig({
    server: {
        hmr: {
            // host: "localhost",
            host: "walrus-app-f5oa8.ondigitalocean.app",
        },
    },
    preview: {
        host: process.env.VITE_PREVIEW_HOST ?? "0.0.0.0",
        port: Number(process.env.VITE_PREVIEW_PORT ?? 4173),
    },
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
});
