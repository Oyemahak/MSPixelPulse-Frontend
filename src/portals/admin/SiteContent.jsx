import { useCallback, useEffect, useState } from "react";
import { LuArchive, LuPlus, LuRefreshCw } from "react-icons/lu";
import { admin } from "@/lib/api.js";

const kinds = [
  ["service", "Services"],
  ["pricing", "Pricing plans"],
  ["proof", "Proof notes"],
];

function ContentCard({ kind, item, onSaved, onArchived }) {
  const [title, setTitle] = useState(item.title || "");
  const [key, setKey] = useState(item.key || "");
  const [displayOrder, setDisplayOrder] = useState(item.displayOrder ?? 999);
  const [published, setPublished] = useState(Boolean(item.published));
  const [payload, setPayload] = useState(() => JSON.stringify(item.payload || {}, null, 2));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const parsed = JSON.parse(payload);
      await admin.updateContent(kind, item._id, { title, key, displayOrder, published, payload: parsed });
      onSaved("Content saved and available to the public page after refresh.");
    } catch (err) {
      setError(err instanceof SyntaxError ? "Content data must be valid JSON." : err?.message || "Content could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function archive() {
    if (!confirm(`Archive "${title}"? It will stop appearing on the public site but remain in the database.`)) return;
    setBusy(true);
    setError("");
    try {
      await admin.archiveContent(kind, item._id);
      onArchived("Content archived.");
    } catch (err) {
      setError(err?.message || "Content could not be archived.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card-surface p-5 form-stack" onSubmit={save}>
      <div className="form-grid-2">
        <label className="form-field">
          <span className="form-label">Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        <label className="form-field">
          <span className="form-label">Unique key</span>
          <input value={key} onChange={(event) => setKey(event.target.value)} required />
        </label>
        <label className="form-field">
          <span className="form-label">Display order</span>
          <input type="number" value={displayOrder} onChange={(event) => setDisplayOrder(event.target.value)} />
        </label>
        <label className="form-field justify-end">
          <span className="form-label">Visibility</span>
          <span><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Published</span>
        </label>
      </div>
      <label className="form-field">
        <span className="form-label">Structured content data</span>
        <textarea className="form-input font-mono text-xs" rows={12} value={payload} onChange={(event) => setPayload(event.target.value)} spellCheck="false" />
        <span className="field-help">Edit only the fields used by this content type. Arrays and prices remain structured.</span>
      </label>
      {error && <div className="text-error" role="alert">{error}</div>}
      <div className="form-actions">
        <button className="btn btn-primary" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
        <button type="button" className="btn btn-outline" onClick={archive} disabled={busy || item.archivedAt}>
          <LuArchive className="h-4 w-4" aria-hidden="true" /> {item.archivedAt ? "Archived" : "Archive"}
        </button>
      </div>
    </form>
  );
}

export default function SiteContent() {
  const [kind, setKind] = useState("service");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await admin.content(kind);
      setItems(data.items || []);
    } catch (err) {
      setError(err?.message || "Site content could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => { load(); }, [load]);

  async function create() {
    const title = window.prompt(`New ${kind} title`);
    if (!title?.trim()) return;
    setCreating(true);
    setError("");
    try {
      await admin.createContent(kind, { title: title.trim(), key: title.trim(), payload: { title: title.trim() }, published: false, displayOrder: 999 });
      setNotice("Draft content created. Complete its structured fields before publishing.");
      await load();
    } catch (err) {
      setError(err?.message || "Content could not be created.");
    } finally {
      setCreating(false);
    }
  }

  async function refresh(message) {
    setNotice(message);
    await load();
  }

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <div>
          <div className="text-muted-xs">Database-backed CMS</div>
          <h2 className="page-title">Site content</h2>
          <p className="text-muted">Services, pricing plans, and factual proof notes share one persisted source with the public site.</p>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={load} disabled={loading}>
            <LuRefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" /> Refresh
          </button>
          <button type="button" className="btn btn-primary" onClick={create} disabled={creating}>
            <LuPlus className="h-4 w-4" aria-hidden="true" /> New record
          </button>
        </div>
      </div>

      <div className="admin-project-switches" role="tablist" aria-label="Content type">
        {kinds.map(([value, label]) => (
          <button key={value} type="button" className={kind === value ? "btn btn-primary" : "btn btn-outline"} onClick={() => setKind(value)} aria-pressed={kind === value}>{label}</button>
        ))}
      </div>

      {error && <div className="text-error" role="alert">{error}</div>}
      {notice && <div className="text-success" role="status">{notice}</div>}
      <div className="grid gap-5 xl:grid-cols-2">
        {items.map((item) => <ContentCard key={item._id} kind={kind} item={item} onSaved={refresh} onArchived={refresh} />)}
      </div>
      {!loading && !items.length && <div className="empty-note">No records yet. Create a draft or run the idempotent content seed.</div>}
    </div>
  );
}
