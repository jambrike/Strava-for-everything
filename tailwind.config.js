/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Gemini Dark Mode Palette
        gemini: {
          bg: '#131314',
          card: '#1e1f20',
          border: '#2d2e2f',
          'border-light': '#3d3e3f',
          surface: '#252627',
          'surface-elevated': '#2a2b2c',
        },
        // Accent Colors for the 4 Pillars
        pillar: {
          iron: '#FF6B35',      // Orange - The Iron (Gym)
          path: '#4ECDC4',      // Teal - The Path (Run)
          deep: '#9B5DE5',      // Purple - The Deep (Work)
          snap: '#F7DC6F',      // Yellow - The Snap (Lifestyle)
        },
        // Text Colors
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0A0',
          muted: '#6B6B6B',
        },
        // Status Colors
        status: {
          success: '#00D26A',
          warning: '#FFB800',
          error: '#FF4757',
        },
        // Glow Colors (for subtle effects)
        glow: {
          iron: 'rgba(255, 107, 53, 0.3)',
          path: 'rgba(78, 205, 196, 0.3)',
          deep: 'rgba(155, 93, 229, 0.3)',
          snap: 'rgba(247, 220, 111, 0.3)',
          white: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['InterBold', 'system-ui', 'sans-serif'],
        mono: ['JetBrainsMono', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '10px',
        'tag': '8px',
      },
      spacing: {
        'safe-top': '44px',
        'safe-bottom': '34px',
        'tab-height': '80px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'glow-iron': '0 0 20px rgba(255, 107, 53, 0.4)',
        'glow-path': '0 0 20px rgba(78, 205, 196, 0.4)',
        'glow-deep': '0 0 20px rgba(155, 93, 229, 0.4)',
        'glow-snap': '0 0 20px rgba(247, 220, 111, 0.4)',
      },
    },
  },
  plugins: [],
};
