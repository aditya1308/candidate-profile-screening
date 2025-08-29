/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Société Générale palette
        primary: {
          50: '#fff1f4',
          100: '#ffe1e7',
          200: '#ffc1ce',
          300: '#ff94ab',
          400: '#ff5d80',
          500: '#ef2b4a', // SG red
          600: '#e60028', // SG red core
          700: '#c00022',
          800: '#9a001c',
          900: '#7a0017',
        },
        secondary: {
          50: '#f5f5f5',
          100: '#e9e9e9',
          200: '#d9d9d9',
          300: '#bfbfbf',
          400: '#8c8c8c',
          500: '#595959',
          600: '#404040',
          700: '#262626',
          800: '#141414',
          900: '#000000', // SG black
        },
        accent: {
          50: '#f8fafc',
          100: '#eef2f7',
          200: '#dde5ef',
          300: '#c3cfdf',
          400: '#8fa5c0',
          500: '#6b87ac',
          600: '#4a6e9b',
          700: '#3b587d',
          800: '#2c425e',
          900: '#1e2d40',
        },
        sg: {
          red: '#E9041E',
          'red-dark': '#C00418',
          black: '#1b1918',
          white: '#ffffff',
          gray: '#f8f9fa'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tilt': 'tilt 10s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(2deg)' },
        }
      }
    },
  },
  plugins: [],
}


