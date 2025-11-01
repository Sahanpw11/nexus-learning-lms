/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#ff6b35',
          'orange-dark': '#e55a2b',
          'orange-light': '#ff8659',
        },
        text: {
          white: '#ffffff',
          'white-muted': 'rgba(255, 255, 255, 0.7)',
          'white-subtle': 'rgba(255, 255, 255, 0.5)',
        },
        background: {
          main: '#000000',
          secondary: '#0a0a0a',
          tertiary: '#111111',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.08)',
          dark: 'rgba(0, 0, 0, 0.3)',
        }
      },
      fontFamily: {
        'sf': ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'montserrat': ['MontserratAlt1-Light', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'title': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading': ['1.25rem', { lineHeight: '1.3' }],
        'body': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
        'micro': ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.05em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%)',
        'gradient-orange-soft': 'linear-gradient(135deg, #ff6b35 0%, #ff8659 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, rgba(255, 107, 53, 0.1) 0%, transparent 70%)',
        'grid-pattern': 'linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px)',
      },
      boxShadow: {
        'glass': '0 4px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-sm': '0 2px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glow': '0 0 24px rgba(255, 107, 53, 0.3)',
        'glow-sm': '0 0 12px rgba(255, 107, 53, 0.2)',
        'glow-lg': '0 0 48px rgba(255, 107, 53, 0.5)',
        'button': '0 4px 16px rgba(255, 107, 53, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'button-hover': '0 6px 24px rgba(255, 107, 53, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      },
      animation: {
        'slide-up': 'slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right': 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-scale': 'fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }
    },
  },
  plugins: [],
}
