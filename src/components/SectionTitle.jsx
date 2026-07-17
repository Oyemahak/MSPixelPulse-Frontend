// src/components/SectionTitle.jsx
import { useTheme } from "@/lib/theme.js";

function SectionTitle({
  eyebrow,
  title,
  centered = false,
  align = "center",
  description,
  className = "",
  as = "h2",
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const Heading = as;

  // layout
  const wrapper =
    centered ? "text-center" : align === "left" ? "text-left" : "text-center";

  return (
    <div className={`mb-8 ${wrapper} ${className}`}>
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-primary text-sm tracking-[0.28em] font-bold uppercase">
            {eyebrow}
          </span>
        </div>
      ) : null}

      {title ? (
        <Heading
          className={`public-section-title mx-auto max-w-full break-words text-[1.75rem] font-extrabold tracking-tight md:text-[2.125rem] ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </Heading>
      ) : null}

      {description ? (
        <p
          className={`mt-3 max-w-3xl break-words text-[15px] md:text-[16px] leading-relaxed ${
            centered ? "mx-auto" : ""
          } ${isDark ? "text-white/65" : "text-slate-600"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

// 👇 this fixes your error
export default SectionTitle;
export { SectionTitle };
