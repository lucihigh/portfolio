export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(214 32% 91%)",
                input: "hsl(214 32% 91%)",
                ring: "hsl(174 80% 40%)",
                background: "hsl(215 33% 98%)",
                foreground: "hsl(222 47% 11%)",
                primary: {
                    DEFAULT: "hsl(174 80% 40%)",
                    foreground: "hsl(0 0% 100%)"
                },
                secondary: {
                    DEFAULT: "hsl(210 40% 96%)",
                    foreground: "hsl(222 47% 11%)"
                },
                muted: {
                    DEFAULT: "hsl(214 32% 94%)",
                    foreground: "hsl(215 16% 40%)"
                },
                card: {
                    DEFAULT: "hsl(0 0% 100%)",
                    foreground: "hsl(222 47% 11%)"
                }
            },
            fontFamily: {
                sans: ["IBM Plex Sans", "ui-sans-serif", "system-ui"],
                display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
                pixel: ["Pixelify Sans", "monospace"]
            },
            boxShadow: {
                soft: "0 24px 60px -24px rgba(15, 23, 42, 0.35)",
                pixel: "8px 8px 0 0 rgba(15, 23, 42, 0.9)",
                pixelDark: "8px 8px 0 0 rgba(8, 145, 178, 0.45)"
            },
            backgroundImage: {
                grid: "radial-gradient(circle at center, rgba(20, 184, 166, 0.14) 0, transparent 8%)"
            }
        }
    },
    plugins: []
};
