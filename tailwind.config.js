import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: colors.teal["500"],
                'primary-hover': colors.teal["400"],
                'light': colors.gray["200"]
            }
        },
    },
    plugins: [],
}
