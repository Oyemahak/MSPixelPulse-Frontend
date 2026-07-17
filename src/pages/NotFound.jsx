// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { LuCompass, LuFolderOpen, LuHouse, LuMessageCircle } from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import Meta from "@/components/Meta.jsx";

export default function NotFound() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-heading">
      <Meta
        title="Page not found — MSPixelPulse"
        description="The requested MSPixelPulse page could not be found. Return home or browse our website projects."
        robots="noindex, nofollow"
      />
      <div className="not-found-ambient not-found-ambient-one" aria-hidden="true" />
      <div className="not-found-ambient not-found-ambient-two" aria-hidden="true" />

      <Container className="not-found-container">
        <div className="not-found-card liquid-glass-surface">
          <div className="not-found-code" aria-label="Error 404">
            <LuCompass aria-hidden="true" />
            <span>404</span>
          </div>

          <h1 id="not-found-heading">This page isn’t part of the site.</h1>
          <p>
            The address may be outdated or typed incorrectly. Choose a clear next
            step and we’ll get you back on track.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="not-found-primary">
              <LuHouse aria-hidden="true" />
              Return to homepage
            </Link>
            <Link to="/projects" className="not-found-secondary liquid-glass-button">
              <LuFolderOpen aria-hidden="true" />
              Browse website projects
            </Link>
          </div>

          <Link to="/contact" className="not-found-help-link">
            <LuMessageCircle aria-hidden="true" />
            Tell us about a broken link
          </Link>
        </div>
      </Container>
    </section>
  );
}
