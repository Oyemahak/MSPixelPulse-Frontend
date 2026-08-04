import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuCopy, LuMail, LuShare2 } from "react-icons/lu";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";

function supportsNativeShare() {
  return typeof navigator !== "undefined"
    && typeof navigator.share === "function"
    && typeof window !== "undefined"
    && window.matchMedia?.("(pointer: coarse)").matches;
}

export default function ShareMenu({ article, shareCount, pending, onRecord, onStatus }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const button = buttonRef.current;
    const menu = menuRef.current;
    const focusable = () => Array.from(menu?.querySelectorAll("button:not([disabled])") || []);
    focusable()[0]?.focus();

    function handlePointer(event) {
      if (!menu?.contains(event.target) && !button?.contains(event.target)) setOpen(false);
    }
    function handleKey(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
      button?.focus();
    };
  }, [open]);

  async function nativeShare() {
    try {
      await navigator.share({ title: article.title, text: article.title, url: article.url });
      await onRecord("native", "native_share_completed");
      onStatus("Article shared from your device.");
    } catch (error) {
      if (error?.name !== "AbortError") {
        setOpen(true);
        onStatus("Choose a sharing option below.");
      }
    }
  }

  async function activate(platform) {
    const encodedUrl = encodeURIComponent(article.url);
    const encodedTitle = encodeURIComponent(article.title);
    try {
      if (platform === "copy_link") {
        await navigator.clipboard.writeText(article.url);
        await onRecord(platform);
        onStatus("Article link copied.");
      } else if (platform === "email") {
        await onRecord(platform);
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
      } else {
        const destinations = {
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        };
        window.open(destinations[platform], "_blank", "noopener,noreferrer");
        await onRecord(platform);
        onStatus(`Opened ${platform === "whatsapp" ? "WhatsApp" : platform[0].toUpperCase() + platform.slice(1)} sharing.`);
      }
      setOpen(false);
    } catch (error) {
      onStatus(error.message || "That sharing option is temporarily unavailable.", "error");
    }
  }

  const options = [
    { platform: "copy_link", label: "Copy link", Icon: LuCopy },
    { platform: "linkedin", label: "LinkedIn", Icon: FaLinkedinIn },
    { platform: "facebook", label: "Facebook", Icon: FaFacebookF },
    { platform: "whatsapp", label: "WhatsApp", Icon: FaWhatsapp },
    { platform: "email", label: "Email", Icon: LuMail },
  ];

  return (
    <div className="blog-share-control">
      <button
        ref={buttonRef}
        type="button"
        className="blog-reaction-button blog-share-button"
        onClick={() => supportsNativeShare() ? nativeShare() : setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={pending}
      >
        <LuShare2 aria-hidden="true" />
        <span>Share</span>
        <strong>{shareCount}</strong>
        {!supportsNativeShare() ? <LuChevronDown className="blog-share-chevron" aria-hidden="true" /> : null}
      </button>
      {open ? (
        <div ref={menuRef} className="blog-share-menu" role="menu" aria-label="Share this article">
          {options.map((option) => (
            <button key={option.platform} type="button" role="menuitem" onClick={() => activate(option.platform)}>
              <option.Icon aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
