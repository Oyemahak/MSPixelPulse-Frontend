import test from "node:test";
import assert from "node:assert/strict";
import { cleanExternalUrl } from "./cleanExternalLink.js";

test("strips GA linker parameters and keeps legitimate query parameters", () => {
  assert.equal(cleanExternalUrl("https://flower.mspixelpulse.com/?_gl=1*abc*_ga*123*_ga_02FD3CJQ9V*xyz"), "https://flower.mspixelpulse.com/");
  assert.equal(cleanExternalUrl("https://petgrooming.mspixelpulse.com/?ref=portfolio&_gl=1*abc"), "https://petgrooming.mspixelpulse.com/?ref=portfolio");
  assert.equal(cleanExternalUrl("https://dental.mspixelpulse.com"), "https://dental.mspixelpulse.com/");
  assert.equal(cleanExternalUrl("not a url"), "not a url");
});
