import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        astro: {
          bg: "#0a0a12",
          surface: "#12121f",
          card: "#1a1a2e",
          orange: "#ff6b2c",
          purple: "#a855f7",
          cyan: "#22d3ee",
          pink: "#ec4899",
        },
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "system-ui", "sans-serif"],
        body: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(255, 107, 44, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)",
        "neon-strong":
          "0 0 30px rgba(255, 107, 44, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shake: "shake 0.4s ease-in-out",
        flash: "flash 0.3s ease-out",
        "wild-colors": "wild-colors 1.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-8px)" },
          "75%": { transform: "translateX(8px)" },
        },
        flash: {
          "0%": { opacity: "0.9", backgroundColor: "rgba(255,107,44,0.4)" },
          "100%": { opacity: "0", backgroundColor: "transparent" },
        },
        "wild-colors": {
          "0%": { filter: "hue-rotate(0deg)" },
          "50%": { filter: "hue-rotate(180deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
