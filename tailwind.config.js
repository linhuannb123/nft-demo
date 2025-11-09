/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'slide-up': 'slideIn 300ms ease-in-out',
        'slide-in-right': 'slideInX 300ms ease-in-out',
      },
      keyframes: {
        slideIn: {
          '0%': {
            transform: 'translateY(-20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideInX: {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
      screens: {
        '4xl': { min: '1920px' }, // 超宽屏（如2K/4K显示器）
        '3xl': { min: '1680px' }, // 大屏显示器
        '2xl': { min: '1536px' }, // 标准大屏
        xl: { min: '1280px' }, // 笔记本/小屏显示器
        lg: { min: '1024px' }, // 平板横屏
        md: { min: '768px' }, // 平板竖屏
        sm: { min: '640px' }, // 手机横屏
        xs: { max: '639px' }, // 手机竖屏（最小屏）
      },
      colors: {
        darkTheme: {
          200: 'rgba(255,255,255,0.02)',
          bg: 'rgba(255,255,255,0.04)',
          hover: 'rgba(255,255,255,0.1)',
          'hover-b': 'rgba(255,255,255,0.2)',
          text: 'rgba(255,255,255,0.6)',
          'text-b': 'rgba(255,255,255,0.9)',
          border: 'rgba(255,255,255,0.08)',
          'bg-0.08': 'rgba(255,255,255,0.08)',
          DEFAULT: 'rgba(25,28,31,1)',
          bgx: 'rgba(31,34,38,0.85)',
        },
      },
      boxShadow: {
        '3xl': '41px 0px 24px 30px rgba(255, 255, 255, 1)',
        '3xl-dark': '41px 0px 24px 30px rgba(25, 28, 31, 1)',
        '-3xl': '-41px 0px 24px 30px rgba(255, 255, 255, 1)',
        '-3xl-dark': '-41px 0px 24px 30px rgba(25, 28, 31, 1)',
      },
    },
  },
  plugins: [],
}
