import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  LuDownload,
  LuExternalLink,
  LuFilePenLine,
  LuRefreshCw,
  LuTrash2,
  LuUpload,
} from "react-icons/lu";

import SearchField from "@/components/ui/SearchField.jsx";
import { invoices as invApi, projects as projectApi } from "@/lib/api.js";

const invoiceStatuses = ["draft", "sent", "uploaded", "paid", "archived"];

function StatusBadge({ invoice }) {
  return <span className={`badge invoice-status is-${invoice?.status || "missing"}`}>{invoice?.status || "Not added"}</span>;
}

function dateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function invoiceForm(invoice, kind) {
  return {
    kind,
    invoiceNumber: invoice?.invoiceNumber || "",
    title: invoice?.title || "",
    status: invoice?.status || "uploaded",
    issueDate: dateInput(invoice?.issueDate),
    dueDate: dateInput(invoice?.dueDate),
    total: Number(invoice?.total || 0) || "",
    currency: invoice?.currency || "CAD",
    notes: invoice?.notes || "",
    isDemo: Boolean(invoice?.isDemo),
  };
}

function payloadFromForm(form) {
  return {
    invoiceNumber: form.invoiceNumber.trim(),
    title: form.title.trim(),
    status: form.status,
    issueDate: form.issueDate || null,
    dueDate: form.dueDate || null,
    total: form.total === "" ? 0 : Number(form.total),
    currency: form.currency.trim().toUpperCase() || "CAD",
    notes: form.notes.trim(),
    isDemo: Boolean(form.isDemo),
  };
}

function downloadUrl(url) {
  if (!url) return "";
  return `${url}${url.includes("?") ? "&" : "?"}download=1`;
}

