
import type { Config } from "tailwindcss";

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
        "nodo-dark": "#0D0E11", // bg-base
        "nodo-darker": "#12100F",
        "nodo-card": "#131417", // bg-card
        "nodo-glass": "rgba(255,255,255,0.04)", // bg-glass
        "text-primary": "#F3F4F6",
        "text-secondary": "#9CA3AF",
        "text-tertiary": "#6B7280",
        "text-inverse": "#0E0F11",
        "brand-orange-100": "#FFB347",
        "brand-orange-500": "#FF8A00",
        "brand-orange-700": "#FF5E00",
        "brand-violet-600": "#B847FF",
        "brand-violet-700": "#714BFF",
        "state-success": "#10B981",
        "state-warning": "#F59E0B",
        "state-error": "#EF4444",
        "stroke-soft": "rgba(255,255,255,0.06)",
        "stroke-hard": "rgba(255,255,255,0.10)",
        nova: {
          DEFAULT: "#F97316",
          light: "#FDBA74",
          dark: "#C2410C",
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
        brand: {
          50: "rgba(245, 158, 11, .25)",
          400: "#F5B041",
          500: "#F59E0B",
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
        "neon-nova": "0 0 20px rgba(249, 115, 22, 0.5)",
        "neon-orion": "0 0 20px rgba(245, 158, 11, 0.5)",
        "neon-emerald": "0 0 20px rgba(16, 185, 129, 0.5)",
        "brand": "0 4px 8px -2px rgba(245, 158, 11, .35)",
        "brand-hover": "0 8px 16px -8px rgba(245, 158, 11, .25)",
        "neon-glow": "0 0 18px 6px rgba(255,138,0,.45)",
        "e-1": "0 1px 2px -1px rgba(0,0,0,.55)",
        "e-2": "0 4px 12px -6px rgba(0,0,0,.60)",
        "e-3": "0 12px 32px -8px rgba(0,0,0,.65)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(90deg, #F59E0B 0%, #F5B041 100%)',
        'gradient-neural-orange': 'linear-gradient(90deg, #FF8A00 0%, #FF5E00 100%)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        card: '20px',
      },
      spacing: {
        's-1': '4px', 
        's-2': '8px',
        's-3': '16px',
        's-4': '24px',
        's-5': '32px',
        's-6': '48px',
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
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scale-in 0.2s ease-out',
        'hover-scale': 'hover-scale 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
