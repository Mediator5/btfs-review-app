/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                tealDeep: {
                    DEFAULT: "#426663",
                    50: "#eef4f3",
                    100: "#dbe8e6",
                    200: "#b8d0cc",
                    300: "#95b8b2",
                    400: "#709e94",
                    500: "#426663",
                    600: "#3b5c5a",
                    700: "#314c4b",
                    800: "#273c3c",
                    900: "#1d2c2c",
                },
            },
        },
    },
    plugins: [],
};
