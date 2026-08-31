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
        "surface": "#f9f9ff",
        "on-tertiary-container": "#6a0045",
        "on-tertiary-fixed": "#3d0026",
        "surface-container-highest": "#d8e3fb",
        "secondary-fixed": "#d4e3ff",
        "primary-fixed": "#e8ddff",
        "tertiary-fixed": "#ffd8e7",
        "tertiary-container": "#f170b4",
        "on-secondary-fixed": "#001c39",
        "on-primary-fixed": "#21005e",
        "surface-container": "#e7eeff",
        "on-secondary": "#ffffff",
        "on-surface": "#111c2d",
        "on-tertiary-fixed-variant": "#85145a",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed-dim": "#a4c9ff",
        "on-error": "#ffffff",
        "background": "#f9f9ff",
        "inverse-on-surface": "#ecf1ff",
        "outline": "#7a7583",
        "primary-fixed-dim": "#cebdff",
        "tertiary": "#a43073",
        "on-error-container": "#93000a",
        "surface-variant": "#d8e3fb",
        "on-secondary-fixed-variant": "#004883",
        "on-tertiary": "#ffffff",
        "outline-variant": "#cac4d4",
        "tertiary-fixed-dim": "#ffafd3",
        "on-primary": "#ffffff",
        "surface-tint": "#674bb5",
        "surface-container-high": "#dee8ff",
        "on-primary-container": "#3c1989",
        "error": "#ba1a1a",
        "on-background": "#111c2d",
        "inverse-primary": "#cebdff",
        "on-primary-fixed-variant": "#4f319c",
        "primary-container": "#a78bfa",
        "secondary": "#0060ac",
        "inverse-surface": "#263143",
        "surface-dim": "#cfdaf2",
        "on-surface-variant": "#494552",
        "secondary-container": "#64a8fe",
        "on-secondary-container": "#003c70",
        "surface-bright": "#f9f9ff",
        "error-container": "#ffdad6",
        "primary": "#674bb5",
        "surface-container-low": "#f0f3ff"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "full": "9999px"
      },
      spacing: {
        "base": "8px",
        "stack-sm": "12px",
        "margin-desktop": "40px",
        "margin-mobile": "16px",
        "gutter": "24px",
        "stack-lg": "48px",
        "container-max": "1200px",
        "stack-md": "24px"
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        headline: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        body: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #a78bfa 0%, #64a8fe 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f170b4 0%, #a78bfa 100%)',
        'gradient-btn': 'linear-gradient(90deg, #a78bfa 0%, #64a8fe 100%)',
        'mesh-light': 'radial-gradient(at 40% 20%, hsla(280,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.15) 0px, transparent 50%)'
      },
      animation: {
        'scan': 'scan 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translateY(360px)', opacity: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
