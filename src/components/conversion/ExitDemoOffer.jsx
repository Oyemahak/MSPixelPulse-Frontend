import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuSparkles, LuX } from "react-icons/lu";

const SESSION_KEY = "mspixelpulse-exit-demo-seen-v1";

export default function ExitDemoOffer({ pathname }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || window.sessionStorage.getItem(SESSION_KEY) === "true") return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    let eligible = false;
    const eligibilityTimer = window.setTimeout(() => {
      eligible = true;
    }, 12000);

    function openOffer(event) {
      if (!eligible || event.clientY > 0 || dialog.open) return;
      previousFocusRef.current = document.activeElement;
      dialog.showModal();
      window.sessionStorage.setItem(SESSION_KEY, "true");
      document.removeEventListener("mouseout", openOffer);
    }

    document.addEventListener("mouseout", openOffer);
    return () => {
      window.clearTimeout(eligibilityTimer);
      document.removeEventListener("mouseout", openOffer);
      if (dialog.open) dialog.close();
    };
  }, [pathname]);

  function closeOffer() {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    dialog.close();
    previousFocusRef.current?.focus?.();
  }

  return (
    <dialog
      ref={dialogRef}
      className="exit-demo-dialog"
      aria-labelledby="exit-demo-title"
      aria-describedby="exit-demo-description"
      onCancel={(event) => {
        event.preventDefault();
        window.sessionStorage.setItem(SESSION_KEY, "true");
        closeOffer();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeOffer();
      }}
    >
      <button type="button" className="exit-demo-close" onClick={closeOffer} aria-label="Close free demo offer">
        <LuX aria-hidden="true" />
      </button>
      <span className="exit-demo-icon" aria-hidden="true"><LuSparkles /></span>
      <p className="exit-demo-kicker">A useful first step</p>
      <h2 id="exit-demo-title">Want to see your website direction first?</h2>
      <p id="exit-demo-description">
        Request a free personalized planning demo. Review the visual direction with no obligation to start a paid production project.
      </p>
      <div className="exit-demo-actions">
        <Link
          className="btn btn-primary"
          to="/free-demo"
          onClick={closeOffer}
          data-analytics-cta="exit_free_demo"
          data-analytics-placement="exit_offer"
        >
          Request My Free Demo <LuArrowRight aria-hidden="true" />
        </Link>
        <button type="button" className="btn btn-glass" onClick={closeOffer}>No thanks</button>
      </div>
    </dialog>
  );
}