function InvoiceEditor({
  project,
  kind,
  invoice,
  busy,
  onChanged,
  onError,
  onNotice,
}) {
  const [form, setForm] = useState(() => invoiceForm(invoice, kind));
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    setForm(invoiceForm(invoice, kind));
    setFile(null);
    setProgress(0);
  }, [invoice, kind]);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveMetadata(event) {
    event.preventDefault();
    onError("");
    onNotice("");
    setWorking(true);

    try {
      const payload = payloadFromForm(form);

      if (invoice?._id) {
        await invApi.update(project._id, invoice._id, payload);
      } else {
        await invApi.create(project._id, { ...payload, kind });
      }

      onNotice(`${kind === "advance" ? "Advance" : "Final"} invoice details saved.`);
      await onChanged();
    } catch (error) {
      onError(error?.message || "Invoice details could not be saved.");
    } finally {
      setWorking(false);
    }
  }

  async function uploadFile() {
    if (!file) {
      onError("Choose a PDF or supported invoice image first.");
      return;
    }

    onError("");
    onNotice("");
    setProgress(1);
    setWorking(true);

    try {
      await invApi.upload(file, {
        projectId: project._id,
        kind,
        invoiceId: invoice?._id || "",
        invoice: payloadFromForm(form),
        onProgress: setProgress,
      });

      onNotice(`${file.name} was securely uploaded through the MSPixelPulse API.`);
      setFile(null);
      await onChanged();
    } catch (error) {
      onError(error?.message || "Invoice upload failed.");
    } finally {
      setProgress(0);
      setWorking(false);
    }
  }

  async function removeInvoice() {
    if (!invoice?._id) return;

    const name = invoice.file?.name || invoice.invoiceNumber || `${kind} invoice`;
    const confirmed = window.confirm(
      `Permanently delete "${name}" and its stored Google Drive file? This cannot be undone.`,
    );

    if (!confirmed) return;

    onError("");
    onNotice("");
    setWorking(true);

    try {
      await invApi.remove(project._id, invoice._id);
      onNotice(`${name} was permanently deleted.`);
      await onChanged();
    } catch (error) {
      onError(error?.message || "Invoice could not be deleted.");
    } finally {
      setWorking(false);
    }
  }

  const inputId = `invoice-file-${project._id}-${kind}`;
  const actionBusy = busy || working;

  return (
    <form className="invoice-editor-card" onSubmit={saveMetadata}>
      <div className="between gap-3">
        <div>
          <div className="text-muted-xs">{kind === "advance" ? "Advance payment" : "Final invoice"}</div>
          <h3 className="card-title">{invoice?.invoiceNumber || invoice?.file?.name || "New invoice"}</h3>
        </div>
        <StatusBadge invoice={invoice} />
      </div>

      <div className="invoice-editor-grid">
        <label className="form-field">
          <span className="form-label">Invoice number</span>
          <input value={form.invoiceNumber} onChange={(event) => setField("invoiceNumber", event.target.value)} placeholder="INV-2026-001" />
        </label>
        <label className="form-field">
          <span className="form-label">Title</span>
          <input value={form.title} onChange={(event) => setField("title", event.target.value)} placeholder="Website project invoice" />
        </label>
        <label className="form-field">
          <span className="form-label">Status</span>
          <select value={form.status} onChange={(event) => setField("status", event.target.value)}>
            {invoiceStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span className="form-label">Issue date</span>
          <input type="date" value={form.issueDate} onChange={(event) => setField("issueDate", event.target.value)} />
        </label>
        <label className="form-field">
          <span className="form-label">Due date</span>
          <input type="date" value={form.dueDate} onChange={(event) => setField("dueDate", event.target.value)} />
        </label>
        <label className="form-field">
          <span className="form-label">Total</span>
          <input type="number" min="0" step="0.01" inputMode="decimal" value={form.total} onChange={(event) => setField("total", event.target.value)} />
        </label>
        <label className="form-field">
          <span className="form-label">Currency</span>
          <input maxLength="3" value={form.currency} onChange={(event) => setField("currency", event.target.value)} />
        </label>
        <label className="form-field invoice-notes-field">
          <span className="form-label">Notes</span>
          <textarea rows="3" value={form.notes} onChange={(event) => setField("notes", event.target.value)} placeholder="Optional client-facing notes" />
        </label>
        <label className="portal-toggle-row invoice-demo-toggle">
          <input type="checkbox" checked={form.isDemo} onChange={(event) => setField("isDemo", event.target.checked)} />
          <span>Mark as sample/demo</span>
        </label>
      </div>

      <div className="invoice-file-zone">
        <div>
          <div className="form-label">{invoice?.file ? "Replace invoice file" : "Upload invoice file"}</div>
          <div className="text-muted-xs">PDF, JPG, PNG, or WebP · maximum 15 MB · relayed securely through the backend</div>
        </div>
        <input
          id={inputId}
          type="file"
          className="sr-only"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          disabled={actionBusy}
        />
        <label className="btn btn-outline cursor-pointer" htmlFor={inputId}>
          <LuFilePenLine className="h-4 w-4" aria-hidden="true" />
          {file?.name || "Choose file"}
        </label>
        <button type="button" className="btn btn-primary" onClick={uploadFile} disabled={actionBusy || !file}>
          <LuUpload className="h-4 w-4" aria-hidden="true" />
          {progress ? `Uploading ${progress}%` : invoice?.file ? "Replace file" : "Upload file"}
        </button>
      </div>

      {progress ? <progress className="invoice-upload-progress" max="100" value={progress}>{progress}%</progress> : null}

      <div className="form-actions">
        <button className="btn btn-primary" disabled={actionBusy}>Save details</button>
        {invoice?.file?.url ? (
          <>
            <a className="btn btn-outline" href={invoice.file.url} target="_blank" rel="noreferrer">
              <LuExternalLink className="h-4 w-4" aria-hidden="true" /> View
            </a>
            <a className="btn btn-outline" href={downloadUrl(invoice.file.url)}>
              <LuDownload className="h-4 w-4" aria-hidden="true" /> Download
            </a>
          </>
        ) : null}
        {invoice?._id ? (
          <button type="button" className="btn btn-outline danger" onClick={removeInvoice} disabled={actionBusy}>
            <LuTrash2 className="h-4 w-4" aria-hidden="true" /> Delete permanently
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default function Billings() {
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [openProjectId, setOpenProjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refreshInvoices = useCallback(async () => {
    const data = await invApi.all();
    setInvoices(data.invoices || []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [projectData, invoiceData] = await Promise.all([
        projectApi.list(),
        invApi.all(),
      ]);
      setProjects(projectData.projects || []);
      setInvoices(invoiceData.invoices || []);
    } catch (requestError) {
      setError(requestError?.message || "Billing records could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const byProject = useMemo(() => {
    const grouped = new Map();
    invoices.forEach((invoice) => {
      const projectId = String(invoice.project?._id || invoice.project || "");
      if (!grouped.has(projectId)) grouped.set(projectId, []);
      grouped.get(projectId).push(invoice);
    });
    return grouped;
  }, [invoices]);

  const visibleProjects = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return projects.filter((project) => {
      const projectInvoices = byProject.get(String(project._id)) || [];
      const matchesSearch = !needle || `${project.title || ""} ${project.client?.name || ""} ${project.client?.email || ""}`.toLowerCase().includes(needle);
      const matchesStatus = !status || projectInvoices.some((invoice) => invoice.status === status);
      return matchesSearch && matchesStatus;
    });
  }, [byProject, projects, query, status]);

  async function handleChanged() {
    setBusy(true);
    try {
      await refreshInvoices();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <div>
          <div className="text-muted-xs">Secure Google Drive billing</div>
          <h2 className="page-title">Billing and invoices</h2>
          <p className="text-muted">Upload, replace, edit, view, download, and permanently delete project invoices.</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={load} disabled={loading || busy}>
          <LuRefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
          Refresh
        </button>
      </div>

      <div className="card-surface p-4 billing-filter-row">
        <SearchField label="Search billing projects" placeholder="Search project or client" value={query} onValueChange={setQuery} />
        <label className="form-field">
          <span className="form-label">Invoice status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            {invoiceStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {error ? <div className="text-error" role="alert">{error}</div> : null}
      {notice ? <div className="text-success" role="status">{notice}</div> : null}

      <div className="card-surface overflow-hidden">
        <table className="table billing-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Advance</th>
              <th>Final</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map((project) => {
              const projectInvoices = byProject.get(String(project._id)) || [];
              const advance = projectInvoices.find((invoice) => invoice.kind === "advance") || null;
              const finalInvoice = projectInvoices.find((invoice) => invoice.kind === "final") || null;
              const open = openProjectId === String(project._id);

              return (
                <Fragment key={project._id}>
                  <tr className="table-row-hover">
                    <td><div className="font-medium">{project.title}</div><div className="row-sub">{project.summary || "No project summary"}</div></td>
                    <td>{project.client?.name || project.clientName || "Unassigned"}</td>
                    <td><StatusBadge invoice={advance} /></td>
                    <td><StatusBadge invoice={finalInvoice} /></td>
                    <td className="actions-cell">
                      <button type="button" className="btn btn-outline" aria-expanded={open} onClick={() => setOpenProjectId(open ? "" : String(project._id))}>
                        {open ? "Close" : "Manage invoices"}
                      </button>
                    </td>
                  </tr>
                  {open ? (
                    <tr className="row-edit">
                      <td colSpan="5">
                        <div className="invoice-editor-columns">
                          <InvoiceEditor project={project} kind="advance" invoice={advance} busy={busy} onChanged={handleChanged} onError={setError} onNotice={setNotice} />
                          <InvoiceEditor project={project} kind="final" invoice={finalInvoice} busy={busy} onChanged={handleChanged} onError={setError} onNotice={setNotice} />
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
            {!visibleProjects.length ? (
              <tr><td colSpan="5" className="empty-cell">{loading ? "Loading billing records…" : "No billing projects match these filters."}</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
