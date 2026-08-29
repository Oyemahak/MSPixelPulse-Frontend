import test from "node:test";
import assert from "node:assert/strict";
import {
  ANALYTICS_MEASUREMENT_ID,
  classifyTrafficSource,
  containsPotentialPii,
  isTrackablePublicPath,
  sanitizeAnalyticsParameters,
  sanitizePageLocation,
  sanitizePageReferrer,
} from "./analytics.js";

test("uses the production GA4 measurement ID", () => {
  assert.equal(ANALYTICS_MEASUREMENT_ID, "G-02FD3CJQ9V");
});

test("classifies priority AI and search referrers", () => {
  const context = (referrer) => ({
    landingUrl: "https://mspixelpulse.com/services",
    referrer,
    siteOrigin: "https://mspixelpulse.com",
  });

  assert.equal(classifyTrafficSource(context("https://chatgpt.com/")), "chatgpt");
  assert.equal(classifyTrafficSource(context("https://www.perplexity.ai/")), "perplexity");
  assert.equal(classifyTrafficSource(context("https://gemini.google.com/")), "gemini");
  assert.equal(classifyTrafficSource(context("https://copilot.microsoft.com/")), "copilot");
  assert.equal(classifyTrafficSource(context("https://www.google.ca/")), "google");
  assert.equal(classifyTrafficSource(context("https://www.bing.com/")), "bing");
  assert.equal(classifyTrafficSource(context("")), "direct");
  assert.equal(
    classifyTrafficSource({ ...context(""), landingUrl: "https://mspixelpulse.com/?utm_source=google" }),
    "google",
  );
  assert.equal(
    classifyTrafficSource({ ...context(""), landingUrl: "https://mspixelpulse.com/?utm_source=bing" }),
    "bing",
  );
});

test("keeps valid campaign attribution while removing arbitrary and PII query data", () => {
  const location = sanitizePageLocation(
    "https://mspixelpulse.com/contact?email=person%40example.com&utm_source=chatgpt&utm_medium=referral&utm_campaign=agency_launch&gclid=abc123&phone=4165551234#private",
  );

  assert.equal(
    location,
    "https://mspixelpulse.com/contact?utm_source=chatgpt&utm_medium=referral&utm_campaign=agency_launch&gclid=abc123",
  );
  assert.equal(location.includes("person"), false);
  assert.equal(location.includes("4165551234"), false);
  assert.equal(location.includes("#"), false);
});

test("sanitizes referrers and event parameters without contact details", () => {
  assert.equal(
    sanitizePageReferrer("https://chatgpt.com/c/secret?email=person@example.com"),
    "https://chatgpt.com/",
  );
  assert.equal(containsPotentialPii("person@example.com"), true);
  assert.equal(containsPotentialPii("+1 (416) 555-1234"), true);
  assert.deepEqual(
    sanitizeAnalyticsParameters({
      lead_type: "project_inquiry",
      email: "person@example.com",
      phone: "+1 (416) 555-1234",
      valid_number: 2,
    }),
    { lead_type: "project_inquiry", valid_number: 2 },
  );
});

test("tracks public pages but excludes auth and portal paths", () => {
  assert.equal(isTrackablePublicPath("/"), true);
  assert.equal(isTrackablePublicPath("/services/website-design"), true);
  assert.equal(isTrackablePublicPath("/login"), false);
  assert.equal(isTrackablePublicPath("/admin"), false);
  assert.equal(isTrackablePublicPath("/client/projects"), false);
  assert.equal(isTrackablePublicPath("/dev/requirements"), false);
});
