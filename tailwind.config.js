/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // UNIfy Brand Colors
        unify: {
          mint: '#DFF3E4',
          purple: {
            light: '#504C8C',
            DEFAULT: '#3F3176',
            dark: '#2E1760',
          },
          navy: '#171738',
        },
        // Semantic colors
        primary: {
          50: '#f0f4ff',
          100: '#DFF3E4',
          200: '#b8d4e3',
          300: '#8bb8d1',
          400: '#504C8C',
          500: '#3F3176',
          600: '#2E1760',
          700: '#171738',
          800: '#12122a',
          900: '#0d0d1f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-unify': 'linear-gradient(180deg, #DFF3E4 0%, #504C8C 25%, #3F3176 50%, #2E1760 75%, #171738 100%)',
        'gradient-unify-horizontal': 'linear-gradient(90deg, #DFF3E4 0%, #504C8C 25%, #3F3176 50%, #2E1760 75%, #171738 100%)',
        'gradient-purple': 'linear-gradient(180deg, #504C8C 0%, #3F3176 50%, #2E1760 100%)',
        'gradient-dark': 'linear-gradient(180deg, #2E1760 0%, #171738 100%)',
        'gradient-hero': 'linear-gradient(180deg, #DFF3E4 0%, #504C8C 100%)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(23, 23, 56, 0.1), 0 2px 4px -1px rgba(23, 23, 56, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(23, 23, 56, 0.1), 0 4px 6px -2px rgba(23, 23, 56, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
