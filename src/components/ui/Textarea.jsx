// src/components/ui/Textarea.jsx
import { useTheme } from "@/lib/theme.js";

export default function Textarea({ className = "", rows = 5, ...props }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const base =
    "form-control form-textarea w-full transition focus:outline-none text-[15px] resize-y";

  const themeClass = isDark
    ? "text-white"
    : "text-slate-900";

  return (
    <textarea
      rows={rows}
      {...props}
      className={`${base} ${themeClass} ${className}`}
    />
  );
}
