import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        netflix: {
          red: "#E50914",
          "red-hover": "#F40612",
          "red-dark": "#B20710",
          black: "#141414",
          "dark-gray": "#181818",
          "medium-gray": "#2F2F2F",
          "light-gray": "#808080",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(229, 9, 20, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(229, 9, 20, 0.6)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "netflix-gradient": "linear-gradient(to bottom, rgba(20, 20, 20, 0) 0%, rgba(20, 20, 20, 0.15) 15%, rgba(20, 20, 20, 0.35) 29%, rgba(20, 20, 20, 0.58) 44%, #141414 68%, #141414 100%)",
        "card-gradient": "linear-gradient(180deg, transparent 0%, rgba(20, 20, 20, 0.8) 50%, rgba(20, 20, 20, 1) 100%)",
        "hero-gradient": "linear-gradient(to right, #141414 0%, transparent 50%, transparent 100%)",
      },
      boxShadow: {
        "netflix": "0 0 40px rgba(229, 9, 20, 0.15)",
        "netflix-hover": "0 0 60px rgba(229, 9, 20, 0.3)",
        "card": "0 8px 32px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 16px 48px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;
