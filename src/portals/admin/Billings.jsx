import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LuCircleDollarSign,
  LuDownload,
  LuExternalLink,
  LuFilePlus2,
  LuMail,
  LuPencil,
  LuPlus,
  LuRefreshCw,
  LuSearch,
  LuSettings2,
  LuTrash2,
  LuUpload,
  LuBan,
  LuHistory,
  LuReceiptText,
} from "react-icons/lu";

import InvoiceDrawer from "@/components/billing/InvoiceDrawer.jsx";
import InvoiceEditor from "@/components/billing/InvoiceEditor.jsx";
import {
  InvoiceSettingsForm,
  PaymentForm,
  UploadInvoiceForm,
  VoidReceiptForm,
} from "@/components/billing/InvoiceForms.jsx";
import {
  formatDate,
  formatMoney,
  invoiceStatuses,
  projectIdOf,
  statusLabel,
} from "@/components/billing/invoiceShared.js";
import { invoices as invApi, projects as projectApi } from "@/lib/api.js";
import { paymentStageLabel } from "@/lib/invoiceCalculations.js";
import "../css/billing.css";

function downloadUrl(url) {
  if (!url) return "";
  return `${url}${url.includes("?") ? "&" : "?"}download=1`;
}

function StatusBadge({ status }) {
  return <span className={`invoice-status-badge is-${status || "draft"}`}>{statusLabel(status)}</span>;
}

function projectForInvoice(invoice, projects) {
  const id = projectIdOf(invoice);
  return projects.find((project) => String(project._id) === id);
}

