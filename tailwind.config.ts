import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Only White and Green Color Palette
        white: "#ffffff",
        black: "#000000",

        // Green variations
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },

        // Gray scale (neutral tones)
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },

        // CSS Variable-based colors
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
          foreground: "var(--white)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--gray-light)",
        },
        destructive: {
          DEFAULT: "var(--green-dark)",
          foreground: "var(--white)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--white)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },

        // Simplified color aliases
        light: "var(--white)",
        dark: "var(--black)",
        "light-dark": "var(--gray-medium)",
        grey: "var(--gray-light)",
        "light-grey": "var(--gray-light)",
        "light-primary": "var(--green-light)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        body: ["var(--font-poppins)", "Poppins", "sans-serif"],
        heading: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1600px",
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-right": "fadeInRight 0.6s ease-out",
        "fade-in-left": "fadeInLeft 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-left": "slide-left 0.5s ease-out",
        "slide-right": "slide-right 0.5s ease-out",
        "zoom-in": "zoom-in 0.5s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "bounce-in": "bounce-in 0.6s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      boxShadow: {
        green: "0 0 20px rgba(16, 185, 129, 0.3)",
        "green-lg": "0 10px 25px rgba(16, 185, 129, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
