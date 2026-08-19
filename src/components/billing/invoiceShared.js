import { invoiceTotals } from "@/lib/invoicePdf.js";
import {
  defaultPaymentPercent,
  dueDateForTerms,
  legacyKindForPaymentStage,
  normalizePaymentStage,
} from "@/lib/invoiceCalculations.js";

export const invoiceStatuses = [
  "draft",
  "sent",
  "uploaded",
  "partially_paid",
  "paid",
  "overdue",
  "cancelled",
  "archived",
];

export const paymentMethods = [
  "Interac e-Transfer",
  "Bank transfer",
  "Cash",
  "Cheque",
  "Remitly",
  "Other",
];

export function statusLabel(value) {
  const labels = {
    draft: "Draft",
    sent: "Sent",
    uploaded: "Uploaded",
    partially_paid: "Partially paid",
    paid: "Paid",
    overdue: "Overdue",
    cancelled: "Cancelled",
    archived: "Archived",
  };
  return labels[value] || "Draft";
}

export function formatMoney(value, currency = "CAD") {
  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: String(currency || "CAD").toUpperCase(),
    }).format(Number(value || 0));
  } catch {
    return `${Number(value || 0).toFixed(2)} ${currency || "CAD"}`;
  }
}

export function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export function dateInput(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function clientFromProject(project = {}) {
  const client = project.client || {};
  return {
    contactName: client.name || project.clientName || "",
    businessName: client.businessName || project.clientCompany || "",
    email: client.email || project.clientEmail || "",
    phone: client.phone || "",
    address: client.billingAddress || client.address || "",
    website: client.businessWebsite || "",
    logoUrl: "",
  };
}

export function projectIdOf(invoice) {
  return String(invoice?.project?._id || invoice?.project || "");
}

export function invoiceDraft({ settings = {}, invoiceNumber = "", project } = {}) {
  const issueDate = new Date();
  const issueDateText = issueDate.toISOString().slice(0, 10);
  const paymentTermsPreset = settings.defaultPaymentTermsPreset || "net_14";
  const dueDate = dueDateForTerms(issueDateText, paymentTermsPreset);

  return {
    sourceType: "generated",
    kind: "other",
    paymentStage: "full",
    paymentPercent: 100,
    projectValue: 0,
    customAmount: 0,
    customPaymentMode: "percentage",
    paymentTermsPreset,
    invoiceNumber,
    title: project?.title ? `${project.title} services` : "Professional website services",
    projectTitle: project?.title || "",
    projectId: project?._id || "",
    status: "sent",
    issueDate: issueDateText,
    dueDate,
    currency: settings.currency || "CAD",
    pageSize: settings.pageSize || "LETTER",
    sender: { ...(settings.sender || {}) },
    clientDetails: clientFromProject(project),
    lineItems: [
      { description: "Website design and development", quantity: 1, unitPrice: 0 },
    ],
    discountAmount: 0,
    chargeTax: Boolean(settings.chargeTax),
    taxLabel: settings.taxLabel || "HST",
    taxRate: Number(settings.taxRate || 0),
    taxRegistrationNumber: settings.taxRegistrationNumber || "",
    taxNote: settings.taxNote || "",
    paymentTerms: settings.paymentTerms || "",
    paymentNotice: settings.paymentNotice || "",
    paymentReference: settings.paymentReference || "",
    paymentMethods: (settings.paymentMethods || []).map((method) => ({ ...method })),
    scopeTerms: settings.scopeTerms || "",
    refundTerms: settings.refundTerms || "",
    closingMessage: settings.closingMessage || "",
    footerText: settings.footerText || "",
    showPageNumbers: settings.showPageNumbers !== false,
    notes: settings.defaultNotes || "",
    internalNotes: "",
    payments: [],
    amountPaid: 0,
    ...invoiceTotals({}),
  };
}

export function draftFromInvoice(invoice = {}, project) {
  const paymentStage = normalizePaymentStage(invoice.paymentStage, invoice.kind);
  return {
    ...invoiceDraft({ invoiceNumber: invoice.invoiceNumber, project }),
    ...invoice,
    sourceType: invoice.sourceType || "uploaded",
    paymentStage,
    paymentPercent: invoice.paymentPercent ?? defaultPaymentPercent(paymentStage),
    projectValue: Number(invoice.projectValue ?? invoice.subtotal ?? invoice.total ?? 0),
    customAmount: ["custom", "other"].includes(paymentStage) ? Number(invoice.subtotal || invoice.total || 0) : 0,
    customPaymentMode: paymentStage === "custom" && Number(invoice.paymentPercent || 0) > 0 ? "percentage" : "amount",
    paymentTermsPreset: invoice.paymentTermsPreset || "custom",
    projectId: projectIdOf(invoice) || project?._id || "",
    projectTitle: project?.title || invoice.projectTitle || invoice.title || "",
    issueDate: dateInput(invoice.issueDate),
    dueDate: dateInput(invoice.dueDate),
    sender: { ...(invoice.sender || {}) },
    clientDetails: { ...(invoice.clientDetails || clientFromProject(project)) },
    lineItems: Array.isArray(invoice.lineItems) && invoice.lineItems.length
      ? invoice.lineItems.map((item) => ({
          description: item.description || "",
          quantity: Number(item.quantity || 0),
          unitPrice: Number(item.unitPrice || 0),
        }))
      : [{ description: invoice.title || "Professional services", quantity: 1, unitPrice: Number(invoice.total || 0) }],
    payments: Array.isArray(invoice.payments) ? invoice.payments : [],
  };
}

export function invoicePayload(draft = {}) {
  const totals = invoiceTotals(draft);
  const paymentStage = normalizePaymentStage(draft.paymentStage, draft.kind);
  return {
    sourceType: draft.sourceType || "generated",
    kind: legacyKindForPaymentStage(paymentStage),
    paymentStage,
    paymentPercent: Number(draft.paymentPercent || defaultPaymentPercent(paymentStage)),
    projectValue: Number(draft.projectValue || 0),
    paymentTermsPreset: draft.paymentTermsPreset || "custom",
    invoiceNumber: String(draft.invoiceNumber || "").trim(),
    title: String(draft.title || "").trim(),
    status: draft.status,
    issueDate: draft.issueDate || null,
    dueDate: draft.dueDate || null,
    currency: String(draft.currency || "CAD").toUpperCase(),
    pageSize: draft.pageSize || "LETTER",
    sender: draft.sender,
    clientDetails: draft.clientDetails,
    lineItems: draft.lineItems.map((item) => ({
      description: String(item.description || "").trim(),
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice || 0),
      amount: Number(item.quantity || 0) * Number(item.unitPrice || 0),
    })),
    discountAmount: Number(draft.discountAmount || 0),
    chargeTax: Boolean(draft.chargeTax),
    taxLabel: draft.taxLabel || "",
    taxRate: Number(draft.taxRate || 0),
    taxRegistrationNumber: draft.taxRegistrationNumber || "",
    taxNote: draft.taxNote || "",
    paymentTerms: draft.paymentTerms || "",
    paymentNotice: draft.paymentNotice || "",
    paymentReference: draft.paymentReference || "",
    paymentMethods: draft.paymentMethods || [],
    scopeTerms: draft.scopeTerms || "",
    refundTerms: draft.refundTerms || "",
    closingMessage: draft.closingMessage || "",
    footerText: draft.footerText || "",
    showPageNumbers: draft.showPageNumbers !== false,
    notes: draft.notes || "",
    internalNotes: draft.internalNotes || "",
    payments: draft.payments || [],
    ...totals,
  };
}
