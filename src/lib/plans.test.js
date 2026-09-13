import test from "node:test";
import assert from "node:assert/strict";
import { mergePricingPlans } from "../data/plans.js";

test("keeps release-managed prices while applying safe persisted editorial content", () => {
  const plans = mergePricingPlans([{
    key: "starter",
    name: "Starter Website",
    price: 99,
    priceSuffix: "USD",
    badge: "Editor badge",
    summary: "Editor summary",
    features: ["First", "Second", "Third", "Fourth", "Fifth"],
    cta: "Editor CTA",
  }]);
  const starter = plans.find((plan) => plan.key === "starter");

  assert.equal(starter.name, "Starter Website");
  assert.equal(starter.badge, "Editor badge");
  assert.equal(starter.price, 2000);
  assert.equal(starter.priceSuffix, "CAD");
  assert.equal(starter.features.length, 4);
  assert.equal(starter.cta, "Editor CTA");
});
