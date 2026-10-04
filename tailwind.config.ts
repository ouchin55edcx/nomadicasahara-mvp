import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "rgb(var(--color-brand) / <alpha-value>)",
          dark: "rgb(var(--color-brand-dark) / <alpha-value>)",
          soft: "rgb(var(--color-brand-soft) / <alpha-value>)",
        },
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-dark": "rgb(var(--color-ink-dark) / <alpha-value>)",
        line: {
          DEFAULT: "rgb(var(--color-line) / <alpha-value>)",
          soft: "rgb(var(--color-line-soft) / <alpha-value>)",
        },
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
      },
      letterSpacing: {
        nav: "0.08em",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 150ms ease-out",
        "accordion-up": "accordion-up 150ms ease-out",
        "collapsible-down": "collapsible-down 150ms ease-out",
      },
      borderRadius: {
        DEFAULT: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
