import test from "node:test";
import { projects as curatedProjects } from "../data/projects.js";
import assert from "node:assert/strict";
import {
  fallbackPublicProjects,
  normalizePublicMediaUrl,
  normalizePublicProject,
  normalizePublicProjects,
} from "./publicPortfolio.js";

const publishedWellness = { _id: "wellness-api", slug: "ms-pixelpulse-wellness-studio", projectClassification: "demo", liveUrl: "https://wellness.mspixelpulse.com" };

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
  const projects = normalizePublicProjects([publishedWellness, {
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

test("keeps all 14 approved demos after combining SAVORA while preserving production Unity content and verified Lumina", () => {
  const projects = normalizePublicProjects([
    publishedWellness,
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


test("SAVORA is one canonical platform even when stale API operations entries arrive", () => {
  const canonical = curatedProjects.find((project) => project.slug === "savora-kitchen-table");
  assert.equal(canonical.operationsUrl, "https://orders.restaurant.mspixelpulse.com");
  assert.equal(canonical.live, "https://restaurant.mspixelpulse.com");
  assert.equal(canonical.title, "SAVORA — Restaurant Platform");
  const entries = normalizePublicProjects([
    {_id: "saved-storefront", slug: "savora-kitchen-table", title: "Old storefront", shortDescription: "Outdated copy", projectOverview: "Outdated overview"},
    {_id: "duplicate-storefront", slug: "savora-kitchen-table", title: "Duplicate storefront"},
    {_id: "saved-ops", slug: "savora-restaurant-operations", title: "SAVORA — Restaurant Operations"},
    {_id: "unrelated", slug: "independent-client", title: "Owner-managed project", technologies: ["Custom"]},
  ]);
  assert.equal(entries.filter((p) => p.slug.startsWith("savora-")).length, 1);
  const merged = entries.find((p) => p.slug === canonical.slug);
  assert.equal(merged.shortDescription, canonical.shortDescription);
  assert.equal(merged.overview, canonical.overview);
  assert.equal(merged.operationsUrl, canonical.operationsUrl);
  assert.equal(merged.screenshots.length, 4);
  assert.equal(entries.find((p) => p.slug === "independent-client").title, "Owner-managed project");
  assert.equal(curatedProjects.find((p) => p.slug === "aurelia-restaurant-bar").live, "https://bar.mspixelpulse.com");
});


test("Wellness uses one existing CMS identity and its current media, metadata and previews", () => {
  const input = { _id: "existing-wellness", slug: "ms-pixelpulse-wellness-studio", title: "Wellness V4 from Admin", projectClassification: "demo", industry: "Wellness", platform: "React", technologies: ["React", "Vite"], thumbnail: "https://mspixelpulse.com/projects/wellness-v4/cover.webp", liveUrl: "https://wellness.mspixelpulse.com", keyFeatures: ["36 treatments", "Email delivery NOT CONFIGURED"], mockupImages: [{url:"/projects/wellness-v4/desktop.webp", alt:"V4 desktop", caption:"Desktop"}, {url:"/projects/wellness-v4/mobile.webp", alt:"V4 mobile", caption:"Mobile"}] };
  const result = normalizePublicProjects([input]);
  const entry = result.find(p => p.slug === input.slug);
  assert.equal(result.filter(p => p.slug === input.slug).length, 1);
  assert.equal(entry._id, input._id);
  assert.equal(entry.title, input.title);
  assert.equal(entry.thumb, input.thumbnail);
  assert.deepEqual(entry.features, input.keyFeatures);
  assert.deepEqual(entry.stack, input.technologies);
  assert.deepEqual(entry.screenshots.map(p => p.width), [1440,390]);
  assert.equal(entry.live, input.liveUrl);
});


test("A successful CMS response cannot resurrect an unpublished Wellness record from fallback data", () => {
  assert.ok(fallbackPublicProjects.some(p => p.slug === "ms-pixelpulse-wellness-studio"));
  assert.equal(normalizePublicProjects([]).some(p => p.slug === "ms-pixelpulse-wellness-studio"), false);
});
