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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          container: "var(--primary-container)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          container: "var(--secondary-container)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          variant: "var(--surface-variant)",
          container: "var(--surface-container)",
          "container-high": "var(--surface-container-high)",
        },
        error: {
          DEFAULT: "var(--error)",
          foreground: "var(--error-foreground)",
          container: "var(--error-container)",
        },
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "on-primary-container": "var(--on-primary-container)",
        "on-secondary-container": "var(--on-secondary-container)",
      },
      fontFamily: {
        hanken: ["var(--font-hanken-grotesk)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      spacing: {
        'sidebar': '260px',
        'topbar': '64px',
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
export default config;
