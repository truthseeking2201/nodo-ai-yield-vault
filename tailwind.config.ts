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
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        "nodo-dark": "#0D0E11",
        "nodo-darker": "#131417",
        "nodo-glass": "rgba(255,255,255,0.04)",
        "text-primary": "#F3F4F6",
        "text-secondary": "#9CA3AF",
        "text-tertiary": "#6B7280",
        "text-inverse": "#0E0F11",
        "brand": {
          "orange-100": "#FFB347",
          "orange-500": "#FF8A00",
          "orange-700": "#FF5E00",
          "DEFAULT": "#FF8A00",
          50: "rgba(255,138,0,0.25)",
          400: "#FFB347",
          500: "#FF8A00",
        },
        "brand-violet": {
          600: "#B847FF",
          700: "#714BFF",
        },
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
        "e-1": "0 1px 2px -1px rgba(0,0,0,.55)",
        "e-2": "0 4px 12px -6px rgba(0,0,0,.60)",
        "e-3": "0 12px 32px -8px rgba(0,0,0,.65)",
        "neon-glow": "0 0 18px 6px rgba(255,138,0,.45)",
        "neon-nova": "0 0 20px rgba(249, 115, 22, 0.5)",
        "neon-orion": "0 0 20px rgba(245, 158, 11, 0.5)",
        "neon-emerald": "0 0 20px rgba(16, 185, 129, 0.5)",
        "brand": "0 4px 8px -2px rgba(245, 158, 11, .35)",
        "brand-hover": "0 8px 16px -8px rgba(245, 158, 11, .25)"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(90deg, #F59E0B 0%, #F5B041 100%)',
        'gradient-neural-orange': 'linear-gradient(110deg, #FFB347 0%, #FF8A00 35%, #FF5E00 60%, #B847FF 85%, #714BFF 100%)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        card: '20px',
      },
      fontSize: {
        'display': ['54px', { lineHeight: '64px', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '38px', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '30px', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '26px', fontWeight: '600' }],
        'body-l': ['17px', { lineHeight: '24px', fontWeight: '400' }],
        'body-s': ['15px', { lineHeight: '22px', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '18px', fontWeight: '500' }],
        'num-xl': ['32px', { lineHeight: '38px', fontWeight: '600' }],
        'num-l': ['28px', { lineHeight: '34px', fontWeight: '600' }],
        'num-s': ['22px', { lineHeight: '28px', fontWeight: '600' }],
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
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
        'hover-scale': 'hover-scale 0.12s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-right': 'slide-in-right 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-out-right': 'slide-out-right 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
        'enter': 'fade-in 0.3s cubic-bezier(0.22, 1, 0.36, 1), scale-in 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      borderColor: {
        'stroke-soft': 'rgba(255,255,255,0.06)',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
