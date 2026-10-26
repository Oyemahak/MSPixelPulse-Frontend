import { useEffect, useState } from "react";

// True once the page has scrolled past `threshold` pixels. Uses one passive
// listener and at most one state update per animation frame.
export function useScrollThreshold(threshold = 8) {
  const [past, setPast] = useState(() =>
    typeof window !== "undefined" ? window.scrollY > threshold : false,
  );

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setPast(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return past;
}
