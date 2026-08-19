import { useEffect, useRef } from "react";

export default function usePortalDialog(onClose, { disabled = false, canClose = true } = {}) {
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(typeof document !== "undefined" ? document.activeElement : null);

  useEffect(() => {
    if (disabled) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const returnFocus = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (canClose) onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) || []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (returnFocus instanceof HTMLElement && document.contains(returnFocus)) {
        window.requestAnimationFrame(() => returnFocus.focus());
      }
    };
  }, [canClose, disabled, onClose]);

  return dialogRef;
}
