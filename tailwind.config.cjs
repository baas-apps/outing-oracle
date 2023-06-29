const typography = require("@tailwindcss/typography");
const daisyui = require("daisyui");

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {}
  },

  daisyui: {
    themes: ["winter"],
  },

  plugins: [typography, daisyui]
};

module.exports = config;