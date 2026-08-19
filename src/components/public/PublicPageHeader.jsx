import { createElement } from "react";

export function PageEyebrow({
  children,
  icon: Icon,
  className = "",
}) {
  if (!children) return null;

  return (
    <p className={`public-page-eyebrow ${className}`.trim()}>
      {Icon ? <Icon aria-hidden="true" /> : null}
      <span>{children}</span>
    </p>
  );
}

export function PageHero({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = "left",
  actions,
  visual,
  className = "",
  contentClassName = "",
}) {
  const split = Boolean(visual);

  return (
    <header
      className={[
        "public-page-hero",
        `public-page-hero--${align}`,
        split ? "public-page-hero--split" : "",
        className,
      ].filter(Boolean).join(" ")}
    >
      <div className={`public-page-hero-content ${contentClassName}`.trim()}>
        <PageEyebrow icon={eyebrowIcon}>{eyebrow}</PageEyebrow>
        <h1 className="public-page-title">{title}</h1>
        {description ? (
          <p className="public-page-description">{description}</p>
        ) : null}
        {actions ? <div className="public-page-actions">{actions}</div> : null}
      </div>

      {visual ? <div className="public-page-visual">{visual}</div> : null}
    </header>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as = "h2",
  className = "",
}) {
  return (
    <header
      className={[
        "public-section-header",
        `public-section-header--${align}`,
        className,
      ].filter(Boolean).join(" ")}
    >
      <PageEyebrow>{eyebrow}</PageEyebrow>
      {title ? createElement(as, { className: "public-section-title" }, title) : null}
      {description ? (
        <p className="public-section-description">{description}</p>
      ) : null}
    </header>
  );
}
