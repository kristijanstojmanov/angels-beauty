/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#9D00FF",
                "primary-hover": "#8A00E5",
                "background-light": "#fcf8fc",
                "background-alt": "#ebebeb",
                "background-dark": "#1b0e1b",
                "gold-accent": "#D4AF37",
                "text-main-light": "#1b0e1b",
                "text-main-dark": "#fcf8fc",
                "text-muted-light": "#974e97",
                "text-muted-dark": "#c086c0"
            },
            fontFamily: {
                "display": ["Plus Jakarta Sans", "sans-serif"],
                "sans": ["Noto Sans", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "2rem",
                "xl": "3rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
