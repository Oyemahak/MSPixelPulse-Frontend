const PROJECT_FALLBACK_SRC = "/projects/project-fallback.svg";

export function applyProjectImageFallback(event, projectTitle = "Portfolio project") {
  const image = event.currentTarget;

  if (image.dataset.fallbackApplied === "true") {
    image.hidden = true;
    return;
  }

  image.dataset.fallbackApplied = "true";
  image.src = PROJECT_FALLBACK_SRC;
  image.alt = `${projectTitle} portfolio preview fallback`;
}
