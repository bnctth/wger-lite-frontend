import colors from "tailwindcss/colors";
import {buttonColors} from "./src/utils.ts";

const safelist = buttonColors.flatMap(color => [
    `bg-${color}`,
    `disabled:border-${color}`,
    `disabled:text-${color}`,
    `hover:bg-${color}-hover`
])

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist,
    theme: {
        extend: {
            colors: {
                primary: colors.teal["500"],
                'primary-hover': colors.teal["400"],
                'primary-faded': colors.teal["200"],
                'light': colors.gray["100"],
                danger: colors.red["500"],
                'danger-hover': colors.red["400"],
                'danger-faded': colors.red["200"],
                unimportant: colors.gray["400"],
                'unimportant-hover': colors.gray["300"],
            }
        },
    },
    plugins: [],
}
