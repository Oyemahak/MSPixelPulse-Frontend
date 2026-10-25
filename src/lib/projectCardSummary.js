import { projectCardSummaries, supersededShortDescriptions } from "../data/projectCardSummaries.js";

export const CARD_SUMMARY_MAX_WORDS = 25;
const TRUNCATED_WORDS = 22;

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function countWords(value) {
  const text = clean(value);
  return text ? text.split(" ").length : 0;
}

export function isCardSized(value) {
  const words = countWords(value);
  return words > 0 && words <= CARD_SUMMARY_MAX_WORDS;
}

// Shortens long copy at a word boundary so a card never shows a full case study.
export function truncateWords(value, maxWords = TRUNCATED_WORDS) {
  const text = clean(value);
  const words = text ? text.split(" ") : [];
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ").replace(/[\s,;:.!?—–-]+$/u, "")}…`;
}

// Resolves the card summary for a raw API record. The stored `shortDescription`
// (Admin "Short card description") wins when it is card-sized and has been
// edited away from the superseded pre-release text.
export function resolveStoredCardSummary(record = {}) {
  const slug = record.slug || record._id || "";
  const stored = clean(record.shortDescription);
  const superseded = clean(supersededShortDescriptions[slug]);

  if (isCardSized(stored) && stored !== superseded) return stored;
  if (projectCardSummaries[slug]) return projectCardSummaries[slug];
  return truncateWords(stored || record.summary || record.fullDescription || record.projectOverview);
}

// Card copy for any normalized public project (API-backed or curated fallback).
export function projectCardSummary(project = {}) {
  if (clean(project.cardSummary)) return clean(project.cardSummary);
  const curated = projectCardSummaries[project.slug || project.id];
  if (curated) return curated;
  const fallback = clean(project.shortDescription) || clean(project.summary) || clean(project.overview);
  return isCardSized(fallback) ? fallback : truncateWords(fallback);
}
