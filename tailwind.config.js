export default {
  content: [],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        glow: {
          '0%': { textShadow: '0 0 20px rgba(96, 165, 250, 0.5)' },
          '100%': { textShadow: '0 0 30px rgba(168, 85, 247, 0.8)' }
        }
      }
    }
  },
  plugins: []
}
