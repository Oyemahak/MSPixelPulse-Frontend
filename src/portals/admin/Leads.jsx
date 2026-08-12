import { useEffect, useMemo, useState } from "react";
import { LuArchive, LuRefreshCw } from "react-icons/lu";
import SearchField from "@/components/ui/SearchField.jsx";
import { admin } from "@/lib/api.js";

const statuses = ["new", "contacted", "qualified", "completed", "spam", "archived"];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await admin.leads({ q: query, status });
      setLeads(data.leads || []);
    } catch (err) {
      setError(err?.message || "Leads could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(load, 280);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status]);

  const activeCount = useMemo(
    () => leads.filter((lead) => !["completed", "spam", "archived"].includes(lead.status)).length,
    [leads]
  );

  async function changeStatus(lead, nextStatus) {
    setBusyId(lead._id);
    setError("");
    setNotice("");
    try {
      await admin.updateLead(lead._id, nextStatus);
      setNotice(`Lead marked ${nextStatus}.`);
      await load();
    } catch (err) {
      setError(err?.message || "Lead status could not be saved.");
    } finally {
      setBusyId("");
    }
  }

  async function archive(lead) {
    if (!confirm(`Archive the inquiry from ${lead.name || lead.email}? It remains in the database for business history.`)) return;
    setBusyId(lead._id);
    setError("");
    setNotice("");
    try {
      await admin.archiveLead(lead._id);
      setNotice("Lead archived.");
      await load();
    } catch (err) {
      setError(err?.message || "Lead could not be archived.");
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
          <p className="text-muted">{activeCount} active of {leads.length} loaded inquiries.</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={load} disabled={loading}>
          <LuRefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
          Refresh
        </button>
      </div>

      <div className="card-surface p-4 form-grid-2">
        <SearchField label="Search inquiries" placeholder="Name, email, business, service, or message" value={query} onValueChange={setQuery} />
        <label className="form-field">
          <span className="form-label">Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {error && <div className="text-error" role="alert">{error}</div>}
      {notice && <div className="text-success" role="status">{notice}</div>}

      <div className="grid gap-4 xl:grid-cols-2">
        {leads.map((lead) => (
          <article key={lead._id} className="card-surface p-5">
            <div className="between gap-4">
              <div>
                <h3 className="card-title">{lead.name}</h3>
                <a className="subtle-link" href={`mailto:${lead.email}`}>{lead.email}</a>
              </div>
              <select
                aria-label={`Status for ${lead.name}`}
                value={lead.status}
                disabled={busyId === lead._id}
                onChange={(event) => changeStatus(lead, event.target.value)}
              >
                {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="mt-3 text-muted-xs">{lead.businessName || "No business name"} · {lead.service || lead.inquiryType}</div>
            <p className="mt-3 whitespace-pre-wrap text-muted">{lead.message}</p>
            <div className="mt-4 between gap-4">
              <span className="text-muted-xs">Received {new Date(lead.createdAt).toLocaleString()}</span>
              {lead.status !== "archived" && (
                <button type="button" className="btn btn-outline btn-sm" onClick={() => archive(lead)} disabled={busyId === lead._id}>
                  <LuArchive className="h-4 w-4" aria-hidden="true" /> Archive
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {!loading && !leads.length && <div className="empty-note">No inquiries match this search.</div>}
    </div>
  );
}
