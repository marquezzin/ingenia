/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const allowedHosts = process.env.VITE_ALLOWED_HOSTS?.split(",")
    .map((h) => h.trim())
    .filter(Boolean);

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5173,
        allowedHosts: allowedHosts && allowedHosts.length > 0 ? allowedHosts : true,
        proxy: {
            "/api": {
                target: "http://backend:8000",
                changeOrigin: true,
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/test-setup.ts"],
        passWithNoTests: true,
        exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/*.spec.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
        },
    },
});
