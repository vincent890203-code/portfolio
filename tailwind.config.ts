import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 設計系統:「訊號轉換」— 顏色從暖到冷,隱喻轉職歷程
        bg: "#0A0F1E",
        surface: "#101830",
        line: "#1E2A4A",
        warm: "#FFB454", // 過去 / 原背景
        cool: "#22D3EE", // 現在 / AI 工程師
        text: "#E6EAF5",
        dim: "#8A93AD",
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-tc)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        widest2: "0.3em",
      },
    },
  },
  plugins: [],
};

export default config;
