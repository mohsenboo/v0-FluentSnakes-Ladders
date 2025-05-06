import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        fluent: {
          blue: "#3700FF",
          pink: "#FF8FDA",
          jonquil: "#FECD07",
          murrey: "#8B0142",
          "spring-green": "#32FE6B",
          "forest-green": "#064401",
          cyan: "#49EDED",
          "midnight-green": "#004E4E",
          black: "#000000",
          "dark-grey": "#0B0B0B",
          white: "#FFFFFF",
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
      fontFamily: {
        sans: ["Bossa", "sans-serif"],
      },
      backgroundImage: {
        "mystic-bloom": "linear-gradient(135deg, #FF8FDA 0%, #3700FF 100%)",
        "electric-meadow": "linear-gradient(135deg, #CEF564 0%, #3700FF 100%)",
        "golden-sunrise": "linear-gradient(135deg, #FE6901 0%, #FECD07 100%)",
        "floral-spring": "linear-gradient(135deg, #32FE6B 0%, #FF8FDA 100%)",
        "rose-velvet": "linear-gradient(135deg, #8D0042 0%, #FF8FDA 100%)",
        "aurora-pulse": "linear-gradient(135deg, #501FFF 0%, #32FE6B 100%)",
        "emerald-shadow": "linear-gradient(135deg, #32FE6B 0%, #064400 100%)",
        "celestial-glow": "linear-gradient(135deg, #4F1FA 0%, #FF7B69 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
