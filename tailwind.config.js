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
                    DEFAULT: "#b8933f",
                    dark: "#8f7130",
                    light: "#d1b671",
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
                float: {
                    "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                    "33%": { transform: "translate(30px, -40px) scale(1.08)" },
                    "66%": { transform: "translate(-20px, 25px) scale(0.94)" },
                },
                floatReverse: {
                    "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                    "33%": { transform: "translate(-30px, 35px) scale(1.1)" },
                    "66%": { transform: "translate(25px, -20px) scale(0.92)" },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.2s ease-out",
                float: "float 16s ease-in-out infinite",
                floatSlow: "floatReverse 20s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
