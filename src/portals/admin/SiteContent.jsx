import { useCallback, useEffect, useMemo, useState } from "react";
import { LuArchive, LuPencil, LuPlus, LuRefreshCw, LuX } from "react-icons/lu";

import SearchField from "@/components/ui/SearchField.jsx";
import { admin } from "@/lib/api.js";

const kinds = [
  ["service", "Services"],
  ["pricing", "Pricing plans"],
  ["proof", "Proof notes"],
];

function listText(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function parseList(value) {
  return String(value || "").split("\n").map((item) => item.trim()).filter(Boolean);
}

function blankItem(kind) {
  return {
    title: "",
    key: "",
    displayOrder: 999,
    published: false,
    payload: kind === "pricing" ? { currency: "CAD", accent: "blue", features: [] } : kind === "service" ? { benefits: [] } : {},
  };
}

function StructuredFields({ kind, payload, setPayloadField }) {
  if (kind === "service") {
    return (
      <>
        <label className="form-field content-field-wide"><span className="form-label">Description</span><textarea rows="3" value={payload.description || ""} onChange={(event) => setPayloadField("description", event.target.value)} /></label>
        <label className="form-field content-field-wide"><span className="form-label">Best for</span><input value={payload.best || ""} onChange={(event) => setPayloadField("best", event.target.value)} /></label>
        <label className="form-field content-field-wide"><span className="form-label">Benefits · one per line</span><textarea rows="5" value={listText(payload.benefits)} onChange={(event) => setPayloadField("benefits", parseList(event.target.value))} /></label>
        <label className="form-field"><span className="form-label">CTA label</span><input value={payload.cta || ""} onChange={(event) => setPayloadField("cta", event.target.value)} /></label>
        <label className="form-field"><span className="form-label">Related path</span><input value={payload.related || ""} onChange={(event) => setPayloadField("related", event.target.value)} placeholder="/projects" /></label>
        <label className="form-field content-field-wide"><span className="form-label">Image URL</span><input type="url" value={payload.photo || ""} onChange={(event) => setPayloadField("photo", event.target.value)} /></label>
        <label className="form-field content-field-wide"><span className="form-label">Image alt text</span><input value={payload.photoAlt || ""} onChange={(event) => setPayloadField("photoAlt", event.target.value)} /></label>
        <label className="form-field"><span className="form-label">Icon key</span><input value={payload.iconKey || ""} onChange={(event) => setPayloadField("iconKey", event.target.value)} /></label>
        <label className="form-field"><span className="form-label">Visual style key</span><input value={payload.visual || ""} onChange={(event) => setPayloadField("visual", event.target.value)} /></label>
      </>
    );
  }

  if (kind === "pricing") {
    return (
      <>
        <label className="form-field"><span className="form-label">Plan name</span><input value={payload.name || ""} onChange={(event) => setPayloadField("name", event.target.value)} /></label>
        <label className="form-field"><span className="form-label">Short name</span><input value={payload.shortName || ""} onChange={(event) => setPayloadField("shortName", event.target.value)} /></label>
        <label className="form-field"><span className="form-label">Category</span><input value={payload.category || ""} onChange={(event) => setPayloadField("category", event.target.value)} /></label>
        <label className="form-field"><span className="form-label">Price</span><input type="number" min="0" step="0.01" value={payload.price ?? ""} onChange={(event) => setPayloadField("price", event.target.value === "" ? "" : Number(event.target.value))} /></label>
        <label className="form-field"><span className="form-label">Price suffix</span><input value={payload.priceSuffix || ""} onChange={(event) => setPayloadField("priceSuffix", event.target.value)} placeholder="CAD" /></label>
        <label className="form-field"><span className="form-label">Badge</span><input value={payload.badge || ""} onChange={(event) => setPayloadField("badge", event.target.value)} /></label>
        <label className="form-field"><span className="form-label">Accent</span><select value={payload.accent || "blue"} onChange={(event) => setPayloadField("accent", event.target.value)}><option>blue</option><option>purple</option><option>amber</option><option>rose</option></select></label>
        <label className="portal-toggle-row content-feature-toggle"><input type="checkbox" checked={Boolean(payload.featured)} onChange={(event) => setPayloadField("featured", event.target.checked)} /><span>Featured plan</span></label>
        <label className="form-field content-field-wide"><span className="form-label">Best for</span><textarea rows="2" value={payload.bestFor || ""} onChange={(event) => setPayloadField("bestFor", event.target.value)} /></label>
        <label className="form-field content-field-wide"><span className="form-label">Summary</span><textarea rows="3" value={payload.summary || ""} onChange={(event) => setPayloadField("summary", event.target.value)} /></label>
        <label className="form-field content-field-wide"><span className="form-label">Features · one per line</span><textarea rows="6" value={listText(payload.features)} onChange={(event) => setPayloadField("features", parseList(event.target.value))} /></label>
        <label className="form-field content-field-wide"><span className="form-label">Pricing note</span><textarea rows="2" value={payload.pricingNote || ""} onChange={(event) => setPayloadField("pricingNote", event.target.value)} /></label>
        <label className="form-field content-field-wide"><span className="form-label">Scope boundary</span><textarea rows="3" value={payload.boundary || ""} onChange={(event) => setPayloadField("boundary", event.target.value)} /></label>
        <label className="form-field content-field-wide"><span className="form-label">CTA label</span><input value={payload.cta || ""} onChange={(event) => setPayloadField("cta", event.target.value)} /></label>
      </>
    );
  }

  return (
    <>
      <label className="form-field"><span className="form-label">Proof label</span><input value={payload.name || ""} onChange={(event) => setPayloadField("name", event.target.value)} /></label>
      <label className="form-field"><span className="form-label">Business / category</span><input value={payload.business || ""} onChange={(event) => setPayloadField("business", event.target.value)} /></label>
      <label className="form-field content-field-wide"><span className="form-label">Factual proof note</span><textarea rows="6" value={payload.message || ""} onChange={(event) => setPayloadField("message", event.target.value)} /></label>
    </>
  );
}

function ContentEditor({ kind, item, onClose, onSaved }) {
  const [draft, setDraft] = useState(() => item ? { ...item, payload: { ...(item.payload || {}) } } : blankItem(kind));
  const [advancedJson, setAdvancedJson] = useState(() => JSON.stringify(item?.payload || blankItem(kind).payload, null, 2));
  const [advancedDirty, setAdvancedDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape" && !busy) onClose();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [busy, onClose]);

  function setField(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function setPayloadField(key, value) {
    setDraft((current) => ({
      ...current,
      payload: { ...(current.payload || {}), [key]: value },
    }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = advancedDirty ? JSON.parse(advancedJson) : draft.payload;
      const record = {
        title: draft.title.trim(),
        key: draft.key.trim(),
        displayOrder: Number(draft.displayOrder) || 0,
        published: Boolean(draft.published),
        payload,
      };
      if (item?._id) await admin.updateContent(kind, item._id, record);
      else await admin.createContent(kind, record);
      await onSaved(item?._id ? "Content saved." : "Draft content created.");
    } catch (requestError) {
      setError(requestError instanceof SyntaxError ? "Advanced JSON must be valid before saving." : requestError?.message || "Content could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function archive() {
    if (!item?._id || !window.confirm(`Archive "${draft.title}"? It will leave the public site but remain in business history.`)) return;
    setBusy(true);
    setError("");
    try {
      await admin.archiveContent(kind, item._id);
      await onSaved("Content archived.");
    } catch (requestError) {
      setError(requestError?.message || "Content could not be archived.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="portal-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
      <form className="portal-content-drawer" role="dialog" aria-modal="true" aria-labelledby="content-editor-title" onSubmit={save} tabIndex="-1" autoFocus>
        <header className="portal-detail-head">
          <div><div className="text-muted-xs">{item?._id ? "Edit persisted record" : "Create draft record"}</div><h2 id="content-editor-title" className="card-title">{item?._id ? draft.title : `New ${kind}`}</h2></div>
          <button type="button" className="portal-icon-button" onClick={onClose} disabled={busy} aria-label="Close content editor"><LuX aria-hidden="true" /></button>
        </header>

        <div className="content-editor-grid">
          <label className="form-field"><span className="form-label">Title</span><input value={draft.title} onChange={(event) => setField("title", event.target.value)} required /></label>
          <label className="form-field"><span className="form-label">Unique key</span><input value={draft.key} onChange={(event) => setField("key", event.target.value)} required /></label>
          <label className="form-field"><span className="form-label">Display order</span><input type="number" value={draft.displayOrder} onChange={(event) => setField("displayOrder", event.target.value)} /></label>
          <label className="portal-toggle-row content-feature-toggle"><input type="checkbox" checked={draft.published} onChange={(event) => setField("published", event.target.checked)} /><span>Published</span></label>
          <StructuredFields kind={kind} payload={draft.payload || {}} setPayloadField={setPayloadField} />
        </div>

        <details className="content-advanced" onToggle={(event) => {
          if (event.currentTarget.open && !advancedDirty) setAdvancedJson(JSON.stringify(draft.payload || {}, null, 2));
        }}>
          <summary>Advanced JSON</summary>
          <p className="field-help">Use only for fields not available above. Valid JSON replaces the structured payload when saved.</p>
          <textarea className="form-input font-mono text-xs" rows="12" value={advancedJson} spellCheck="false" onChange={(event) => { setAdvancedJson(event.target.value); setAdvancedDirty(true); }} />
        </details>

        {error ? <div className="text-error" role="alert">{error}</div> : null}
        <div className="form-actions content-drawer-actions">
          <button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save content"}</button>
          {item?._id ? <button type="button" className="btn btn-outline danger" onClick={() => void archive()} disabled={busy || item.archivedAt}><LuArchive aria-hidden="true" /> {item.archivedAt ? "Archived" : "Archive"}</button> : null}
        </div>
      </form>
    </div>
  );
}

export default function SiteContent() {
  const [kind, setKind] = useState("service");
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("");
  const [editing, setEditing] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await admin.content(kind);
      setItems(data.items || []);
    } catch (requestError) {
      setError(requestError?.message || "Site content could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => { void load(); }, [load]);

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items
      .filter((item) => {
        const published = item.published && !item.archivedAt;
        return (!visibility || (visibility === "published" ? published : visibility === "draft" ? !item.published && !item.archivedAt : Boolean(item.archivedAt))) &&
          (!needle || `${item.title || ""} ${item.key || ""} ${JSON.stringify(item.payload || {})}`.toLowerCase().includes(needle));
      })
      .slice()
      .sort((left, right) => Number(left.displayOrder ?? 999) - Number(right.displayOrder ?? 999));
  }, [items, query, visibility]);

  async function saved(message) {
    setNotice(message);
    setEditing(undefined);
    await load();
  }

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <div>
          <div className="text-muted-xs">Database-backed CMS</div>
          <h2 className="page-title">Site content</h2>
          <p className="text-muted">{items.filter((item) => item.published && !item.archivedAt).length} published of {items.length} {kind} records.</p>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={load} disabled={loading}><LuRefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" /> Refresh</button>
          <button type="button" className="btn btn-primary" onClick={() => setEditing(null)}><LuPlus className="h-4 w-4" aria-hidden="true" /> New record</button>
        </div>
      </div>

      <div className="admin-project-switches" role="tablist" aria-label="Content type">
        {kinds.map(([value, label]) => <button key={value} type="button" className={kind === value ? "btn btn-primary" : "btn btn-outline"} onClick={() => { setKind(value); setEditing(undefined); }} aria-pressed={kind === value}>{label}</button>)}
      </div>

      <div className="card-surface content-filter-row">
        <SearchField label="Search site content" placeholder="Search title, key, or content" value={query} onValueChange={setQuery} />
        <label className="form-field"><span className="sr-only">Filter site content by visibility</span><select value={visibility} onChange={(event) => setVisibility(event.target.value)} aria-label="Filter site content by visibility"><option value="">All visibility</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>
      </div>

      {error ? <div className="text-error" role="alert">{error}</div> : null}
      {notice ? <div className="text-success" role="status">{notice}</div> : null}

      <div className="card-surface overflow-hidden">
        <table className="table content-table">
          <thead><tr><th>Title</th><th>Unique key</th><th>Order</th><th>Visibility</th><th className="actions-head">Actions</th></tr></thead>
          <tbody>
            {visibleItems.map((item) => (
              <tr key={item._id} className="table-row-hover">
                <td><strong>{item.title}</strong><div className="row-sub">{kind === "pricing" ? item.payload?.category || "Uncategorized" : kind === "proof" ? item.payload?.business || "Proof note" : item.payload?.best || "Service"}</div></td>
                <td><code>{item.key}</code></td>
                <td>{item.displayOrder ?? 999}</td>
                <td><span className={`badge content-status ${item.archivedAt ? "is-archived" : item.published ? "is-published" : "is-draft"}`}>{item.archivedAt ? "Archived" : item.published ? "Published" : "Draft"}</span></td>
                <td className="actions-cell"><button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(item)}><LuPencil aria-hidden="true" /> Edit</button></td>
              </tr>
            ))}
            {!visibleItems.length ? <tr><td colSpan="5" className="empty-cell">{loading ? "Loading site content…" : "No records match these filters."}</td></tr> : null}
          </tbody>
        </table>
      </div>
      {editing !== undefined ? <ContentEditor key={editing?._id || `new-${kind}`} kind={kind} item={editing} onClose={() => setEditing(undefined)} onSaved={saved} /> : null}
    </div>
  );
}
