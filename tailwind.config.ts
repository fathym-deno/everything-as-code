import { type Config } from "tailwindcss";
import * as colors from "tailwindcss/colors.js";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
} satisfies Config;
