import test from "node:test";
import assert from "node:assert/strict";
import { projectCardSummaries, supersededShortDescriptions } from "../data/projectCardSummaries.js";
import {
  CARD_SUMMARY_MAX_WORDS,
  countWords,
  projectCardSummary,
  resolveStoredCardSummary,
  truncateWords,
} from "./projectCardSummary.js";
import { fallbackPublicProjects, normalizePublicProjects } from "./publicPortfolio.js";

const wellnessLong =
  "Wellness Studio V4 is a fictional Toronto spa and wellness demo with 36 treatments, 50 unique licensed ambient videos, searchable services, seven-step demo booking requests, clearly labeled sample reviews, feedback previews and wellness tips. Email delivery and private feedback storage are NOT CONFIGURED. No real appointments or verified customer testimonials.";

test("every curated card summary is 15–25 words", () => {
  for (const [slug, summary] of Object.entries(projectCardSummaries)) {
    const words = countWords(summary);
    assert.ok(words >= 15 && words <= CARD_SUMMARY_MAX_WORDS, `${slug} has ${words} words`);
  }
});

test("every published curated project has a card summary", () => {
  for (const project of fallbackPublicProjects) {
    assert.ok(projectCardSummaries[project.slug], `${project.slug} is missing a card summary`);
  }
});

test("uses the required Wellness and AUREL card summaries", () => {
  assert.equal(
    projectCardSummaries["ms-pixelpulse-wellness-studio"],
    "An elegant wellness studio website featuring treatment discovery, immersive visuals, and an interactive booking experience.",
  );
  assert.equal(
    projectCardSummaries["aurel-immigration-legal"],
    "A premium Canadian immigration website featuring student resources, immigration pathways, smart search, and consultation experiences.",
  );
});

test("replaces an over-long stored short description with the curated summary", () => {
  assert.equal(
    resolveStoredCardSummary({ slug: "ms-pixelpulse-wellness-studio", shortDescription: wellnessLong }),
    projectCardSummaries["ms-pixelpulse-wellness-studio"],
  );
});

test("replaces only the superseded stored text; a new Admin value wins", () => {
  const slug = "aurel-immigration-legal";
  assert.equal(
    resolveStoredCardSummary({ slug, shortDescription: `  ${supersededShortDescriptions[slug]} ` }),
    projectCardSummaries[slug],
  );
  const edited = "An Admin-edited card summary for the immigration concept that should be shown as saved.";
  assert.equal(resolveStoredCardSummary({ slug, shortDescription: edited }), edited);
});

test("falls back to a truncated description when no card summary exists", () => {
  const truncated = resolveStoredCardSummary({ slug: "unknown-project", shortDescription: wellnessLong });
  assert.ok(truncated.endsWith("…"));
  assert.ok(countWords(truncated) <= CARD_SUMMARY_MAX_WORDS);
  assert.ok(wellnessLong.startsWith(truncated.slice(0, -1)));

  assert.equal(
    resolveStoredCardSummary({ slug: "unknown-project", shortDescription: "", summary: "A short internal summary." }),
    "A short internal summary.",
  );
  assert.equal(truncateWords("One two three, four", 3), "One two three…");
  assert.equal(
    projectCardSummary({ slug: "local-only", shortDescription: "", summary: wellnessLong }),
    truncateWords(wellnessLong),
  );
});

test("normalized cards keep full descriptions while exposing a short card summary", () => {
  const projects = normalizePublicProjects([
    {
      _id: "6a53dfbc3e365df4b2e03542",
      slug: "ms-pixelpulse-wellness-studio",
      title: "MS PixelPulse Wellness Studio",
      projectClassification: "demo",
      shortDescription: wellnessLong,
      fullDescription: wellnessLong,
      liveUrl: "https://wellness.mspixelpulse.com",
    },
  ]);
  const wellness = projects.find((project) => project.slug === "ms-pixelpulse-wellness-studio");
  assert.equal(projectCardSummary(wellness), projectCardSummaries["ms-pixelpulse-wellness-studio"]);
  assert.equal(wellness.shortDescription, wellnessLong);
  assert.equal(wellness.overview, wellnessLong);
});

test("AUREL renders once with its local capture, category, demo label, summary and live site", () => {
  const projects = normalizePublicProjects([
    {
      _id: "13ad72b6-097a-4c8d-af70-87a0595e50a0",
      slug: "aurel-immigration-legal",
      title: "AUREL Immigration & Legal",
      projectClassification: "demo",
      industry: "Immigration / Professional Services",
      technologies: ["React", "TypeScript", "Vite", "React Router", "Lucide"],
      shortDescription: supersededShortDescriptions["aurel-immigration-legal"],
      liveUrl: "https://immigration.mspixelpulse.com",
      thumbnail: "https://immigration.mspixelpulse.com/project-preview.webp",
    },
  ]);
  const aurel = projects.filter((project) => project.slug === "aurel-immigration-legal");
  assert.equal(aurel.length, 1);
  assert.equal(aurel[0].thumb, "/projects/mockups/aurel-immigration-legal.webp");
  assert.equal(aurel[0].classification, "demo");
  assert.equal(aurel[0].industry, "Immigration / Professional Services");
  assert.equal(aurel[0].live, "https://immigration.mspixelpulse.com");
  assert.equal(aurel[0].stack.length, 5);
  assert.equal(projectCardSummary(aurel[0]), projectCardSummaries["aurel-immigration-legal"]);
});
