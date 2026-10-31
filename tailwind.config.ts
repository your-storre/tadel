import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        delta: {
          navy: "#003366",
          navyDeep: "#00254A",
          red: "#E31837",
          redHover: "#C41230",
          hair: "#D8DEE6",
          ink: "#1A1A1A",
          muted: "#5A6675",
          surface: "#F5F7FA",
        },
      },
      fontFamily: {
        din: ['"DIN Pro"', '"DIN Alternate"', "system-ui", "sans-serif"],
      },
      borderRadius: { card: "4px" },
      boxShadow: {
        card: "0 1px 3px rgba(0,51,102,0.08)",
        lift: "0 4px 14px rgba(0,51,102,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
