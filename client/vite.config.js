import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes("node_modules")) {
                        return undefined;
                    }
                    if (id.includes("react-router")) {
                        return "router-vendor";
                    }
                    if (id.includes("@tanstack/react-query") || id.includes("axios")) {
                        return "data-vendor";
                    }
                    if (id.includes("framer-motion") || id.includes("lucide-react")) {
                        return "ui-vendor";
                    }
                    if (id.includes("react-hook-form") || id.includes("@hookform/resolvers") || id.includes("zod")) {
                        return "forms-vendor";
                    }
                    if (id.includes("/react/") ||
                        id.includes("/react-dom/") ||
                        id.includes("/scheduler/")) {
                        return "react-vendor";
                    }
                    return undefined;
                }
            }
        }
    }
});
