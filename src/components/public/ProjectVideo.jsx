import { useState } from "react";
import { LuPlay } from "react-icons/lu";

// Only render videos with a verified ID and a real, local project thumbnail.
export default function ProjectVideo({ youtubeId, poster, posterAlt, title, category }) {
  const [playing, setPlaying] = useState(false);
  if (!/^[A-Za-z0-9_-]{11}$/.test(youtubeId || "") || !poster || !title) return null;

  return (
    <figure className="project-video">
      <div className="project-video-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="project-video-play"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
          >
            <img src={poster} alt={posterAlt || ""} loading="lazy" decoding="async" width="1280" height="720" />
            <span className="project-video-play-icon" aria-hidden="true"><LuPlay /></span>
          </button>
        )}
      </div>
      {(category || title) && <figcaption>{category && <span>{category}</span>}{title}</figcaption>}
    </figure>
  );
}
