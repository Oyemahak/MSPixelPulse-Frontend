import test from "node:test";
import assert from "node:assert/strict";
import { servicePathForEditorialTopic } from "../data/servicePages.js";

test("routes broad editorial pillars to the strongest commercial service", () => {
  assert.equal(
    servicePathForEditorialTopic({ pillar: "AI & Search", category: "AI discovery", tags: [] }),
    "/services/website-seo",
  );
  assert.equal(
    servicePathForEditorialTopic({ pillar: "Performance & Care", category: "Website health", tags: [] }),
    "/services/website-maintenance",
  );
  assert.equal(
    servicePathForEditorialTopic({ pillar: "Planning", category: "Website planning", tags: [] }),
    "/services/small-business-websites",
  );
});

test("keeps specific platform and commerce topics ahead of pillar fallbacks", () => {
  assert.equal(
    servicePathForEditorialTopic({ pillar: "Platforms & Growth", category: "WordPress", tags: [] }),
    "/services/wordpress-development",
  );
  assert.equal(
    servicePathForEditorialTopic({ pillar: "Platforms & Growth", category: "Online store", tags: ["WooCommerce"] }),
    "/services/ecommerce-development",
  );
});
