import { Link } from "react-router-dom";

export default function Button({
  className = "",
  variant = "primary",
  size = "standard",
  type = "button",
  ...props
}) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  className = "",
  variant = "primary",
  size = "standard",
  ...props
}) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonAnchor({
  className = "",
  variant = "primary",
  size = "standard",
  ...props
}) {
  return <a className={buttonClass(variant, size, className)} {...props} />;
}

function buttonClass(variant = "primary", size = "standard", className = "") {
  return [
    "btn",
    `btn-${variant}`,
    size !== "standard" ? `btn-${size}` : "",
    className,
  ].filter(Boolean).join(" ");
}
