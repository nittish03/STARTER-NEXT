import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		   animation: {
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        }},
  		colors: {
  			'light-gray': '#d3d3d3',
  			'medium-gray': '#808080',
  			'dark-gray': '#333333',
			'custom-bg': '#404040',
			'custom-neon': '#78fff8',
			'custom-white':'#d9d9d9',
  			black: '#000000'
  		},
  		fontFamily: {
  			inria: ['Inria Sans', 'sans-serif'],
  			inter: ['Inter', 'sans-serif'],
  			koho: ['Koho', 'sans-serif'],
  			itim: ['Itim', 'cursive']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
