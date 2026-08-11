import { useEffect, useRef, useState } from "react";
import {
  LuCircleCheck,
  LuLayoutDashboard,
  LuMonitorSmartphone,
  LuPause,
  LuPanelsTopLeft,
  LuPlay,
} from "react-icons/lu";

const capabilities = [
  { icon: LuPanelsTopLeft, label: "Website systems" },
  { icon: LuMonitorSmartphone, label: "Mobile ready" },
  { icon: LuLayoutDashboard, label: "Client portal" },
];

export default function AgencyInterfacePreview() {
  const videoRef = useRef(null);
  const manuallyPausedRef = useRef(false);
  const motionOptInRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isInView = true;

    const syncPlayback = () => {
      const motionAllowed = !motionQuery.matches || motionOptInRef.current;
      const shouldPlay =
        !document.hidden &&
        isInView &&
        motionAllowed &&
        !manuallyPausedRef.current;

      if (shouldPlay) {
        video.play().catch(() => setIsPlaying(false));
      } else {
        video.pause();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleMotionChange = () => {
      if (motionQuery.matches) motionOptInRef.current = false;
      syncPlayback();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.2 },
    );

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    document.addEventListener("visibilitychange", syncPlayback);
    motionQuery.addEventListener("change", handleMotionChange);
    observer.observe(video);
    syncPlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      motionQuery.removeEventListener("change", handleMotionChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.pause();
    };
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      manuallyPausedRef.current = false;
      motionOptInRef.current = true;
      video.play().catch(() => setIsPlaying(false));
      return;
    }

    manuallyPausedRef.current = true;
    video.pause();
  };

  return (
    <figure className="agency-interface-preview">
      <div className="agency-collaboration-frame">
        <video
          ref={videoRef}
          className="agency-collaboration-video"
          poster="/hero/mspixelpulse-web-design-collaboration-1080.webp"
          width="1448"
          height="1086"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/hero/mspixelpulse-hero-motion.webm" type="video/webm" />
          <source src="/hero/mspixelpulse-hero-motion.mp4" type="video/mp4" />
        </video>
        <span className="sr-only">
          A small-business owner and web designer review a responsive website
          together on a laptop and phone.
        </span>
        <span className="agency-collaboration-sheen" aria-hidden="true" />

        <button
          type="button"
          className="agency-collaboration-video-control"
          onClick={toggleVideo}
          aria-label={isPlaying ? "Pause hero background video" : "Play hero background video"}
          aria-pressed={isPlaying}
          title={isPlaying ? "Pause hero video" : "Play hero video"}
        >
          {isPlaying ? <LuPause aria-hidden="true" /> : <LuPlay aria-hidden="true" />}
        </button>

        <div className="agency-collaboration-status">
          <span aria-hidden="true" />
          Toronto web strategy + design
        </div>

        <div className="agency-collaboration-story">
          <small>BUILT AROUND YOUR BUSINESS</small>
          <strong>Strategy, design and launch—together.</strong>
          <span>
            <LuCircleCheck aria-hidden="true" />
            Responsive from the start
          </span>
        </div>

        <div className="agency-collaboration-device" aria-label="Designed for desktop and mobile">
          <LuMonitorSmartphone aria-hidden="true" />
          <span>
            <small>DESKTOP + MOBILE</small>
            <strong>One clear experience</strong>
          </span>
        </div>
      </div>

      <figcaption className="agency-preview-caption">
        {capabilities.map((capability) => {
          const CapabilityIcon = capability.icon;
          return (
            <span key={capability.label}>
              <CapabilityIcon aria-hidden="true" />
              {capability.label}
            </span>
          );
        })}
      </figcaption>
    </figure>
  );
}
