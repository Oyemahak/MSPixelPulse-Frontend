import { invoiceTotals } from "@/lib/invoicePdf.js";

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
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 14);

  return {
    sourceType: "generated",
    kind: "other",
    invoiceNumber,
    title: project?.title ? `${project.title} services` : "Professional website services",
    projectTitle: project?.title || "",
    projectId: project?._id || "",
    status: "sent",
    issueDate: issueDate.toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
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
    notes: settings.defaultNotes || "",
    internalNotes: "",
    payments: [],
    amountPaid: 0,
    ...invoiceTotals({}),
  };
}

export function draftFromInvoice(invoice = {}, project) {
  return {
    ...invoiceDraft({ invoiceNumber: invoice.invoiceNumber, project }),
    ...invoice,
    sourceType: invoice.sourceType || "uploaded",
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
  return {
    sourceType: draft.sourceType || "generated",
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
    notes: draft.notes || "",
    internalNotes: draft.internalNotes || "",
    payments: draft.payments || [],
    ...totals,
  };
}
