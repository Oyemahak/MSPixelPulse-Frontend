export const paymentStageOptions = [
  ["full", "Full payment", 100],
  ["advance", "Advance payment", 50],
  ["remaining", "Remaining balance", 50],
  ["custom", "Custom percentage", 0],
  ["other", "Other amount", 0],
];

export const paymentTermsOptions = [
  ["due_on_receipt", "Due on receipt", 0],
  ["net_7", "Net 7", 7],
  ["net_14", "Net 14", 14],
  ["net_30", "Net 30", 30],
  ["custom", "Custom date", null],
];

function boundedMoney(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return 0;
  return Math.round(Math.max(number, 0) * 100) / 100;
}

function boundedPercent(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return 0;
  return Math.round(Math.min(Math.max(number, 0), 100) * 1000) / 1000;
}

export function normalizePaymentStage(value, legacyKind = "") {
  const stage = String(value || "").toLowerCase();
  if (paymentStageOptions.some(([key]) => key === stage)) return stage;
  if (legacyKind === "advance") return "advance";
  if (legacyKind === "final") return "remaining";
  return "other";
}

export function paymentStageLabel(value, legacyKind = "") {
  const stage = normalizePaymentStage(value, legacyKind);
  return paymentStageOptions.find(([key]) => key === stage)?.[1] || "Other amount";
}

export function defaultPaymentPercent(stage) {
  if (stage === "full") return 100;
  if (stage === "advance" || stage === "remaining") return 50;
  return 0;
}

export function legacyKindForPaymentStage(stage) {
  if (stage === "advance") return "advance";
  if (stage === "remaining") return "final";
  return "other";
}

export function invoiceAmountForStage({ projectValue, paymentStage, paymentPercent, customAmount } = {}) {
  const value = boundedMoney(projectValue);
  const stage = normalizePaymentStage(paymentStage);
  const custom = boundedMoney(customAmount);

  if (stage === "full") return value;
  if (stage === "advance" || stage === "remaining") return boundedMoney(value * 0.5);
  if (stage === "custom") return custom || boundedMoney(value * boundedPercent(paymentPercent) / 100);
  return custom;
}

export function dueDateForTerms(issueDate, preset, customDate = "") {
  if (preset === "custom") return customDate || "";
  const option = paymentTermsOptions.find(([key]) => key === preset);
  const offset = option?.[2];
  if (offset === null || offset === undefined) return customDate || "";

  const source = /^\d{4}-\d{2}-\d{2}$/.test(String(issueDate || ""))
    ? new Date(`${issueDate}T00:00:00.000Z`)
    : new Date(issueDate || Date.now());
  if (Number.isNaN(source.getTime())) return customDate || "";
  source.setUTCDate(source.getUTCDate() + offset);
  return source.toISOString().slice(0, 10);
}

export function paymentTermsLabel(preset) {
  return paymentTermsOptions.find(([key]) => key === preset)?.[1] || "Custom date";
}
