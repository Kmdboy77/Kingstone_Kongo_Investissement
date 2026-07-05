/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#F5B041",
        "gold-dim": "#C4893A",
        "noir": "#000000",
        "noir-soft": "#0A0A0A",
        "noir-card": "#0D0D0D",
        emerald: { DEFAULT: "#10B981", glow: "#10B98150" },
        cobalt: "#3B82F6",
        "surface": "#111111",
        "surface-2": "#161616",
        "border-subtle": "rgba(255,255,255,0.06)",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-1000px 0" }, "100%": { backgroundPosition: "1000px 0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        "pulse-gold": { "0%,100%": { boxShadow: "0 0 0 0 rgba(245,176,65,0)" }, "50%": { boxShadow: "0 0 30px 8px rgba(245,176,65,0.25)" } },
        "count-up": { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
      animation: {
        shimmer: "shimmer 2.5s infinite linear",
        float: "float 6s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "count-up": "count-up 0.5s ease-out forwards",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5B041 0%, #C4893A 50%, #F5B041 100%)",
        "dark-gradient": "linear-gradient(180deg, #000000 0%, #0A0A0A 100%)",
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
    },
  },
  plugins: [],
};
