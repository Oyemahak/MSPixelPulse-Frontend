import assert from "node:assert/strict";
import test from "node:test";

import {
  dueDateForTerms,
  invoiceAmountForStage,
  legacyKindForPaymentStage,
  normalizePaymentStage,
} from "./invoiceCalculations.js";

test("payment stages calculate the required invoice amount", () => {
  const projectValue = 2000;
  assert.equal(invoiceAmountForStage({ projectValue, paymentStage: "full" }), 2000);
  assert.equal(invoiceAmountForStage({ projectValue, paymentStage: "advance" }), 1000);
  assert.equal(invoiceAmountForStage({ projectValue, paymentStage: "remaining" }), 1000);
  assert.equal(invoiceAmountForStage({ projectValue, paymentStage: "custom", paymentPercent: 25 }), 500);
  assert.equal(invoiceAmountForStage({ projectValue, paymentStage: "other", customAmount: 625.55 }), 625.55);
});

test("due-term presets produce exact calendar dates", () => {
  assert.equal(dueDateForTerms("2026-08-19", "due_on_receipt"), "2026-08-19");
  assert.equal(dueDateForTerms("2026-08-19", "net_7"), "2026-08-26");
  assert.equal(dueDateForTerms("2026-08-19", "net_14"), "2026-09-02");
  assert.equal(dueDateForTerms("2026-08-19", "net_30"), "2026-09-18");
  assert.equal(dueDateForTerms("2026-08-19", "custom", "2026-09-30"), "2026-09-30");
});

test("legacy kinds remain readable after the workflow expansion", () => {
  assert.equal(normalizePaymentStage("", "advance"), "advance");
  assert.equal(normalizePaymentStage("", "final"), "remaining");
  assert.equal(legacyKindForPaymentStage("remaining"), "final");
});
