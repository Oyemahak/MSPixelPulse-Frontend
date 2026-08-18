// src/components/SectionTitle.jsx
import { SectionHeader } from "@/components/public/PublicPageHeader.jsx";

function SectionTitle({
  eyebrow,
  title,
  centered = false,
  align = "center",
  description,
  className = "",
  as = "h2",
}) {
  return (
    <SectionHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      align={centered ? "center" : align}
      as={as}
      className={className}
    />
  );
}

export default SectionTitle;
export { SectionTitle };
