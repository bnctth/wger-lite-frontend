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
                'primary-faded': colors.teal["200"],
                'light': colors.gray["200"],
                error: colors.red["500"],
                'error-faded': colors.red["200"]
            }
        },
    },
    plugins: [],
}
