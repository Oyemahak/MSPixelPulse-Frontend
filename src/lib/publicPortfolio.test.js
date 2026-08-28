import test from "node:test";
import assert from "node:assert/strict";
import {
  fallbackPublicProjects,
  normalizePublicProject,
  normalizePublicProjects,
} from "./publicPortfolio.js";

test("normalizes API portfolio fields into the public case-study shape", () => {
  const project = normalizePublicProject({
    _id: "project-1",
    slug: "sample-demo",
    title: "Sample Demo",
    projectClassification: "demo",
    technologies: ["React", "Vite"],
    liveUrl: "https://example.com",
    repositoryUrl: "https://github.com/example/demo",
    servicesProvided: ["Website design"],
    keyFeatures: ["Responsive layout"],
  });

  assert.equal(project.classification, "demo");
  assert.equal(project.label, "Agency Demo");
  assert.deepEqual(project.stack, ["React", "Vite"]);
  assert.equal(project.live, "https://example.com");
  assert.equal(project.repo, "https://github.com/example/demo");
});

test("keeps API records authoritative while appending missing curated local demos", () => {
  const projects = normalizePublicProjects([{
    _id: "canstem-api",
    slug: "canstem-education",
    title: "CanSTEM from API",
    projectClassification: "live",
    technologies: ["WordPress"],
  }]);

  assert.equal(
    projects.find((project) => project.slug === "canstem-education")?.title,
    "CanSTEM from API",
  );
  assert.equal(projects.filter((project) => project.slug === "canstem-education").length, 1);
  assert.equal(projects.find((project) => project.slug === "wedding-and-events")?.classification, "demo");
  assert.equal(projects.find((project) => project.slug === "aurelia-restaurant-bar")?.classification, "demo");
  assert.equal(projects.length, fallbackPublicProjects.length);
});
