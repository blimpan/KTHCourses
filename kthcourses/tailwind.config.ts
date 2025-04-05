import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "xs": "450px", 
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      blur: {
        xs: '2px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "kth-blue": "var(--kth-blue)",
        "kth-gray": "var(--kth-gray)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "card-fade-in": "fadeIn 0.2s ease-in forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
