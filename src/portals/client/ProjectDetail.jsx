// frontend/src/portals/client/ProjectDetail.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { portalErrorMessage, projects as api, requirements as reqApi } from "@/lib/api.js";
import { formatActivityMeta } from "@/lib/messageTime.js";

/**
 * ClientProjectDetail
 * Tabs: Overview | Requirements (full editor) | Evidence (view) | Announcements (view)
 * - Requirements uploads are ADDITIVE (server merges by page name, file lists append).
 * - Replacing logo/brief doesn't touch anything else.
 * - After each successful save we emit a lightweight audit entry in Evidence.
 */
export default function ClientProjectDetail() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [project, setProject] = useState(null);
  const [fatalErr, setFatalErr] = useState("");
  const [tab, setTab] = useState(() => searchParams.get("tab") || "overview"); // overview | requirements | evidence | updates

  // Requirements snapshot
  const [reqSnap, setReqSnap] = useState(null);
  const [reqBusy, setReqBusy] = useState(false);
  const [reqErr, setReqErr] = useState("");

  // Evidence (read-only)
  const [timeline, setTimeline] = useState([]);

  // Announcements (read-only)
  const [ann, setAnn] = useState([]);
  const [annBusy, setAnnBusy] = useState(false);
  const [annErr, setAnnErr] = useState("");

  const loadProject = useCallback(async () => {
    try {
      const p = await api.one(projectId);
      const proj = p.project || p;
      setProject(proj);
      setTimeline(Array.isArray(proj.evidence) ? proj.evidence : []);
    } catch (e) {
      setFatalErr(portalErrorMessage(e, "project"));
    }
  }, [projectId]);

  const loadReq = useCallback(async ({ throwOnError = false } = {}) => {
    setReqErr("");
    try {
      setReqBusy(true);
      const d = await reqApi.get(projectId);
      setReqSnap(d.requirement || null);
      return d.requirement || null;
    } catch (e) {
      setReqErr(portalErrorMessage(e, "project"));
      setReqSnap(null);
      if (throwOnError) throw e;
      return null;
    } finally {
      setReqBusy(false);
    }
  }, [projectId]);

  const loadAnnouncements = useCallback(async () => {
    setAnnErr("");
    setAnnBusy(true);
    try {
      // Persisted announcements from backend
      const d = await api.listAnnouncements(projectId); // { ok, items }
      setAnn(d.items || []);
    } catch (e) {
      setAnnErr(portalErrorMessage(e, "project"));
    } finally {
      setAnnBusy(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadProject();
    void loadReq();
    void loadAnnouncements();
  }, [projectId, loadProject, loadReq, loadAnnouncements]);

  useEffect(() => {
    const requested = searchParams.get("tab");
    if (["overview", "requirements", "evidence", "updates"].includes(requested)) setTab(requested);
  }, [searchParams]);

  const clientName = useMemo(() => project?.client?.name || "—", [project]);

  if (!project) {
    return (
      <div className="page-shell">
        {fatalErr ? <div className="text-error">{fatalErr}</div> : "Loading…"}
      </div>
    );
  }

  return (
    <div className="page-shell space-y-5">
      <div className="page-header">
        <h2 className="page-title">Project · {project.title}</h2>
        <div className="flex items-center gap-2">
          <span className="badge capitalize">{project.status || "draft"}</span>
        </div>
      </div>

      <div className="card-surface p-3">
        <div className="project-detail-tabs flex gap-2 flex-wrap">
          {["overview", "requirements", "evidence", "updates"].map((k) => (
            <button
              key={k}
              type="button"
              className={`btn h-10 px-4 rounded-lg ${tab === k ? "btn-primary" : "btn-outline"}`}
              onClick={() => {
                setTab(k);
                setSearchParams(k === "overview" ? {} : { tab: k }, { replace: true });
              }}
            >
              {k === "overview"
                ? "Overview"
                : k === "requirements"
                ? "Requirements"
                : k === "evidence"
                ? "Evidence"
                : "Announcements"}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && <OverviewCard project={project} clientName={clientName} announcements={ann} />}

      {tab === "requirements" && (
        <ClientRequirementsEditor
          projectId={projectId}
          snapshot={reqSnap}
          busy={reqBusy}
          error={reqErr}
          onReload={async (savedRequirement) => {
            if (savedRequirement) setReqSnap(savedRequirement);
            await loadReq({ throwOnError: true });
            await loadProject(); // evidence reflects "Client updated…"
          }}
        />
      )}

      {tab === "evidence" && (
        <EvidenceTimeline
          timeline={timeline}
          onRefresh={async () => {
            await loadProject();
          }}
        />
      )}

      {tab === "updates" && (
        <AnnouncementsPanel
          announcements={ann}
          busy={annBusy}
          error={annErr}
          onRefresh={loadAnnouncements}
        />
      )}
    </div>
  );
}

/* ============================================================
   Overview
   ============================================================ */
function OverviewCard({ project, clientName, announcements }) {
  return (
    <div className="grid-2">
      <div className="card-surface card-pad space-stack">
        <div className="card-title">Summary</div>
        <div className="text-muted">{project.summary || "—"}</div>
        <div className="text-muted-xs">
          Client: <b>{clientName}</b>
          {project.developer?.name ? (
            <> · Developer: <b>{project.developer.name}</b></>
          ) : null}
        </div>
      </div>

      <div className="card-surface card-pad">
        <div className="card-title mb-2">Latest announcements</div>
        <ul className="space-stack text-sm">
          {(announcements || []).slice(0, 3).map((a, i) => (
            <li key={i} className="bg-white/5 rounded-xl p-3">
              <div className="font-medium">{a.title}</div>
              {a.body && <div className="text-muted mt-1">{a.body}</div>}
              <div className="text-muted-xs mt-1">{formatActivityMeta(a)}</div>
            </li>
          ))}
          {!(announcements || []).length && <li className="text-muted-xs">No announcements yet.</li>}
        </ul>
      </div>
    </div>
  );
}

/* ============================================================
   Requirements Editor (Client)
   - Non-destructive, additive merge
   - Pretty file pickers with drag & drop, badges, remove
   - After save, emits an audit entry via project evidence
   ============================================================ */
function ClientRequirementsEditor({ projectId, snapshot, busy, error, onReload }) {
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [saveStage, setSaveStage] = useState("");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  // New uploads (transient)
  const [logo, setLogo] = useState(null);
  const [brief, setBrief] = useState(null);
  const [supporting, setSupporting] = useState([]); // File[]
  const [pagesMeta, setPagesMeta] = useState([]);   // [{name, note}]
  const [pageFiles, setPageFiles] = useState({});   // { [pageName]: File[] }

  // initialize from snapshot
  useEffect(() => {
    if (!snapshot) {
      setPagesMeta([]);
      setPageFiles({});
      return;
    }
    const suggested = (snapshot.pages || []).map((p) => ({ name: p.name || "", note: p.note || "" }));
    setPagesMeta(suggested);
    setPageFiles({});
  }, [snapshot]);

  const normalizeName = (n = "") => String(n).trim();
  const pageKey = (n = "") => normalizeName(n).toLowerCase();

  function addPageRow() {
    setPagesMeta((prev) => [...prev, { name: "", note: "" }]);
  }
  function changePageField(idx, field, value) {
    if (field === "name") {
      const previousKey = pageKey(pagesMeta[idx]?.name);
      const nextKey = pageKey(value);

      if (previousKey && nextKey && previousKey !== nextKey) {
        setPageFiles((prev) => {
          const previousFiles = prev[previousKey] || [];
          if (!previousFiles.length) return prev;

          const next = { ...prev };
          next[nextKey] = [...(next[nextKey] || []), ...previousFiles];
          delete next[previousKey];
          return next;
        });
      }
    }

    setPagesMeta((prev) => {
      const copy = prev.slice();
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }
  function removePageRow(idx) {
    const key = pageKey(pagesMeta[idx]?.name);
    setPagesMeta((prev) => prev.filter((_, i) => i !== idx));
    if (key) {
      setPageFiles((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  const addSupportingFiles = (files) => {
    if (!files?.length) return;
    setSupporting((prev) => [...prev, ...files]);
  };
  const removeSupportingAt = (i) => setSupporting((prev) => prev.filter((_, idx) => idx !== i));

  const addPageFiles = (pageName, files) => {
    if (!files?.length) return;
    const key = pageKey(pageName);
    setPageFiles((prev) => ({ ...prev, [key]: [...(prev[key] || []), ...files] }));
  };
  const clearPageFiles = (pageName) => {
    const key = pageKey(pageName);
    setPageFiles((prev) => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  function buildPayload() {
    const pages = pagesMeta
      .map((p) => ({ name: normalizeName(p.name), note: String(p.note || "") }))
      .filter((p) => p.name);

    const dynamic = {};
    pages.forEach(({ name }) => {
      const list = pageFiles[pageKey(name)] || [];
      if (list.length) dynamic[name] = list;
    });

    return {
      pages,
      files: {
        ...(logo ? { logo } : {}),
        ...(brief ? { brief } : {}),
        ...(supporting.length ? { supporting } : {}),
        ...(Object.keys(dynamic).length ? { pageFiles: dynamic } : {}),
      },
    };
  }

  async function saveAll() {
    if (savingRef.current) return;

    setErr("");
    setOk("");
    try {
      const payload = buildPayload();

      const nothingToUpload =
        !payload.files?.logo &&
        !payload.files?.brief &&
        !payload.files?.supporting &&
        !payload.files?.pageFiles &&
        (payload.pages || []).length === 0;

      if (nothingToUpload) {
        setErr("Nothing to upload. Add files or page info first.");
        return;
      }

      savingRef.current = true;
      setSaving(true);
      setSaveStage("Preparing upload…");

      const result = await reqApi.upsert(projectId, payload, {
        onStage: (stage, file) => {
          const fileName = file?.name ? ` ${file.name}` : "";
          const labels = {
            session: `Preparing${fileName}…`,
            upload: `Uploading${fileName}…`,
            complete: `Finalizing${fileName}…`,
            save: "Saving requirements…",
          };
          setSaveStage(labels[stage] || "Saving…");
        },
      });

      // reset transient picks
      setLogo(null);
      setBrief(null);
      setSupporting([]);
      setPageFiles({});

      try {
        await onReload?.(result.requirement);
      } catch {
        setErr("Requirements were saved, but the latest data could not be refreshed. Reload this page to verify it.");
        return;
      }

      setOk(
        result.cleanupPending
          ? "Requirements saved. Previous-file cleanup will finish in the background."
          : "Requirements saved and verified.",
      );
      setTimeout(() => setOk(""), 3000);
    } catch (e) {
      setErr(portalErrorMessage(e, "project"));
    } finally {
      savingRef.current = false;
      setSaving(false);
      setSaveStage("");
    }
  }

  const hasExisting =
    snapshot &&
    (snapshot.logo || snapshot.brief || (snapshot.supporting || []).length || (snapshot.pages || []).length);

  return (
    <div className="card-surface card-pad space-stack">
      <div className="flex items-center justify-between">
        <div className="card-title">Your requirements</div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => onReload?.()} disabled={busy || saving}>
          {busy ? "Refreshing…" : "Reload"}
        </button>
      </div>

      {(error || err || ok) && (
        <div className="space-stack">
          {error && <div className="text-error">{error}</div>}
          {err && <div className="text-error">{err}</div>}
          {ok && <div className="text-success">{ok}</div>}
        </div>
      )}

      {/* Read-only snapshot preview */}
      <ExistingRequirements req={snapshot} emptyMsg={hasExisting ? "" : "Nothing uploaded yet."} />

      {/* Editor */}
      <div className="mt-2 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
        {/* Core */}
        <section className="min-w-0 bg-white/5 rounded-xl p-4 space-stack">
          <div className="font-extrabold">Core</div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="form-label">Logo (PNG/JPG/WebP)</div>
              <PrettyPicker
                mode="single"
                accept="image/png,image/jpeg,image/webp,.jpg,.jpeg,.png,.webp"
                placeholder="Choose a logo file"
                value={logo}
                onChange={(f) => setLogo(f)}
                onRemove={() => setLogo(null)}
              />
              {snapshot?.logo && !logo && (
                <div className="text-muted-xs mt-1">
                  Current:{" "}
                  <a className="subtle-link" href={snapshot.logo.url} target="_blank" rel="noreferrer">
                    {snapshot.logo.name}
                  </a>
                </div>
              )}
            </div>
            <div>
              <div className="form-label">Brief / Document (PDF/Doc)</div>
              <PrettyPicker
                mode="single"
                accept="application/pdf,.doc,.docx"
                placeholder="Attach your brief"
                value={brief}
                onChange={(f) => setBrief(f)}
                onRemove={() => setBrief(null)}
              />
              {snapshot?.brief && !brief && (
                <div className="text-muted-xs mt-1">
                  Current:{" "}
                  <a className="subtle-link" href={snapshot.brief.url} target="_blank" rel="noreferrer">
                    {snapshot.brief.name}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Supporting */}
        <section className="min-w-0 bg-white/5 rounded-xl p-4 space-stack">
          <div className="font-extrabold">Supporting documents</div>
          <div className="text-muted-xs">
            Add references (screenshots, PDFs, brand files). These append to what’s already there — nothing is removed.
          </div>
          <PrettyPicker
            mode="multi"
            accept="application/pdf,.doc,.docx,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            placeholder="Drop files here or click to upload"
            onChange={(files) => addSupportingFiles(files)}
          />
          {!!supporting.length && (
            <FileBadgeList files={supporting} onRemove={(idx) => removeSupportingAt(idx)} />
          )}
        </section>

        {/* Pages */}
        <section className="min-w-0 bg-white/5 rounded-xl p-4 space-stack">
          <div className="font-extrabold">Website pages</div>
          <div className="text-muted-xs">
            Create/update by page name (e.g., <i>Home</i>, <i>Services</i>, <i>Contact</i>). Files you attach here merge
            into that page; notes replace the note for that page.
          </div>

          <div className="space-stack">
            {pagesMeta.map((p, idx) => {
              const key = pageKey(p.name);
              const picked = pageFiles[key] || [];
              return (
                <div key={idx} className="rounded-xl border border-white/10 p-3 space-stack">
                  <div className="grid md:grid-cols-2 gap-3">
                    <label className="form-field">
                      <div className="form-label">Page name</div>
                      <input
                        className="form-input"
                        value={p.name}
                        onChange={(e) => changePageField(idx, "name", e.target.value)}
                        placeholder="Home / About / Services / Contact …"
                      />
                    </label>
                    <label className="form-field">
                      <div className="form-label">Notes / instructions (optional)</div>
                      <input
                        className="form-input"
                        value={p.note}
                        onChange={(e) => changePageField(idx, "note", e.target.value)}
                        placeholder="Sections, content, references …"
                      />
                    </label>
                  </div>

                  <div>
                    <div className="form-label">Attach files for this page</div>
                    <PrettyPicker
                      mode="multi"
                      accept="application/pdf,.doc,.docx,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      disabled={!key}
                      placeholder={key ? `Drop files for “${key}”` : "Enter a page name first"}
                      onChange={(files) => addPageFiles(key, files)}
                    />
                    {!!picked.length && (
                      <FileBadgeList files={picked} onRemove={(removeIdx) => {
                        const arr = [...picked];
                        arr.splice(removeIdx, 1);
                        setPageFiles((prev) => ({ ...prev, [key]: arr }));
                      }} />
                    )}
                  </div>

                  <div className="requirement-page-actions flex items-center justify-between pt-1">
                    <div className="text-muted-xs">
                      {picked.length ? `${picked.length} selected for this page` : ""}
                    </div>
                    <div className="flex gap-2">
                      {!!picked.length && (
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => clearPageFiles(key)}>
                          Clear files
                        </button>
                      )}
                      <button type="button" className="btn btn-outline btn-sm text-rose-300" onClick={() => removePageRow(idx)}>
                        Remove row
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" className="btn btn-outline" onClick={addPageRow}>
            + Add page
          </button>
        </section>

        <div className="form-actions">
          <button type="button" className="btn btn-primary" onClick={saveAll} disabled={saving}>
            {saving ? saveStage || "Saving…" : "Save changes"}
          </button>
        </div>

        <div className="text-muted-xs">
          Tip: Each save is additive. To remove something later, ask Admin to delete specific items.
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Pretty file pickers & badges (no external deps)
   ============================================================ */
function PrettyPicker({
  mode = "single",
  accept,
  placeholder = "Click to choose files",
  value,
  onChange,
  onRemove,
  disabled,
}) {
  const inputRef = useRef(null);
  const [isOver, setIsOver] = useState(false);

  const choose = () => !disabled && inputRef.current?.click();

  const handleFiles = (filesList) => {
    const files = Array.from(filesList || []);
    if (!files.length) return;
    if (mode === "single") onChange?.(files[0]);
    else onChange?.(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={onDrop}
      className={`requirement-picker rounded-xl border border-dashed transition-colors
        ${disabled ? "opacity-50" : ""}
        ${isOver ? "border-white/60 bg-white/10" : "border-white/15 bg-white/5"}`}
      aria-disabled={disabled}
    >
      <button
        type="button"
        className="requirement-picker-button"
        onClick={choose}
        disabled={disabled}
      >
        <span className="min-w-0 text-sm text-left">
          <span className="block font-medium opacity-90">
            {value ? "Selected file" : placeholder}
          </span>
          <span className="text-muted-xs block">
            {value
              ? "Choose another file or remove it below"
              : `Drag & drop or choose ${mode === "single" ? "one file" : "multiple files"}`}
          </span>
        </span>
        <span className="btn btn-outline pointer-events-none shrink-0">
          {disabled ? "Unavailable" : value ? "Change" : mode === "single" ? "Choose file" : "Choose files"}
        </span>
      </button>

      {value ? (
        <div className="requirement-picker-selection" role="status">
          <span className="min-w-0">
            <span className="requirement-picker-name" title={value.name}>{value.name}</span>
            <span className="text-muted-xs">{formatSize(value.size)}</span>
          </span>
          <button
            type="button"
            className="btn btn-outline btn-xs"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove ${value.name}`}
          >
            Remove
          </button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={mode !== "single"}
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />
    </div>
  );
}

function FileBadgeList({ files = [], onRemove }) {
  return (
    <div className="requirement-file-list mt-2" role="status">
      {files.map((f, i) => (
        <div key={`${f.name}-${f.size}-${i}`} className="requirement-file-item">
          <span className="requirement-file-copy">
            <span className="requirement-picker-name" title={f.name}>{f.name}</span>
            {f.size !== undefined && <span className="text-muted-xs">{formatSize(f.size)}</span>}
          </span>
          <button
            type="button"
            className="btn btn-xs btn-outline"
            onClick={() => onRemove?.(i)}
            aria-label={`Remove ${f.name}`}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function formatSize(n) {
  if (!n && n !== 0) return "";
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/* ============================================================
   Read-only Requirements rendering
   ============================================================ */
function ExistingRequirements({ req, emptyMsg = "—" }) {
  if (!req) return <div className="text-muted-xs">{emptyMsg}</div>;

  return (
    <div className="space-stack">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="row-sub">Logo</div>
          {req.logo ? (
            <a className="subtle-link" href={req.logo.url} target="_blank" rel="noreferrer">
              {req.logo.name}
            </a>
          ) : "—"}
        </div>
        <div>
          <div className="row-sub">Brief</div>
          {req.brief ? (
            <a className="subtle-link" href={req.brief.url} target="_blank" rel="noreferrer">
              {req.brief.name}
            </a>
          ) : "—"}
        </div>
      </div>

      <div>
        <div className="row-sub mb-1">Supporting documents</div>
        {(req.supporting || []).length ? (
          <ul className="list-disc pl-5 text-sm">
            {req.supporting.map((f, i) => (
              <li key={i}><a className="subtle-link" href={f.url} target="_blank" rel="noreferrer">{f.name}</a></li>
            ))}
          </ul>
        ) : "—"}
      </div>

      <div>
        <div className="row-sub mb-1">Pages</div>
        {(req.pages || []).length ? (
          <div className="space-stack">
            {req.pages.map((p, i) => (
              <div key={`${p.name}-${i}`} className="bg-white/5 rounded-lg p-3">
                <div className="font-semibold">{p.name}</div>
                {p.note && <div className="text-muted text-sm mt-1 whitespace-pre-wrap">{p.note}</div>}
                {!!(p.files || []).length && (
                  <ul className="list-disc pl-5 text-sm mt-1">
                    {p.files.map((f, k) => (
                      <li key={k}><a className="subtle-link" href={f.url} target="_blank" rel="noreferrer">{f.name}</a></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : "—"}
      </div>

      <div className="text-muted-xs">
        Updated: {req.updatedAt ? new Date(req.updatedAt).toLocaleString() : "—"}
        {req.reviewedByDev ? " · Reviewed by Developer" : ""}
      </div>
    </div>
  );
}

/* ============================================================
   Evidence Timeline (read-only)
   ============================================================ */
function EvidenceTimeline({ timeline = [], onRefresh }) {
  return (
    <div className="grid-2">
      <div className="card-surface card-pad">
        <div className="card-title mb-2">Evidence timeline</div>
        <div className="space-stack">
          {(timeline || []).map((it, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3">
              <div className="font-extrabold">{it.title || "Update"}</div>
              {!!(it.links || []).length && (
                <ul className="text-sm mt-1">
                  {it.links.map((l, k) => (
                    <li key={k}><a className="subtle-link" href={l} target="_blank" rel="noreferrer">{l}</a></li>
                  ))}
                </ul>
              )}
              {!!(it.images || []).length && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                  {it.images.map((im, k) => (
                    <img
                      key={k}
                      alt={im.name || `${it.title || "Project update"} evidence ${k + 1}`}
                      src={im.url}
                      className="rounded-lg border border-white/10"
                    />
                  ))}
                </div>
              )}
              <div className="text-muted-xs mt-1">{formatActivityMeta(it)}</div>
            </div>
          ))}
          {!((timeline || []).length) && <div className="text-muted-xs">No evidence yet.</div>}
        </div>

        <div className="form-actions mt-tight">
          <button type="button" className="btn btn-outline" onClick={onRefresh}>Refresh</button>
        </div>
      </div>

      <div className="card-surface card-pad">
        <div className="card-title mb-2">What is this?</div>
        <ul className="text-sm text-muted space-stack">
          <li>Evidence is posted by the Developer/Admin to show progress.</li>
          <li>You can refresh anytime to see new updates.</li>
        </ul>
      </div>
    </div>
  );
}

/* ============================================================
   Announcements (read-only)
   ============================================================ */
function AnnouncementsPanel({ announcements = [], busy, error, onRefresh }) {
  return (
    <div className="card-surface card-pad">
      <div className="flex items-center justify-between">
        <div className="card-title">Announcements</div>
        <button type="button" className="btn btn-outline btn-sm" onClick={onRefresh} disabled={busy}>
          {busy ? "Refreshing…" : "Reload"}
        </button>
      </div>

      {error && <div className="text-error mt-2">{error}</div>}

      <div className="space-stack mt-2">
        {(announcements || []).map((a, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-3">
            <div className="font-extrabold">{a.title}</div>
            {a.body && <div className="text-muted mt-1 whitespace-pre-wrap">{a.body}</div>}
            <div className="text-muted-xs mt-1">{formatActivityMeta(a)}</div>
          </div>
        ))}
        {!(announcements || []).length && (
          <div className="text-muted-xs">{busy ? "Loading…" : "Nothing yet."}</div>
        )}
      </div>
    </div>
  );
}
