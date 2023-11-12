/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: [
		"./src/**/*.{html,js,jsx,ts,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			backgroundColor: {
				"main-bg": "#151632",
			},
			colors: {
				"main-color": "#59981A",
			},
		},
	},
	plugins: [],
};
