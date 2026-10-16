import test from "node:test";
import { projects as curatedProjects } from "../data/projects.js";
import assert from "node:assert/strict";
import {
  fallbackPublicProjects,
  normalizePublicMediaUrl,
  normalizePublicProject,
  normalizePublicProjects,
} from "./publicPortfolio.js";

test("rewrites legacy same-site project media to canonical local paths", () => {
  assert.equal(
    normalizePublicMediaUrl("https://mspixelpulse.vercel.app/projects/mockups/canstem-education.webp"),
    "/projects/mockups/canstem-education.webp",
  );
  assert.equal(
    normalizePublicMediaUrl("https://capstone-frontend.vercel.app/projects/mockups/aimze-studio.webp?v=2"),
    "/projects/mockups/aimze-studio.webp?v=2",
  );
  assert.equal(
    normalizePublicMediaUrl("https://images.example.com/projects/preview.webp"),
    "https://images.example.com/projects/preview.webp",
  );
});

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

test("keeps API content authoritative while preserving release-tested local captures", () => {
  const projects = normalizePublicProjects([{
    _id: "canstem-api",
    slug: "canstem-education",
    title: "CanSTEM from API",
    projectClassification: "live",
    technologies: ["WordPress"],
    requirements: "backend project requirements summary",
  }]);

  assert.equal(
    projects.find((project) => project.slug === "canstem-education")?.title,
    "CanSTEM from API",
  );
  assert.equal(
    projects.find((project) => project.slug === "canstem-education")?.thumb,
    "/projects/mockups/canstem-education.webp",
  );
  assert.ok(Array.isArray(projects.find((project) => project.slug === "canstem-education")?.requirements));
  assert.equal(projects.find((project) => project.slug === "canstem-education")?.requirements.length, 3);
  assert.equal(
    normalizePublicProjects([{
      _id: "nexus-api",
      slug: "nexus-education-private-school",
      liveUrl: "https://nexuseps.vercel.app/",
    }]).find((project) => project.slug === "nexus-education-private-school")?.live,
    "https://nexuseps.com/",
  );
  assert.equal(projects.filter((project) => project.slug === "canstem-education").length, 1);
  assert.equal(projects.find((project) => project.slug === "wedding-and-events")?.classification, "demo");
  assert.equal(projects.find((project) => project.slug === "aurelia-restaurant-bar")?.classification, "demo");
  assert.equal(projects.length, fallbackPublicProjects.length);
});

test("keeps all 14 approved demos while preserving production Unity content and verified Lumina", () => {
  const projects = normalizePublicProjects([
    {
      _id: "lumina-api",
      slug: "lumina-dental-studio",
      projectClassification: "live",
      liveUrl: "https://demo-lumina-dental.vercel.app",
      verifiedLiveUrl: "https://dental.mspixelpulse.com",
      deploymentStatus: "READY",
      technologies: ["Vite"],
    },
    {
      _id: "unity-api",
      slug: "unity-and-hope-home-care",
      repositoryUrl: "https://github.com/MSPixelPulseAgency/unity-and-hope-home-care",
      liveUrl: "https://healthcare.mspixelpulse.com",
    },
  ]);
  const businesses = projects.filter((project) => project.businessDemo);
  const lumina = businesses.find((project) => project.slug === "lumina-dental-studio");
  const unity = projects.find((project) => project.slug === "unity-and-hope-home-care");

  assert.equal(businesses.length, 14);
  assert.equal(new Set(businesses.map((project) => project.githubRepository)).size, 14);
  assert.equal(lumina.live, "https://dental.mspixelpulse.com");
  assert.equal(lumina.verifiedLiveUrl, "https://dental.mspixelpulse.com");
  assert.equal(lumina.deploymentStatus, "READY");
  assert.equal(lumina.classification, "demo");
  assert.equal(lumina.platform, "Next.js");
  assert.equal(lumina.previewStatus, undefined);
  assert.equal(unity.businessDemo, undefined);
  assert.equal(unity.plannedCategorySubdomain, undefined);
  assert.equal(unity.repo, "https://github.com/MSPixelPulseAgency/unity-and-hope-home-care");
  assert.equal(unity.live, "https://uhhomehealth.com/");
  assert.equal(projects.filter((project) => project.slug === lumina.slug).length, 1);
  for (const project of businesses) {
    assert.equal(project.domainStatus, "VERIFIED");
    assert.equal(project.live, project.plannedCategorySubdomain);
    assert.equal(project.live, project.verifiedLiveUrl);
  }
});

test("publishes AUREL FRAME with the verified branded destination and preserves it against stale API data", () => {
  const prepared = curatedProjects.find((project) => project.slug === "aurel-frame");
  assert.equal(prepared.title, "AUREL FRAME — Wedding & Event Photography");
  assert.equal(prepared.industry, "Photography & Videography");
  assert.equal(prepared.repo, "https://github.com/MSPixelPulseAgency/mspixelpulse-demo-photographer");
  assert.equal(prepared.published, true);
  assert.equal(prepared.live, "https://photographer.mspixelpulse.com");
  assert.equal(prepared.verifiedLiveUrl, prepared.live);
  assert.ok(fallbackPublicProjects.some((project) => project.slug === prepared.slug));
  assert.ok(prepared.requirements.length > 0);
  assert.ok(prepared.solution.length > 0);
  assert.match(prepared.result, /illustrative/);
  const merged = normalizePublicProjects([{
    _id: "aurel-frame-api", slug: "aurel-frame", projectClassification: "live",
    liveUrl: "https://stale-preview.example.com", title: "Stale API name", technologies: ["Vite"],
  }]).find((project) => project.slug === prepared.slug);
  assert.equal(merged.title, prepared.title);
  assert.equal(merged.live, prepared.live);
  assert.equal(merged.classification, "demo");
  assert.equal(merged.repo, prepared.repo);
  assert.deepEqual(merged.stack, prepared.stack);
});


test("verified SAVORA restaurant platform entries are published with their production URLs", () => {
  const expected = {
    "savora-kitchen-table": "https://restaurant.mspixelpulse.com",
    "savora-restaurant-operations": "https://orders.restaurant.mspixelpulse.com",
  };
  for (const [slug, url] of Object.entries(expected)) {
    const entry = curatedProjects.find((project) => project.slug === slug);
    assert.ok(entry);
    assert.equal(entry.published, true);
    assert.equal(entry.live, url);
    assert.equal(entry.verifiedLiveUrl, url);
    assert.equal(entry.domainStatus, "VERIFIED");
    assert.ok(entry.thumb.startsWith("/projects/mockups/"));
    assert.equal(fallbackPublicProjects.some((project) => project.slug === slug), true);
  }
  const aurelia = curatedProjects.find((project) => project.slug === "aurelia-restaurant-bar");
  assert.equal(aurelia.live, "https://bar.mspixelpulse.com");
});
