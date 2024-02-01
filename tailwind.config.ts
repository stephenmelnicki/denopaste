import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme.js";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", ...defaultTheme.fontFamily.sans],
      },
    },
  },
} satisfies Config;
