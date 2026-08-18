import { useEffect, useRef } from "react";
import { LuX } from "react-icons/lu";

export default function InvoiceDrawer({ title, description, onClose, children, wide = false }) {
  const drawerRef = useRef(null);
  const returnFocusRef = useRef(
    typeof document !== "undefined" ? document.activeElement : null,
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const returnFocus = returnFocusRef.current;
    document.body.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(drawerRef.current?.querySelectorAll(
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
      document.removeEventListener("keydown", onKeyDown);
      if (returnFocus instanceof HTMLElement && document.contains(returnFocus)) {
        window.requestAnimationFrame(() => returnFocus.focus());
      }
    };
  }, [onClose]);

  return (
    <div className="invoice-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        ref={drawerRef}
        className={`invoice-drawer ${wide ? "is-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-drawer-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="invoice-drawer-header">
          <div>
            <h2 id="invoice-drawer-title">{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button type="button" className="portal-icon-button" onClick={onClose} autoFocus aria-label={`Close ${title}`}>
            <LuX aria-hidden="true" />
          </button>
        </header>
        <div className="invoice-drawer-body">{children}</div>
      </section>
    </div>
  );
}
