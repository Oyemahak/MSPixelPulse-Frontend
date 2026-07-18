// src/components/ui/Input.jsx
import { useTheme } from "@/lib/theme.js";

export default function Input({ className = "", ...props }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const base =
    "form-control w-full transition focus:outline-none text-[15px]";

  const themeClass = isDark
    ? // dark
      "text-white"
    : // light
      "text-slate-900";

  return <input {...props} className={`${base} ${themeClass} ${className}`} />;
}