export default function Billings() {
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [drawer, setDrawer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState("invoices");

  const load = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const [projectData, invoiceData, receiptData, settingsData, numberData] = await Promise.all([
        projectApi.list(),
        invApi.all(),
        invApi.receipts(),
        invApi.settings(),
        invApi.nextNumber(),
      ]);
      setProjects(projectData.projects || []);
      setInvoices(invoiceData.invoices || []);
      setReceipts(receiptData.receipts || []);
      setSettings(settingsData.settings || {});
      setInvoiceNumber(numberData.invoiceNumber || "");
    } catch (requestError) {
      setError(requestError?.message || "Billing records could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const visibleInvoices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const project = projectForInvoice(invoice, projects);
      const client = invoice.clientDetails || project?.client || {};
      const haystack = [
        invoice.invoiceNumber,
        invoice.title,
        project?.title,
        client.contactName,
        client.name,
        client.businessName,
        client.email,
      ].filter(Boolean).join(" ").toLowerCase();
      return (!needle || haystack.includes(needle)) && (!status || invoice.status === status);
    });
  }, [invoices, projects, query, status]);

  const summary = useMemo(() => invoices.reduce((result, invoice) => {
    const total = Number(invoice.total || 0);
    const balance = Number(invoice.balanceDue ?? Math.max(total - Number(invoice.amountPaid || 0), 0));
    result.invoiced += total;
    result.outstanding += balance;
    if (invoice.status === "overdue") result.overdue += balance;
    return result;
  }, { invoiced: 0, outstanding: 0, overdue: 0 }), [invoices]);

  const payments = useMemo(() => invoices.flatMap((invoice) => (invoice.payments || []).map((payment) => ({ ...payment, invoice }))).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)), [invoices]);

  const visibleReceipts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return receipts.filter((receipt) => !needle || [receipt.receiptNumber, receipt.invoiceNumber, receipt.paymentId, receipt.projectTitleSnapshot, receipt.clientSnapshot?.businessName, receipt.clientSnapshot?.contactName].filter(Boolean).join(" ").toLowerCase().includes(needle));
  }, [receipts, query]);

  function openDrawer(type, invoice = null) {
    setError("");
    setNotice("");
    setDrawer({ type, invoice });
  }

  async function finish(message) {
    setNotice(message);
    setDrawer(null);
    await load({ quiet: true });
  }

  async function saveGenerated({ draft, payload, file, invoice }) {
    setBusy(true);
    try {
      const projectId = draft?.projectId || projectIdOf(invoice);
      if (!projectId) throw new Error("Choose a client project.");
      if (file) {
        await invApi.upload(file, {
          projectId,
          kind: payload.kind || "other",
          invoiceId: invoice?._id || "",
          invoice: payload,
        });
      } else if (invoice?._id) {
        await invApi.update(projectId, invoice._id, payload);
      } else {
        await invApi.create(projectId, payload);
      }
      await finish(invoice ? "Invoice updated." : "Invoice created and securely uploaded.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadExisting({ file, projectId, invoiceId, payload }) {
    setBusy(true);
    try {
      await invApi.upload(file, { projectId, kind: "other", invoiceId, invoice: payload });
      await finish(invoiceId ? "Invoice file replaced." : "Existing invoice uploaded.");
    } finally {
      setBusy(false);
    }
  }

  async function recordPayment(payload) {
    const invoice = drawer?.invoice;
    setBusy(true);
    try {
      const result = await invApi.recordPayment(projectIdOf(invoice), invoice._id, payload);
      await load({ quiet: true });
      setDrawer({ type: "payment-success", result });
      setNotice(`Payment ${result.payment?.paymentId || ""} recorded and receipt ${result.receipt?.receiptNumber || ""} issued.`);
    } finally {
      setBusy(false);
    }
  }

  async function voidReceipt(receipt, reason) {
    setBusy(true);
    try {
      await invApi.voidReceipt(receipt._id, reason);
      await finish(`${receipt.receiptNumber} was voided and remains in the audit record.`);
    } finally {
      setBusy(false);
    }
  }

  async function saveSettings(payload) {
    setBusy(true);
    try {
      await invApi.updateSettings(payload);
      await finish("Invoice defaults saved.");
    } finally {
      setBusy(false);
    }
  }

  async function sendInvoice(invoice) {
    const project = projectForInvoice(invoice, projects);
    const email = invoice.clientDetails?.email || project?.client?.email || "";
    if (!email) {
      setError("Add a client email before preparing the invoice message.");
      return;
    }
    setBusy(true);
    try {
      if (invoice.status === "draft") {
        await invApi.update(projectIdOf(invoice), invoice._id, { status: "sent", sentAt: new Date().toISOString() });
        await load({ quiet: true });
      }
      const subject = encodeURIComponent(`Invoice ${invoice.invoiceNumber || "from MSPixelPulse"}`);
      const body = encodeURIComponent("Your MSPixelPulse invoice is available securely in your client portal. Please sign in to view or download it.");
      window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
    } catch (requestError) {
      setError(requestError?.message || "Invoice status could not be updated.");
    } finally {
      setBusy(false);
    }
  }

  async function removeInvoice(invoice) {
    const label = invoice.invoiceNumber || invoice.file?.name || "this invoice";
    if (!window.confirm(`Permanently delete ${label} and its stored file? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      await invApi.remove(projectIdOf(invoice), invoice._id);
      setNotice(`${label} was permanently deleted.`);
      await load({ quiet: true });
    } catch (requestError) {
      setError(requestError?.message || "Invoice could not be deleted.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-shell space-stack billing-page">
      <header className="page-header billing-page-header">
        <div>
          <div className="text-muted-xs">Client billing workspace</div>
          <h1 className="page-title">Billing</h1>
          <p className="text-muted">Manage invoices, payment records, and official receipts in one place.</p>
        </div>
        <div className="billing-primary-actions">
          <button type="button" className="btn btn-outline" onClick={() => openDrawer("settings")} disabled={!settings || loading}><LuSettings2 aria-hidden="true" /> Defaults</button>
          <button type="button" className="btn btn-outline" onClick={() => openDrawer("upload")} disabled={loading}><LuUpload aria-hidden="true" /> Upload existing</button>
          <button type="button" className="btn btn-primary" onClick={() => openDrawer("create")} disabled={!settings || loading}><LuPlus aria-hidden="true" /> Create invoice</button>
        </div>
      </header>

      <section className="billing-summary-grid" aria-label="Billing summary">
        <article><span>Total invoiced</span><strong>{formatMoney(summary.invoiced)}</strong><LuFilePlus2 aria-hidden="true" /></article>
        <article><span>Outstanding</span><strong>{formatMoney(summary.outstanding)}</strong><LuCircleDollarSign aria-hidden="true" /></article>
        <article><span>Overdue</span><strong>{formatMoney(summary.overdue)}</strong><LuCircleDollarSign aria-hidden="true" /></article>
      </section>

      <section className="card-surface billing-list-card">
        <div className="billing-tabs" role="tablist" aria-label="Billing records">
          <button type="button" role="tab" aria-selected={activeTab === "invoices"} className={activeTab === "invoices" ? "is-active" : ""} onClick={() => setActiveTab("invoices")}>Invoices <span>{invoices.length}</span></button>
          <button type="button" role="tab" aria-selected={activeTab === "payments"} className={activeTab === "payments" ? "is-active" : ""} onClick={() => setActiveTab("payments")}>Payments <span>{payments.length}</span></button>
          <button type="button" role="tab" aria-selected={activeTab === "receipts"} className={activeTab === "receipts" ? "is-active" : ""} onClick={() => setActiveTab("receipts")}>Receipts <span>{receipts.length}</span></button>
        </div>
        <div className="billing-toolbar">
          <label className="billing-search">
            <span className="sr-only">Search invoices</span>
            <LuSearch aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search invoice, project, or client" />
          </label>
          {activeTab === "invoices" ? <label className="billing-status-filter"><span className="sr-only">Filter by invoice status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{invoiceStatuses.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select></label> : null}
          <button type="button" className="portal-icon-button" onClick={() => load()} disabled={loading || busy} aria-label="Refresh invoices"><LuRefreshCw className={loading ? "animate-spin" : ""} aria-hidden="true" /></button>
        </div>

        {error ? <div className="billing-message is-error" role="alert">{error}</div> : null}
        {notice ? <div className="billing-message is-success" role="status">{notice}</div> : null}

        {activeTab === "invoices" ? <div className="billing-table-scroll" role="region" aria-label="Admin invoices" tabIndex="0">
          <table className="table billing-invoice-table">
            <thead><tr><th>Invoice</th><th>Project / client</th><th>Issued / due</th><th>Total / balance</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {visibleInvoices.map((invoice) => {
                const project = projectForInvoice(invoice, projects);
                const client = invoice.clientDetails || project?.client || {};
                return (
                  <tr key={invoice._id}>
                    <td data-label="Invoice"><strong>{invoice.invoiceNumber || "Unnumbered"}</strong><span>{paymentStageLabel(invoice.paymentStage, invoice.kind)} · {invoice.sourceType === "generated" ? "Generated PDF" : "Uploaded file"}</span></td>
                    <td data-label="Project / client"><strong>{project?.title || invoice.title || "Project invoice"}</strong><span>{client.contactName || client.name || client.businessName || "Unassigned client"}</span></td>
                    <td data-label="Issued / due"><strong>{formatDate(invoice.issueDate)}</strong><span>Due {formatDate(invoice.dueDate)}</span></td>
                    <td data-label="Total / balance"><strong>{formatMoney(invoice.total, invoice.currency)}</strong><span>{formatMoney(invoice.balanceDue, invoice.currency)} due</span></td>
                    <td data-label="Status"><StatusBadge status={invoice.status} /></td>
                    <td className="billing-row-actions">
                      {invoice.file?.url ? <a className="portal-icon-button" href={invoice.file.url} target="_blank" rel="noreferrer" aria-label={`View ${invoice.invoiceNumber || "invoice"}`}><LuExternalLink aria-hidden="true" /></a> : null}
                      {invoice.file?.url ? <a className="portal-icon-button" href={downloadUrl(invoice.file.url)} aria-label={`Download ${invoice.invoiceNumber || "invoice"}`}><LuDownload aria-hidden="true" /></a> : null}
                      <button type="button" className="portal-icon-button" onClick={() => openDrawer("edit", invoice)} aria-label={`Edit ${invoice.invoiceNumber || "invoice"}`}><LuPencil aria-hidden="true" /></button>
                      <button type="button" className="portal-icon-button" onClick={() => openDrawer("payment", invoice)} aria-label={`Record payment for ${invoice.invoiceNumber || "invoice"}`}><LuCircleDollarSign aria-hidden="true" /></button>
                      <button type="button" className="portal-icon-button" onClick={() => openDrawer("history", invoice)} aria-label={`View payment history for ${invoice.invoiceNumber || "invoice"}`}><LuHistory aria-hidden="true" /></button>
                      <button type="button" className="portal-icon-button" onClick={() => sendInvoice(invoice)} disabled={busy} aria-label={`Send ${invoice.invoiceNumber || "invoice"}`}><LuMail aria-hidden="true" /></button>
                      <button type="button" className="portal-icon-button danger" onClick={() => removeInvoice(invoice)} disabled={busy} aria-label={`Delete ${invoice.invoiceNumber || "invoice"}`}><LuTrash2 aria-hidden="true" /></button>
                    </td>
                  </tr>
                );
              })}
              {!visibleInvoices.length ? <tr><td className="billing-empty" colSpan="6">{loading ? "Loading invoices…" : "No invoices match these filters."}</td></tr> : null}
            </tbody>
          </table>
        </div> : null}

        {activeTab === "payments" ? <div className="billing-table-scroll" role="region" aria-label="Payment records" tabIndex="0"><table className="table billing-invoice-table"><thead><tr><th>Payment ID</th><th>Invoice</th><th>Date / method</th><th>Amount</th><th>Reference</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.paymentId || `${payment.invoice._id}-${payment.date}-${payment.amount}`}><td data-label="Payment ID"><strong>{payment.paymentId || "Legacy payment"}</strong></td><td data-label="Invoice"><strong>{payment.invoice.invoiceNumber || "Invoice"}</strong><span>{payment.invoice.title || "MSPixelPulse project"}</span></td><td data-label="Date / method"><strong>{formatDate(payment.date)}</strong><span>{payment.method || "Other"}</span></td><td data-label="Amount"><strong>{formatMoney(payment.amount, payment.invoice.currency)}</strong></td><td data-label="Reference"><span>{payment.reference || "-"}</span></td></tr>)}{!payments.length ? <tr><td className="billing-empty" colSpan="5">No payments have been recorded.</td></tr> : null}</tbody></table></div> : null}

        {activeTab === "receipts" ? <div className="billing-table-scroll" role="region" aria-label="Receipt records" tabIndex="0"><table className="table billing-invoice-table"><thead><tr><th>Receipt</th><th>Invoice / project</th><th>Payment</th><th>Amount</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visibleReceipts.map((receipt) => <tr key={receipt._id}><td data-label="Receipt"><strong>{receipt.receiptNumber}</strong><span>{formatDate(receipt.receiptDate)}</span></td><td data-label="Invoice / project"><strong>{receipt.invoiceNumber}</strong><span>{receipt.projectTitleSnapshot || "MSPixelPulse project"}</span></td><td data-label="Payment"><strong>{receipt.paymentId}</strong><span>{receipt.method}</span></td><td data-label="Amount"><strong>{formatMoney(receipt.amount, receipt.currency)}</strong><span>{formatMoney(receipt.balanceRemainingSnapshot, receipt.currency)} remaining</span></td><td data-label="Status"><span className={`invoice-status-badge is-${receipt.status}`}>{receipt.status === "void" ? "Void" : "Issued"}</span></td><td className="billing-row-actions">{receipt.file?.url ? <a className="portal-icon-button" href={receipt.file.url} target="_blank" rel="noreferrer" aria-label={`View ${receipt.receiptNumber}`}><LuReceiptText aria-hidden="true" /></a> : null}{receipt.file?.url ? <a className="portal-icon-button" href={downloadUrl(receipt.file.url)} aria-label={`Download ${receipt.receiptNumber}`}><LuDownload aria-hidden="true" /></a> : null}{receipt.status !== "void" ? <button type="button" className="portal-icon-button danger" onClick={() => openDrawer("void-receipt", receipt)} aria-label={`Void ${receipt.receiptNumber}`}><LuBan aria-hidden="true" /></button> : null}</td></tr>)}{!visibleReceipts.length ? <tr><td className="billing-empty" colSpan="6">No receipts match this search.</td></tr> : null}</tbody></table></div> : null}
      </section>

      {drawer?.type === "create" ? <InvoiceDrawer wide title="Create invoice" description="Build, preview, download, and securely add a branded invoice." onClose={() => setDrawer(null)}><InvoiceEditor projects={projects} settings={settings} invoiceNumber={invoiceNumber} busy={busy} onSubmit={saveGenerated} /></InvoiceDrawer> : null}
      {drawer?.type === "edit" ? <InvoiceDrawer wide title={`Edit ${drawer.invoice.invoiceNumber || "invoice"}`} description="Update billing details or replace the generated PDF." onClose={() => setDrawer(null)}><InvoiceEditor projects={projects} settings={settings} invoiceNumber={invoiceNumber} invoice={drawer.invoice} busy={busy} onSubmit={saveGenerated} /></InvoiceDrawer> : null}
      {drawer?.type === "upload" ? <InvoiceDrawer title="Upload existing invoice" description="Attach a PDF or supported image and add its billing details." onClose={() => setDrawer(null)}><UploadInvoiceForm projects={projects} invoiceNumber={invoiceNumber} busy={busy} onSubmit={uploadExisting} /></InvoiceDrawer> : null}
      {drawer?.type === "payment" ? <InvoiceDrawer title="Record payment" description={`${drawer.invoice.invoiceNumber || "Invoice"} · ${formatMoney(drawer.invoice.balanceDue, drawer.invoice.currency)} outstanding`} onClose={() => setDrawer(null)}><PaymentForm invoice={drawer.invoice} busy={busy} onSubmit={recordPayment} /></InvoiceDrawer> : null}
      {drawer?.type === "history" ? <InvoiceDrawer title="Payment history" description={drawer.invoice.invoiceNumber || "Invoice"} onClose={() => setDrawer(null)}><div className="receipt-history-list">{(drawer.invoice.payments || []).map((payment) => <article key={payment.paymentId || `${payment.date}-${payment.amount}`}><div><strong>{payment.paymentId || "Legacy payment"}</strong><span>{formatDate(payment.date)} · {payment.method || "Other"}</span></div><strong>{formatMoney(payment.amount, drawer.invoice.currency)}</strong></article>)}{!drawer.invoice.payments?.length ? <p className="billing-empty">No payments have been recorded.</p> : null}</div></InvoiceDrawer> : null}
      {drawer?.type === "payment-success" ? <InvoiceDrawer title="Payment recorded" description="The official receipt is ready." onClose={() => setDrawer(null)}><div className="payment-success-card" role="status"><LuReceiptText aria-hidden="true" /><h3>{formatMoney(drawer.result.payment?.amount, drawer.result.invoice?.currency)} received</h3><dl><div><dt>Payment ID</dt><dd>{drawer.result.payment?.paymentId}</dd></div><div><dt>Receipt</dt><dd>{drawer.result.receipt?.receiptNumber}</dd></div><div><dt>Invoice status</dt><dd>{statusLabel(drawer.result.invoice?.status)}</dd></div><div><dt>Remaining balance</dt><dd>{formatMoney(drawer.result.invoice?.balanceDue, drawer.result.invoice?.currency)}</dd></div></dl><div className="billing-primary-actions">{drawer.result.receipt?.file?.url ? <a className="btn btn-outline" href={drawer.result.receipt.file.url} target="_blank" rel="noreferrer"><LuExternalLink aria-hidden="true" /> View receipt</a> : null}{drawer.result.receipt?.file?.url ? <a className="btn btn-primary" href={downloadUrl(drawer.result.receipt.file.url)}><LuDownload aria-hidden="true" /> Download receipt</a> : null}</div></div></InvoiceDrawer> : null}
      {drawer?.type === "void-receipt" ? <InvoiceDrawer title="Void receipt" description={`${drawer.invoice.receiptNumber} · this action remains in the audit record`} onClose={() => setDrawer(null)}><VoidReceiptForm receipt={drawer.invoice} busy={busy} onSubmit={(reason) => voidReceipt(drawer.invoice, reason)} /></InvoiceDrawer> : null}
      {drawer?.type === "settings" && settings ? <InvoiceDrawer title="Invoice defaults" description="Configure sender identity, payment methods, terms, tax, and professional PDF footer content." onClose={() => setDrawer(null)}><InvoiceSettingsForm settings={settings} busy={busy} onSubmit={saveSettings} /></InvoiceDrawer> : null}
    </div>
  );
}
