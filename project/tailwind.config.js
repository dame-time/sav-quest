const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5866f2",
        "primary-content": "#ffffff",
        "primary-dark": "#293bee",
        "primary-light": "#8791f6",

        secondary: "#f25899",
        "secondary-content": "#460520",
        "secondary-dark": "#ee297c",
        "secondary-light": "#f687b6",

        background: "#131420",
        foreground: "#1d1e30",
        border: "#303350",

        copy: "#fafafc",
        "copy-light": "#cfd1e2",
        "copy-lighter": "#8f93bc",

        success: "#58f258",
        warning: "#f2f258",
        error: "#f25858",

        "success-content": "#054605",
        "warning-content": "#464605",
        "error-content": "#460505"
      },
    }
  },
  plugins: [],
};
export default config;
