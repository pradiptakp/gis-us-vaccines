const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
    },
    fontFamily: {
      body: ["Inter", "sans-serif"],
      display: ["Inter", "sans-serif"],
    },
    extend: {
      typography: (theme) => ({
        default: {
          css: [
            {
              pre: {
                padding: 0,
                margin: 0,
              },
            },
          ],
        },
        light: {
          css: [
            {
              color: theme("colors.blueGray.100"),
              '[class~="lead"]': {
                color: theme("colors.blueGray.300"),
              },
              a: {
                color: theme("colors.white"),
              },
              strong: {
                color: theme("colors.white"),
              },
              "ol > li::before": {
                color: theme("colors.blueGray.100"),
              },
              "ul > li::before": {
                backgroundColor: theme("colors.blueGray.600"),
              },
              hr: {
                borderColor: theme("colors.blueGray.600"),
              },
              blockquote: {
                color: theme("colors.blueGray.200"),
                borderLeftColor: theme("colors.blueGray.600"),
              },
              h1: {
                color: theme("colors.white"),
              },
              h2: {
                color: theme("colors.white"),
              },
              h3: {
                color: theme("colors.white"),
              },
              h4: {
                color: theme("colors.white"),
              },
              "figure figcaption": {
                color: theme("colors.blueGray.100"),
              },
              "a code": {
                color: theme("colors.white"),
              },
              thead: {
                color: theme("colors.white"),
                borderBottomColor: theme("colors.blueGray.100"),
              },
              "tbody tr": {
                borderBottomColor: theme("colors.blueGray.600"),
              },
            },
          ],
        },
      }),
    },
  },
  variants: {
    extend: { typography: ["dark"] },
  },
  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/typography")],
};
