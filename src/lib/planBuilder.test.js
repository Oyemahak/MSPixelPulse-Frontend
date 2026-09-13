import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPlanSearchParams,
  buildPlanSummary,
  calculatePlanEstimate,
  planSelectionKey,
  readPlanSearchParams,
  sanitizeBuilderSelection,
} from "./planBuilder.js";

test("calculates a fixed website planning estimate from central scope and add-on data", () => {
  const result = calculatePlanEstimate({
    serviceId: "new-website",
    pageSizeId: "small",
    addonIds: ["blog", "analytics"],
  });
  assert.equal(result.kind, "fixed");
  assert.equal(result.amount, 2450);
  assert.equal(result.label, "Estimated $2,450 CAD");
  assert.deepEqual(result.lineItems.map((item) => item.value), ["$1,000 CAD", "+$1,000 CAD", "+$300 CAD", "+$150 CAD"]);
});

test("keeps hourly and custom work free of misleading precise project totals", () => {
  const hourly = calculatePlanEstimate({ serviceId: "maintenance", pageSizeId: "large", addonIds: ["blog"] });
  assert.equal(hourly.label, "$25 CAD/hour");
  assert.deepEqual(hourly.addons, []);
  assert.equal(calculatePlanEstimate({ serviceId: "custom-development", pageSizeId: "large", addonIds: ["blog"] }).label, "From $4,000 CAD + custom scoping");
});

test("sanitizes builder query values and round-trips approved selections", () => {
  const selection = {
    serviceId: "moodle",
    pageSizeId: "medium",
    addonIds: ["content-migration", "unknown", "content-migration"],
    maintenanceId: "hourly",
    notes: "  Course migration and staff roles  ",
  };
  const fromQuery = readPlanSearchParams(buildPlanSearchParams(selection));
  assert.deepEqual(fromQuery.addonIds, ["content-migration"]);
  assert.equal(fromQuery.serviceId, "moodle");
  assert.equal(fromQuery.maintenanceId, "hourly");
  assert.equal(sanitizeBuilderSelection(selection).notes, "Course migration and staff roles");
});

test("compares structural selections without leaking notes between different plans", () => {
  const first = { serviceId: "redesign", pageSizeId: "single", addonIds: ["analytics"], maintenanceId: "hourly", notes: "Keep me" };
  const same = { ...first, notes: "Different note" };
  const different = { ...first, serviceId: "moodle" };
  assert.equal(planSelectionKey(first), planSelectionKey(same));
  assert.notEqual(planSelectionKey(first), planSelectionKey(different));
});

test("builds a readable lead summary", () => {
  const summary = buildPlanSummary({
    serviceId: "redesign",
    pageSizeId: "single",
    addonIds: [],
    maintenanceId: "none",
    notes: "Improve the mobile service flow.",
  });
  assert.match(summary.lines.join("\n"), /Project type: Website redesign/);
  assert.match(summary.lines.join("\n"), /Planning estimate: From \$400 CAD/);
  assert.match(summary.lines.join("\n"), /Improve the mobile service flow/);
});
