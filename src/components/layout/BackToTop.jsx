import { LuArrowUp } from "react-icons/lu";
import { useScrollThreshold } from "@/hooks/useScrollThreshold.js";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export default function BackToTop() {
  const visible = useScrollThreshold(720);

  return (
    <button
      type="button"
      className={`back-to-top${visible ? " is-visible" : ""}`}
      aria-label="Back to top of page"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }}
    >
      <LuArrowUp aria-hidden="true" />
    </button>
  );
}
