import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173,
        proxy: {
            "/api": {
                target: "http://localhost:4000",
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: "dist",
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("react-router-dom")) {
                            return "router";
                        }
                        if (id.includes("react-icons")) {
                            return "icons";
                        }
                        if (id.includes("react") || id.includes("react-dom")) {
                            return "react";
                        }
                        if (id.includes("axios")) {
                            return "axios";
                        }
                        return "vendor";
                    }
                },
            },
        },
    },
});
