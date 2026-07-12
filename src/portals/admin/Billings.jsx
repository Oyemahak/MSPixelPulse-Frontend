// src/portals/admin/Billings.jsx
import { Fragment, useEffect, useMemo, useState } from "react";
import { projects as api, invoices as invApi, files as fileApi } from "@/lib/api.js";

/* Small badge renderer */
function StatusBadge({ inv }) {
  if (!inv) return <span className="text-muted-xs">—</span>;
  if (inv.status === "draft") return <span className="badge">Draft</span>;
  if (inv.status === "sent") return <span className="badge">Sent</span>;
  if (inv.status === "paid") return <span className="badge">Paid</span>;
  if (inv.status === "archived") return <span className="badge">Archived</span>;
  return <span className="badge">Uploaded</span>;
}

function formatMoney(value, currency = "CAD") {
  if (!Number.isFinite(Number(value))) return "";
  return new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(Number(value));
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function InvoiceDetails({ inv }) {
  if (!inv) return null;
  return (
    <div className="grid gap-2 text-sm text-white/70">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge inv={inv} />
        <span className="font-semibold text-white/85">
          {inv.invoiceNumber || inv.file?.name || inv.title || "Invoice details"}
        </span>
        {inv.isDemo && <span className="badge">Sample</span>}
      </div>
      {inv.title && <div>{inv.title}</div>}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-xs">
        {inv.issueDate && <span>Issued {formatDate(inv.issueDate)}</span>}
        {inv.dueDate && <span>Due {formatDate(inv.dueDate)}</span>}
        {Number(inv.total) > 0 && <span>Total {formatMoney(inv.total, inv.currency)}</span>}
      </div>
      {inv.notes && <div className="text-muted-xs">{inv.notes}</div>}
    </div>
  );
}

/* Preview for PDF/image */
function Preview({ file }) {
  if (!file?.url) return null;
  const isPDF = file.type?.includes("pdf");
  return isPDF ? (
    <iframe title={file.name || "invoice"} className="w-full h-64 rounded-xl border border-white/10" src={file.url} />
  ) : (
    <img alt={file.name || "invoice"} className="w-full rounded-xl border border-white/10" src={file.url} />
  );
}

/* File picker */
function FilePicker({ id, label = "Upload invoice (PDF or image)", onPick, disabled, value }) {
  return (
    <div className="space-y-2">
      <div className="form-label">{label}</div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="file"
          accept="application/pdf,image/*"
          className="sr-only"
          onChange={(e) => onPick(e.target.files?.[0] || null)}
          disabled={disabled}
        />
        <label htmlFor={id} className={`btn btn-outline btn-sm ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
          Choose file
        </label>
        <span className="text-sm text-white/70 truncate max-w-[260px]">{value?.name || "No file chosen"}</span>
      </div>
    </div>
  );
}

export default function Billings() {
  // data
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // ui
  const [q, setQ] = useState("");
  const [openEditId, setOpenEditId] = useState(null);
  const [busyId, setBusyId] = useState("");
  const [tick, setTick] = useState(0);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const d = await api.list();
      setRows(d.projects || []);
    } catch (e) {
      setErr(e.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows || []).filter((p) => !needle || `${p.title} ${p.summary}`.toLowerCase().includes(needle));
  }, [rows, q]);

  /* Fetch invoices for one project */
  async function loadBilling(projectId) {
    const d = await invApi.list(projectId);
    const list = d.invoices || [];
    const advance = list.find((x) => x.kind === "advance") || null;
    const finalInv = list.find((x) => x.kind === "final") || null;
    return { advance, final: finalInv };
  }

  /* Inline editor row */
  function EditorRow({ p }) {
    const [advance, setAdvance] = useState(null);
    const [finalInv, setFinalInv] = useState(null);
    const [loaded, setLoaded] = useState(false);

    async function refresh() {
      const snap = await loadBilling(p._id);
      setAdvance(snap.advance);
      setFinalInv(snap.final);
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { refresh(); }, []);

    async function handlePick(kind, file) {
      if (!file) return;
      setBusyId(p._id);
      try {
        // 1) upload the raw file to supabase via backend
        const up = await fileApi.upload(file); // { file: { name,type,size,path,url } }
        // 2) create invoice row
        await invApi.create(p._id, { kind, file: up.file });
        await refresh();
        setTick((t) => t + 1);
      } catch (e) {
        setErr(e.message || "Upload failed");
      } finally {
        setBusyId("");
      }
    }

    async function markPaid(kind) {
      try {
        const id = kind === "advance" ? advance?._id : finalInv?._id;
        if (!id) return;
        setBusyId(p._id);
        await invApi.updateStatus(p._id, id, "paid");
        await refresh();
        setTick((t) => t + 1);
      } finally {
        setBusyId("");
      }
    }

    async function clearFile(kind) {
      const id = kind === "advance" ? advance?._id : finalInv?._id;
      if (!id) return;
      if (!confirm("Archive this invoice?")) return;
      setBusyId(p._id);
      try {
        await invApi.remove(p._id, id);
        await refresh();
        setTick((t) => t + 1);
      } finally {
        setBusyId("");
      }
    }

    return (
      <tr className="row-edit">
        <td colSpan={5}>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Advance */}
            <div className="card-surface p-5 space-y-3">
              <div className="card-title">Advance payment (50%)</div>

              {!advance ? (
                <FilePicker
                  id={`adv-${p._id}`}
                  value={null}
                  onPick={(file) => handlePick("advance", file)}
                  disabled={busyId === p._id}
                />
              ) : (
                <>
                  <InvoiceDetails inv={advance} />
                  <Preview file={advance.file} />
                  <div className="form-actions">
                    {advance.file?.url ? (
                      <a className="btn btn-outline" href={advance.file.url} download={advance.file?.name || "invoice"}>
                        Download
                      </a>
                    ) : (
                      <span className="text-muted-xs">No export file attached.</span>
                    )}
                    {advance.status !== "paid" && advance.status !== "archived" && (
                      <button className="btn btn-primary" onClick={() => markPaid("advance")} disabled={busyId === p._id}>
                        Mark as paid
                      </button>
                    )}
                    <button className="btn btn-outline" onClick={() => clearFile("advance")} disabled={busyId === p._id}>
                      Archive
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Final */}
            <div className="card-surface p-5 space-y-3">
              <div className="card-title">Final invoice (after delivery)</div>

              {!finalInv ? (
                <FilePicker
                  id={`fin-${p._id}`}
                  value={null}
                  onPick={(file) => handlePick("final", file)}
                  disabled={busyId === p._id}
                />
              ) : (
                <>
                  <InvoiceDetails inv={finalInv} />
                  <Preview file={finalInv.file} />
                  <div className="form-actions">
                    {finalInv.file?.url ? (
                      <a className="btn btn-outline" href={finalInv.file.url} download={finalInv.file?.name || "invoice"}>
                        Download
                      </a>
                    ) : (
                      <span className="text-muted-xs">No export file attached.</span>
                    )}
                    {finalInv.status !== "paid" && finalInv.status !== "archived" && (
                      <button className="btn btn-primary" onClick={() => markPaid("final")} disabled={busyId === p._id}>
                        Mark as paid
                      </button>
                    )}
                    <button className="btn btn-outline" onClick={() => clearFile("final")} disabled={busyId === p._id}>
                      Archive
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="text-muted-xs mt-4">
            {loaded ? "Updated —" : "Loading…"}{" "}
            <button className="subtle-link" onClick={() => (refresh(), setTick(t => t + 1))}>Refresh</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="page-shell space-y-5">
      <div className="page-header">
        <h2 className="page-title">Billing</h2>
        <div />
      </div>

      <div className="card card-pad filters-grid">
        <input className="form-input" placeholder="Search projects…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-outline" onClick={load} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {err && <div className="text-error">{err}</div>}

      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-42">Project</th>
              <th className="w-24">Client</th>
              <th className="w-20">Advance</th>
              <th className="w-20">Final</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody key={tick}>
            {filtered.map((p) => (
              <Fragment key={p._id}>
                <BillingRow p={p} openEditId={openEditId} setOpenEditId={setOpenEditId} />
              </Fragment>
            ))}
            {!filtered.length && (
              <tr><td colSpan="5" className="empty-cell">{loading ? "Loading…" : "No projects found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  function BillingRow({ p, openEditId, setOpenEditId }) {
    const [snap, setSnap] = useState({ advance: null, final: null });
    useEffect(() => {
      (async () => {
        try {
          setSnap(await loadBilling(p._id));
        } catch {
          setSnap({ advance: null, final: null });
        }
      })();
    }, [tick]);

    return (
      <>
        <tr className="table-row-hover">
          <td>
            <div className="font-medium">{p.title}</div>
            {p.summary && <div className="row-sub line-clamp-1">{p.summary}</div>}
          </td>
          <td className="text-white/80">{p.client?.name || "—"}</td>
          <td><StatusBadge inv={snap.advance} /></td>
          <td><StatusBadge inv={snap.final} /></td>
          <td className="actions-cell">
            <button
              className="btn btn-outline"
              onClick={() => setOpenEditId((v) => (v === p._id ? null : p._id))}
              disabled={busyId === p._id}
              title="Upload invoices, preview, download, mark as paid"
            >
              {openEditId === p._id ? "Close" : "Manage billing"}
            </button>
          </td>
        </tr>
        {openEditId === p._id && <EditorRow p={p} />}
      </>
    );
  }
}
