import { useCallback, useEffect, useMemo, useState } from "react";
import { LuArchive, LuEye, LuMail, LuRefreshCw, LuX } from "react-icons/lu";

import SearchField from "@/components/ui/SearchField.jsx";
import { admin } from "@/lib/api.js";
import { formatLocalDateTime } from "@/lib/messageTime.js";

const statuses = ["new", "contacted", "qualified", "completed", "spam", "archived"];
const closedStatuses = new Set(["completed", "spam", "archived"]);

function leadTimestamp(lead) {
  const date = new Date(lead?.createdAt || lead?.submittedAt || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function inquiryLabel(lead) {
  return lead?.service || lead?.inquiryType || "General inquiry";
}

function LeadDetails({ lead, onClose }) {
  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  if (!lead) return null;

  return (
    <div className="portal-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="portal-detail-drawer" role="dialog" aria-modal="true" aria-labelledby="lead-detail-title" tabIndex="-1" autoFocus>
        <header className="portal-detail-head">
          <div>
            <div className="text-muted-xs">Lead details</div>
            <h2 id="lead-detail-title" className="card-title">{lead.name || "Unnamed inquiry"}</h2>
          </div>
          <button type="button" className="portal-icon-button" onClick={onClose} aria-label="Close lead details" autoFocus><LuX aria-hidden="true" /></button>
        </header>
        <dl className="lead-detail-list">
          <div><dt>Email</dt><dd><a className="subtle-link" href={`mailto:${lead.email}`}>{lead.email || "Not provided"}</a></dd></div>
          <div><dt>Business</dt><dd>{lead.businessName || "Not provided"}</dd></div>
          <div><dt>Inquiry</dt><dd>{inquiryLabel(lead)}</dd></div>
          <div><dt>Status</dt><dd><span className={`badge lead-status is-${lead.status || "new"}`}>{lead.status || "new"}</span></dd></div>
          <div><dt>Received</dt><dd>{formatLocalDateTime(lead.createdAt || lead.submittedAt, "Timestamp pending")}</dd></div>
        </dl>
        <div className="lead-message-panel">
          <div className="form-label">Message</div>
          <p>{lead.message || "No message was provided."}</p>
        </div>
        {lead.email ? <a className="btn btn-primary" href={`mailto:${lead.email}`}><LuMail aria-hidden="true" /> Email lead</a> : null}
      </section>
    </div>
  );
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await admin.leads();
      setLeads(data.leads || []);
    } catch (requestError) {
      setError(requestError?.message || "Leads could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const inquiryOptions = useMemo(
    () => Array.from(new Set(leads.map(inquiryLabel).filter(Boolean))).sort(),
    [leads],
  );

  const visibleLeads = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return leads
      .filter((lead) => (
        (!status || lead.status === status) &&
        (!inquiry || inquiryLabel(lead) === inquiry) &&
        (!needle || `${lead.name || ""} ${lead.email || ""} ${lead.businessName || ""} ${inquiryLabel(lead)} ${lead.message || ""}`.toLowerCase().includes(needle))
      ))
      .slice()
      .sort((left, right) => leadTimestamp(right) - leadTimestamp(left));
  }, [inquiry, leads, query, status]);

  const activeCount = useMemo(
    () => leads.filter((lead) => !closedStatuses.has(lead.status)).length,
    [leads],
  );

  async function changeStatus(lead, nextStatus) {
    setBusyId(lead._id);
    setError("");
    setNotice("");
    try {
      await admin.updateLead(lead._id, nextStatus);
      setLeads((current) => current.map((item) => item._id === lead._id ? { ...item, status: nextStatus } : item));
      setSelected((current) => current?._id === lead._id ? { ...current, status: nextStatus } : current);
      setNotice(`Lead marked ${nextStatus}.`);
    } catch (requestError) {
      setError(requestError?.message || "Lead status could not be saved.");
    } finally {
      setBusyId("");
    }
  }

  async function archive(lead) {
    if (!window.confirm(`Archive the inquiry from ${lead.name || lead.email}? It remains in the database for business history.`)) return;
    setBusyId(lead._id);
    setError("");
    setNotice("");
    try {
      await admin.archiveLead(lead._id);
      setLeads((current) => current.map((item) => item._id === lead._id ? { ...item, status: "archived" } : item));
      setNotice("Lead archived.");
    } catch (requestError) {
      setError(requestError?.message || "Lead could not be archived.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <div>
          <div className="text-muted-xs">Persisted public inquiries</div>
          <h2 className="page-title">Leads</h2>
          <p className="text-muted">{activeCount} active of {leads.length} inquiries · newest first</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={load} disabled={loading}>
          <LuRefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" /> Refresh
        </button>
      </div>

      <div className="card-surface lead-filter-row">
        <SearchField label="Search inquiries" placeholder="Search name, email, business, service, or message" value={query} onValueChange={setQuery} />
        <label className="form-field"><span className="sr-only">Filter by inquiry type</span>
          <select value={inquiry} onChange={(event) => setInquiry(event.target.value)} aria-label="Filter by inquiry type">
            <option value="">All inquiry types</option>
            {inquiryOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="form-field"><span className="sr-only">Filter by status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
            <option value="">All statuses</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {error ? <div className="text-error" role="alert">{error}</div> : null}
      {notice ? <div className="text-success" role="status">{notice}</div> : null}

      <div className="card-surface overflow-hidden">
        <table className="table leads-table">
          <thead><tr><th>Name / business</th><th>Email</th><th>Inquiry</th><th>Status</th><th>Received</th><th className="actions-head">Actions</th></tr></thead>
          <tbody>
            {visibleLeads.map((lead) => (
              <tr key={lead._id} className="table-row-hover">
                <td><strong>{lead.name || "Unnamed inquiry"}</strong><div className="row-sub">{lead.businessName || "No business name"}</div></td>
                <td><a className="subtle-link" href={`mailto:${lead.email}`}>{lead.email || "—"}</a></td>
                <td>{inquiryLabel(lead)}</td>
                <td>
                  <select aria-label={`Status for ${lead.name || lead.email}`} value={lead.status || "new"} disabled={busyId === lead._id} onChange={(event) => void changeStatus(lead, event.target.value)}>
                    {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </td>
                <td><span className="lead-received">{formatLocalDateTime(lead.createdAt || lead.submittedAt, "Timestamp pending")}</span></td>
                <td className="actions-cell">
                  <button type="button" className="icon-btn" onClick={() => setSelected(lead)} title="View details" aria-label={`View details for ${lead.name || lead.email}`}><LuEye aria-hidden="true" /></button>
                  {lead.email ? <a className="icon-btn" href={`mailto:${lead.email}`} title="Email lead" aria-label={`Email ${lead.name || lead.email}`}><LuMail aria-hidden="true" /></a> : null}
                  {lead.status !== "archived" ? <button type="button" className="icon-btn" onClick={() => void archive(lead)} disabled={busyId === lead._id} title="Archive lead" aria-label={`Archive ${lead.name || lead.email}`}><LuArchive aria-hidden="true" /></button> : null}
                </td>
              </tr>
            ))}
            {!visibleLeads.length ? <tr><td colSpan="6" className="empty-cell">{loading ? "Loading inquiries…" : "No inquiries match these filters."}</td></tr> : null}
          </tbody>
        </table>
      </div>
      <LeadDetails lead={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
