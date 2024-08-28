import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // colors: {
      //   "white-white": "#fff",
      //   "primary-color": "#3758f9",
      //   black: "#000",
      //   "dark-dark": "#111928",
      //   "blue-blue-light-3": "#adbcf2",
      //   "gray-gray": "#f9fafb",
      //   stroke: "#dfe4ea",
      //   gray: "#f4f7ff",
      //   "secondary-text-color": "#8899a8",
      //   "gray-gray-3": "#e5e7eb",
      //   "dark-dark-6": "#9ca3af",
      //   gainsboro: "#e6e6e6",
      //   royalblue: "#5e80ff",
      //   slategray: "#637381",
      // },
      lineHeight: {
        'extra-loose': '2.5',
        '12': '50px',
        '13': '64px',
      },
      spacing: {},
      fontFamily: {
        "body-medium-medium": "Inter",
      },
      borderRadius: {
        "181xl": "200px",
      },
      height: {
        vh: 'var(--viewport-height)',
      }, 
      colors: {
        secondary: '#1F2A37'
      }
    },
    fontSize: {
      base: "16px",
      lg: "18px",
      xl: "20px",
      sm: "14px",
      inherit: "inherit",
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
