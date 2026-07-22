/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["DM Sans", "sans-serif"],
                display: ["Playfair Display", "serif"],
            },
            colors: {
                tierra: {
                    DEFAULT: "#c4956a",
                    dark: "#a37550",
                    light: "#d4a882",
                },
                crema: {
                    DEFAULT: "#f5f0e8",
                    dark: "#ede5d8",
                },
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(-4px) scale(0.95)" },
                    "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.2s ease-out",
            },
        },
    },
    plugins: [],
};
