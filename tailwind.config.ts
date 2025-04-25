
import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        "nodo-dark": "#121620",
        "nodo-darker": "#0B0C10",
        nova: {
          DEFAULT: "#EC6F05",
          light: "#FF9320",
          dark: "#B45004",
          deep: "#5A2702",
        },
        orion: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
          dark: "#B45309",
          "500": "#F59E0B",
        },
        emerald: {
          DEFAULT: "#10B981",
          light: "#6EE7B7",
          dark: "#047857",
        },
        violet: {
          DEFAULT: "#3E1672",
          light: "#5C2E98",
          dark: "#2A0E50",
        },
        cyan: {
          DEFAULT: "#14E9F2",
          light: "#7FF4FA",
          dark: "#0CABB2",
        },
        brand: {
          50: "rgba(236, 111, 5, .25)",
          400: "#FF9320",
          500: "#EC6F05",
          600: "#B45004",
          700: "#5A2702",
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      boxShadow: {
        "neon-nova": "0 0 20px rgba(236, 111, 5, 0.18)",
        "neon-orion": "0 0 20px rgba(245, 158, 11, 0.18)",
        "neon-emerald": "0 0 20px rgba(16, 185, 129, 0.18)",
        "neon-violet": "0 0 20px rgba(62, 22, 114, 0.18)",
        "brand": "0 4px 8px -2px rgba(236, 111, 5, .35)",
        "brand-hover": "0 8px 16px -8px rgba(236, 111, 5, .25)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(90deg, #FF9320 0%, #EC6F05 50%, #B45004 100%)',
        'gradient-brand-vertical': 'linear-gradient(180deg, #FF9320 0%, #EC6F05 50%, #B45004 100%)',
        'gradient-glow': 'radial-gradient(circle closest-side, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      backdropBlur: {
        'glass': '20px',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        'fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-out': {
          '0%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': { 
            opacity: '0',
            transform: 'translateY(-10px)'
          }
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'hover-scale': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.98)' }
        },
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '0.6',
            transform: 'scale(0.95)'
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.05)'
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-5px)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'fade-out': 'fade-out 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'hover-scale': 'hover-scale 0.2s ease-out',
        "slow-spin": "spin 4s linear infinite",
        "pulse": "pulse 2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite",
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.25, 0.1, 0.25, 1) infinite",
        "float": "float 4s cubic-bezier(0.25, 0.1, 0.25, 1) infinite",
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
