/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "magic-purple": "#4B0082",
        "magic-gold": "#FFD700",
        gryffindor: "#740001",
        slytherin: "#1A472A",
        ravenclaw: "#0E1A40",
        hufflepuff: "#FFD700",
      },
      fontFamily: {
        magical: ["Cinzel", "serif"],
        cursive: ["Dancing Script", "cursive"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        sparkle: "sparkle 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #FFD700, 0 0 10px #FFD700" },
          "100%": { boxShadow: "0 0 20px #FFD700, 0 0 30px #FFD700" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
