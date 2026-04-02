export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Primary - Professional Blue
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a4b8ff',
          400: '#7c8fff',
          500: '#5b5cff', // Main primary
          600: '#4f3dff',
          700: '#3d2bcc',
          800: '#2d1fa3',
          900: '#1f157a',
          950: '#0f0a3d',
        },
        // Accent - Modern Teal
        accent: {
          50: '#f0fdf9',
          100: '#ccfdf3',
          200: '#99fbe7',
          300: '#66f9db',
          400: '#33f6d0',
          500: '#00f3c5', // Main accent
          600: '#00d4aa',
          700: '#00b38f',
          800: '#009178',
          900: '#007062',
          950: '#005047',
        },
        // Neutral - Professional Gray
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      backgroundColor: {
        // Light mode backgrounds
        'light-bg': '#ffffff',
        'light-secondary': '#f9fafb',
        'light-tertiary': '#f3f4f6',
        // Dark mode backgrounds
        'dark-bg': '#0f172a',
        'dark-secondary': '#1e293b',
        'dark-tertiary': '#334155',
      },
      textColor: {
        'light-primary': '#111827',
        'light-secondary': '#4b5563',
        'dark-primary': '#f9fafb',
        'dark-secondary': '#cbd5e1',
      },
      borderColor: {
        'light': '#e5e7eb',
        'dark': '#334155',
      },
    },
  },
  plugins: [],
}
