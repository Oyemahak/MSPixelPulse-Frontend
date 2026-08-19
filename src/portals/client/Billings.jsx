import { useCallback, useEffect, useMemo, useState } from "react";
import { LuDownload, LuExternalLink, LuRefreshCw } from "react-icons/lu";

import {
  formatDate,
  formatMoney,
  projectIdOf,
  statusLabel,
} from "@/components/billing/invoiceShared.js";
import { invoices as invApi, portalErrorMessage, projects as projectApi } from "@/lib/api.js";
import { paymentStageLabel } from "@/lib/invoiceCalculations.js";
import "../css/billing.css";

function downloadUrl(url) {
  if (!url) return "";
  return `${url}${url.includes("?") ? "&" : "?"}download=1`;
}

export default function ClientBillings() {
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [projectData, invoiceData] = await Promise.all([projectApi.list(), invApi.all()]);
      setProjects(projectData.projects || []);
      setInvoices(invoiceData.invoices || []);
    } catch (requestError) {
      setError(portalErrorMessage(requestError, "billing record"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const projectNames = useMemo(() => new Map(projects.map((project) => [String(project._id), project.title])), [projects]);

  return (
    <div className="page-shell space-stack billing-page">
      <header className="page-header billing-page-header">
        <div>
          <div className="text-muted-xs">Your project billing</div>
          <h1 className="page-title">Invoices</h1>
          <p className="text-muted">Review balances and securely view or download invoices assigned to your projects.</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={load} disabled={loading}><LuRefreshCw className={loading ? "animate-spin" : ""} aria-hidden="true" /> Refresh</button>
      </header>

      {error ? <div className="billing-message is-error" role="alert">{error}</div> : null}

      <section className="card-surface billing-list-card">
        <div className="billing-table-scroll" role="region" aria-label="Client invoices" tabIndex="0">
          <table className="table billing-invoice-table is-client">
            <thead><tr><th>Invoice / project</th><th>Issued / due</th><th>Total</th><th>Paid / balance</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td data-label="Invoice / project"><strong>{invoice.invoiceNumber || invoice.title || "Invoice"}</strong><span>{paymentStageLabel(invoice.paymentStage, invoice.kind)} · {projectNames.get(projectIdOf(invoice)) || invoice.title || "MSPixelPulse project"}</span></td>
                  <td data-label="Issued / due"><strong>{formatDate(invoice.issueDate)}</strong><span>Due {formatDate(invoice.dueDate)}</span></td>
                  <td data-label="Total"><strong>{formatMoney(invoice.total, invoice.currency)}</strong></td>
                  <td data-label="Paid / balance"><strong>{formatMoney(invoice.amountPaid, invoice.currency)} paid</strong><span>{formatMoney(invoice.balanceDue, invoice.currency)} due</span></td>
                  <td data-label="Status"><span className={`invoice-status-badge is-${invoice.status || "draft"}`}>{statusLabel(invoice.status)}</span></td>
                  <td className="billing-row-actions">
                    {invoice.file?.url ? <a className="btn btn-outline" href={invoice.file.url} target="_blank" rel="noreferrer"><LuExternalLink aria-hidden="true" /> View</a> : null}
                    {invoice.file?.url ? <a className="btn btn-primary" href={downloadUrl(invoice.file.url)}><LuDownload aria-hidden="true" /> Download</a> : <span className="text-muted-xs">File pending</span>}
                  </td>
                </tr>
              ))}
              {!invoices.length ? <tr><td className="billing-empty" colSpan="6">{loading ? "Loading invoices…" : "No invoices are available yet."}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
