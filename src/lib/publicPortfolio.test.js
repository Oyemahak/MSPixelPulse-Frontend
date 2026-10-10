import test from "node:test";
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

test("keeps all 11 approved demos while preserving production Unity content and pending Lumina", () => {
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

  assert.equal(businesses.length, 11);
  assert.equal(new Set(businesses.map((project) => project.githubRepository)).size, 11);
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
