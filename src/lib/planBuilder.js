import {
  maintenanceOptions,
  pageSizeOptions,
  planAddons,
  planBuilderServices,
  pricingModes,
} from "../data/plans.js";

export const PLAN_BUILDER_STORAGE_KEY = "mspixelpulse.pricing-builder.v1";

const byId = (items, id) => items.find((item) => item.id === id);

export function sanitizeBuilderSelection(value = {}) {
  const service = byId(planBuilderServices, value.serviceId);
  const pageSize = byId(pageSizeOptions, value.pageSizeId);
  const maintenance = service?.mode === pricingModes.HOURLY
    ? maintenanceOptions[0]
    : byId(maintenanceOptions, value.maintenanceId) || maintenanceOptions[0];
  const selectedAddonIds = Array.from(new Set(Array.isArray(value.addonIds) ? value.addonIds : []))
    .filter((id) => byId(planAddons, id));
  const addonIds = service?.mode === pricingModes.HOURLY ? [] : selectedAddonIds;

  return {
    serviceId: service?.id || "",
    pageSizeId: pageSize?.id || "",
    addonIds,
    maintenanceId: maintenance.id,
    notes: String(value.notes || "").trim().slice(0, 500),
  };
}

export function planSelectionKey(value = {}) {
  const selection = sanitizeBuilderSelection(value);
  return [
    selection.serviceId,
    selection.pageSizeId,
    [...selection.addonIds].sort().join(","),
    selection.maintenanceId,
  ].join("|");
}

export function calculatePlanEstimate(value = {}) {
  const selection = sanitizeBuilderSelection(value);
  const service = byId(planBuilderServices, selection.serviceId);
  const pageSize = byId(pageSizeOptions, selection.pageSizeId);
  const addons = selection.addonIds.map((id) => byId(planAddons, id)).filter(Boolean);
  const maintenance = byId(maintenanceOptions, selection.maintenanceId) || maintenanceOptions[0];

  if (!service) {
    return { selection, service: null, pageSize, addons, maintenance, kind: "incomplete", amount: null, label: "Choose a service to begin" };
  }

  if (service.mode === pricingModes.HOURLY) {
    return {
      selection, service, pageSize, addons, maintenance,
      kind: pricingModes.HOURLY,
      amount: service.hourlyRate,
      baseAmount: service.hourlyRate,
      pageAdjustment: 0,
      addonTotal: 0,
      label: `$${service.hourlyRate} CAD/hour`,
      lineItems: [
        { label: "Approved maintenance rate", value: `$${service.hourlyRate} CAD/hour` },
        { label: "Larger development", value: "Quoted separately" },
      ],
    };
  }

  if (service.mode === pricingModes.CUSTOM) {
    return {
      selection, service, pageSize, addons, maintenance,
      kind: pricingModes.CUSTOM,
      amount: service.basePrice,
      baseAmount: service.basePrice,
      pageAdjustment: 0,
      addonTotal: 0,
      label: `From $${service.basePrice.toLocaleString("en-CA")} CAD + custom scoping`,
      lineItems: [
        { label: "Development starting point", value: `From $${service.basePrice.toLocaleString("en-CA")} CAD` },
        { label: "Selected features", value: addons.length ? "Scoped in written quote" : "To be confirmed" },
      ],
    };
  }

  const pageAdjustment = pageSize?.adjustment || 0;
  const addonTotal = addons.reduce((total, addon) => total + addon.price, 0);
  const amount = service.basePrice + pageAdjustment + addonTotal;
  const prefix = service.mode === pricingModes.STARTING ? "From " : "Estimated ";
  const formatCad = (value) => `$${value.toLocaleString("en-CA")} CAD`;

  return {
    selection, service, pageSize, addons, maintenance,
    kind: service.mode,
    amount,
    baseAmount: service.basePrice,
    pageAdjustment,
    addonTotal,
    label: `${prefix}$${amount.toLocaleString("en-CA")} CAD`,
    lineItems: [
      {
        label: service.mode === pricingModes.STARTING ? "Service starting point" : "Base website",
        value: formatCad(service.basePrice),
      },
      ...(pageSize ? [{
        label: `Page size · ${pageSize.label}`,
        value: pageAdjustment ? `+${formatCad(pageAdjustment)}` : "Included",
      }] : []),
      ...addons.map((addon) => ({ label: addon.label, value: `+${formatCad(addon.price)}` })),
    ],
  };
}

export function buildPlanSearchParams(value = {}) {
  const selection = sanitizeBuilderSelection(value);
  const params = new URLSearchParams({ inquiry: "builder" });
  if (selection.serviceId) params.set("projectType", selection.serviceId);
  if (selection.pageSizeId) params.set("scope", selection.pageSizeId);
  if (selection.addonIds.length) params.set("addons", selection.addonIds.join(","));
  if (selection.maintenanceId) params.set("maintenance", selection.maintenanceId);
  return params;
}

export function readPlanSearchParams(searchParams) {
  return sanitizeBuilderSelection({
    serviceId: searchParams?.get("projectType") || "",
    pageSizeId: searchParams?.get("scope") || "",
    addonIds: (searchParams?.get("addons") || "").split(",").filter(Boolean),
    maintenanceId: searchParams?.get("maintenance") || "none",
  });
}

export function savePlanDraft(value, step) {
  if (typeof window === "undefined") return;
  try {
    const safeStep = Number.isInteger(step) && step >= 1 && step <= 4 ? step : undefined;
    window.sessionStorage.setItem(PLAN_BUILDER_STORAGE_KEY, JSON.stringify({
      ...sanitizeBuilderSelection(value),
      ...(safeStep ? { step: safeStep } : {}),
    }));
  } catch {
    // Query parameters still preserve structural selections if storage is unavailable.
  }
}

export function loadPlanDraft() {
  if (typeof window === "undefined") return sanitizeBuilderSelection();
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(PLAN_BUILDER_STORAGE_KEY) || "{}");
    const selection = sanitizeBuilderSelection(stored);
    const step = Number.isInteger(stored.step) && stored.step >= 1 && stored.step <= 4 ? stored.step : 1;
    return { ...selection, step };
  } catch {
    return sanitizeBuilderSelection();
  }
}

export function clearPlanDraft() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(PLAN_BUILDER_STORAGE_KEY);
  } catch {
    // Nothing else is required if storage is blocked.
  }
}

export function buildPlanSummary(value = {}) {
  const estimate = calculatePlanEstimate(value);
  if (!estimate.service) return null;
  const lines = [
    `Project type: ${estimate.service.label}`,
    `Page count: ${estimate.pageSize?.label || "Not selected"}`,
    `Add-ons: ${estimate.addons.length ? estimate.addons.map((addon) => addon.label).join(", ") : "None selected"}`,
    `Maintenance: ${estimate.maintenance.label}`,
    ...estimate.lineItems.map((item) => `${item.label}: ${item.value}`),
    `Planning estimate: ${estimate.label}`,
    `Builder notes: ${estimate.selection.notes || "None provided"}`,
  ];
  return { ...estimate, lines };
}
