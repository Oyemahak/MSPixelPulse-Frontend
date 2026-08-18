import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { LuDownload, LuExternalLink, LuRefreshCw } from "react-icons/lu";

import { invoices as invApi, portalErrorMessage, projects as projectApi } from "@/lib/api.js";

function StatusBadge({ invoice }) {
  return <span className={`badge invoice-status is-${invoice?.status || "missing"}`}>{invoice?.status || "Not available"}</span>;
}

function formatMoney(value, currency = "CAD") {
  if (!Number.isFinite(Number(value))) return "";
  return new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(Number(value));
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(date);
}

function downloadUrl(url) {
  if (!url) return "";
  return `${url}${url.includes("?") ? "&" : "?"}download=1`;
}

function InvoiceCard({ title, invoice }) {
  return (
    <article className="client-invoice-card">
      <div className="between gap-3">
        <div>
          <div className="text-muted-xs">{title}</div>
          <h3 className="card-title">{invoice?.invoiceNumber || invoice?.title || invoice?.file?.name || "Not available"}</h3>
        </div>
        <StatusBadge invoice={invoice} />
      </div>

      {invoice ? (
        <>
          <dl className="invoice-summary-grid">
            <div><dt>Issued</dt><dd>{formatDate(invoice.issueDate) || "—"}</dd></div>
            <div><dt>Due</dt><dd>{formatDate(invoice.dueDate) || "—"}</dd></div>
            <div><dt>Total</dt><dd>{Number(invoice.total) > 0 ? formatMoney(invoice.total, invoice.currency) : "—"}</dd></div>
          </dl>
          {invoice.notes ? <p className="text-muted">{invoice.notes}</p> : null}
          <div className="form-actions">
            {invoice.file?.url ? (
              <>
                <a className="btn btn-outline" href={invoice.file.url} target="_blank" rel="noreferrer">
                  <LuExternalLink className="h-4 w-4" aria-hidden="true" /> View
                </a>
                <a className="btn btn-primary" href={downloadUrl(invoice.file.url)}>
                  <LuDownload className="h-4 w-4" aria-hidden="true" /> Download
                </a>
              </>
            ) : <span className="text-muted-xs">A file has not been attached to this invoice.</span>}
          </div>
        </>
      ) : <p className="empty-note">No invoice has been issued for this stage.</p>}
    </article>
  );
}

export default function ClientBillings() {
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [openProjectId, setOpenProjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError(portalErrorMessage(requestError, "billing record"));
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

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <div>
          <div className="text-muted-xs">Your project billing</div>
          <h2 className="page-title">Invoices</h2>
          <p className="text-muted">View or download only the invoices assigned to your projects.</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={load} disabled={loading}>
          <LuRefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" /> Refresh
        </button>
      </div>

      {error ? <div className="text-error" role="alert">{error}</div> : null}

      <div className="card-surface overflow-hidden">
        <table className="table billing-table">
          <thead>
            <tr><th>Project</th><th>Project contact</th><th>Advance</th><th>Final</th><th className="actions-head">Actions</th></tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const projectInvoices = byProject.get(String(project._id)) || [];
              const advance = projectInvoices.find((invoice) => invoice.kind === "advance") || null;
              const finalInvoice = projectInvoices.find((invoice) => invoice.kind === "final") || null;
              const open = openProjectId === String(project._id);

              return (
                <Fragment key={project._id}>
                  <tr className="table-row-hover">
                    <td><div className="font-medium">{project.title}</div><div className="row-sub">{project.summary || "Project billing"}</div></td>
                    <td>{project.developer?.name || "MSPixelPulse team"}</td>
                    <td><StatusBadge invoice={advance} /></td>
                    <td><StatusBadge invoice={finalInvoice} /></td>
                    <td className="actions-cell">
                      <button type="button" className="btn btn-outline" aria-expanded={open} onClick={() => setOpenProjectId(open ? "" : String(project._id))}>
                        {open ? "Close" : "View invoices"}
                      </button>
                    </td>
                  </tr>
                  {open ? (
                    <tr className="row-edit"><td colSpan="5"><div className="invoice-editor-columns"><InvoiceCard title="Advance payment" invoice={advance} /><InvoiceCard title="Final invoice" invoice={finalInvoice} /></div></td></tr>
                  ) : null}
                </Fragment>
              );
            })}
            {!projects.length ? <tr><td colSpan="5" className="empty-cell">{loading ? "Loading invoices…" : "No project invoices are available."}</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
