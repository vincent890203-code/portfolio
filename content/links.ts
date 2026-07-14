// 社群與聯絡連結。href 為空字串者會在 UI 自動略過。
export type ProfileLink = {
  label: string;
  href: string;
  icon: string;
};

export const LINKS: ProfileLink[] = [
  { label: "GitHub", href: "https://github.com/vincent890203-code", icon: "GH" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yuan-chen-kuo-17ab90371/",
    icon: "in",
  },
  { label: "Email", href: "mailto:vincent890203@gmail.com", icon: "@" },
  { label: "Line", href: "https://line.me/ti/p/~22339403", icon: "L" },
  {
    label: "履歷(來信索取)",
    href: "mailto:vincent890203@gmail.com?subject=履歷索取",
    icon: "CV",
  },
].filter((l) => l.href && l.href.trim() !== "");
