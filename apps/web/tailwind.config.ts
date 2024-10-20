import { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,html,js,jsx}'],
  theme: {
    fontFamily: {
      sans: ['"Inter"', 'sans-serif'],
    },
  },
  plugins: [],
};

export default config;
