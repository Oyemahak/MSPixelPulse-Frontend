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
} from "react-icons/lu";

import InvoiceDrawer from "@/components/billing/InvoiceDrawer.jsx";
import InvoiceEditor from "@/components/billing/InvoiceEditor.jsx";
import {
  InvoiceSettingsForm,
  PaymentForm,
  UploadInvoiceForm,
} from "@/components/billing/InvoiceForms.jsx";
import {
  formatDate,
  formatMoney,
  invoiceStatuses,
  projectIdOf,
  statusLabel,
} from "@/components/billing/invoiceShared.js";
import { invoices as invApi, projects as projectApi } from "@/lib/api.js";
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
  const [settings, setSettings] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [drawer, setDrawer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const [projectData, invoiceData, settingsData, numberData] = await Promise.all([
        projectApi.list(),
        invApi.all(),
        invApi.settings(),
        invApi.nextNumber(),
      ]);
      setProjects(projectData.projects || []);
      setInvoices(invoiceData.invoices || []);
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
      await invApi.update(projectIdOf(invoice), invoice._id, payload);
      await finish("Payment recorded and balance updated.");
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
          <h1 className="page-title">Invoices</h1>
          <p className="text-muted">Create polished PDFs, upload external invoices, and track balances in one place.</p>
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
        <div className="billing-toolbar">
          <label className="billing-search">
            <span className="sr-only">Search invoices</span>
            <LuSearch aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search invoice, project, or client" />
          </label>
          <label className="billing-status-filter"><span className="sr-only">Filter by invoice status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{invoiceStatuses.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select></label>
          <button type="button" className="portal-icon-button" onClick={() => load()} disabled={loading || busy} aria-label="Refresh invoices"><LuRefreshCw className={loading ? "animate-spin" : ""} aria-hidden="true" /></button>
        </div>

        {error ? <div className="billing-message is-error" role="alert">{error}</div> : null}
        {notice ? <div className="billing-message is-success" role="status">{notice}</div> : null}

        <div className="billing-table-scroll">
          <table className="table billing-invoice-table">
            <thead><tr><th>Invoice</th><th>Project / client</th><th>Issued / due</th><th>Total / balance</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {visibleInvoices.map((invoice) => {
                const project = projectForInvoice(invoice, projects);
                const client = invoice.clientDetails || project?.client || {};
                return (
                  <tr key={invoice._id}>
                    <td data-label="Invoice"><strong>{invoice.invoiceNumber || "Unnumbered"}</strong><span>{invoice.sourceType === "generated" ? "Generated PDF" : "Uploaded file"}</span></td>
                    <td data-label="Project / client"><strong>{project?.title || invoice.title || "Project invoice"}</strong><span>{client.contactName || client.name || client.businessName || "Unassigned client"}</span></td>
                    <td data-label="Issued / due"><strong>{formatDate(invoice.issueDate)}</strong><span>Due {formatDate(invoice.dueDate)}</span></td>
                    <td data-label="Total / balance"><strong>{formatMoney(invoice.total, invoice.currency)}</strong><span>{formatMoney(invoice.balanceDue, invoice.currency)} due</span></td>
                    <td data-label="Status"><StatusBadge status={invoice.status} /></td>
                    <td className="billing-row-actions">
                      {invoice.file?.url ? <a className="portal-icon-button" href={invoice.file.url} target="_blank" rel="noreferrer" aria-label={`View ${invoice.invoiceNumber || "invoice"}`}><LuExternalLink aria-hidden="true" /></a> : null}
                      {invoice.file?.url ? <a className="portal-icon-button" href={downloadUrl(invoice.file.url)} aria-label={`Download ${invoice.invoiceNumber || "invoice"}`}><LuDownload aria-hidden="true" /></a> : null}
                      <button type="button" className="portal-icon-button" onClick={() => openDrawer("edit", invoice)} aria-label={`Edit ${invoice.invoiceNumber || "invoice"}`}><LuPencil aria-hidden="true" /></button>
                      <button type="button" className="portal-icon-button" onClick={() => openDrawer("payment", invoice)} aria-label={`Record payment for ${invoice.invoiceNumber || "invoice"}`}><LuCircleDollarSign aria-hidden="true" /></button>
                      <button type="button" className="portal-icon-button" onClick={() => sendInvoice(invoice)} disabled={busy} aria-label={`Send ${invoice.invoiceNumber || "invoice"}`}><LuMail aria-hidden="true" /></button>
                      <button type="button" className="portal-icon-button danger" onClick={() => removeInvoice(invoice)} disabled={busy} aria-label={`Delete ${invoice.invoiceNumber || "invoice"}`}><LuTrash2 aria-hidden="true" /></button>
                    </td>
                  </tr>
                );
              })}
              {!visibleInvoices.length ? <tr><td className="billing-empty" colSpan="6">{loading ? "Loading invoices…" : "No invoices match these filters."}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>

      {drawer?.type === "create" ? <InvoiceDrawer wide title="Create invoice" description="Build, preview, download, and securely add a branded invoice." onClose={() => setDrawer(null)}><InvoiceEditor projects={projects} settings={settings} invoiceNumber={invoiceNumber} busy={busy} onSubmit={saveGenerated} /></InvoiceDrawer> : null}
      {drawer?.type === "edit" ? <InvoiceDrawer wide title={`Edit ${drawer.invoice.invoiceNumber || "invoice"}`} description="Update billing details or replace the generated PDF." onClose={() => setDrawer(null)}><InvoiceEditor projects={projects} settings={settings} invoiceNumber={invoiceNumber} invoice={drawer.invoice} busy={busy} onSubmit={saveGenerated} /></InvoiceDrawer> : null}
      {drawer?.type === "upload" ? <InvoiceDrawer title="Upload existing invoice" description="Attach a PDF or supported image and add its billing details." onClose={() => setDrawer(null)}><UploadInvoiceForm projects={projects} invoiceNumber={invoiceNumber} busy={busy} onSubmit={uploadExisting} /></InvoiceDrawer> : null}
      {drawer?.type === "payment" ? <InvoiceDrawer title="Record payment" description={`${drawer.invoice.invoiceNumber || "Invoice"} · ${formatMoney(drawer.invoice.balanceDue, drawer.invoice.currency)} outstanding`} onClose={() => setDrawer(null)}><PaymentForm invoice={drawer.invoice} busy={busy} onSubmit={recordPayment} /></InvoiceDrawer> : null}
      {drawer?.type === "settings" && settings ? <InvoiceDrawer title="Invoice defaults" description="Set sender identity, paper size, optional tax, and standard payment notes." onClose={() => setDrawer(null)}><InvoiceSettingsForm settings={settings} busy={busy} onSubmit={saveSettings} /></InvoiceDrawer> : null}
    </div>
  );
}
