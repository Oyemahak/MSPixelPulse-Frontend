// src/portals/admin/Approvals.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { admin } from "@/lib/api.js";
import { Check, XCircle } from "lucide-react";
import SearchField from "@/components/ui/SearchField.jsx";

export default function Approvals() {
  const [pending, setPending] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    try {
      const d = await admin.users();
      setPending((d.users || []).filter((u) => u.status === "pending"));
      setErr("");
    } catch (e) {
      setErr(e.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visiblePending = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return pending.filter((user) => !needle || `${user.name || ""} ${user.email || ""} ${user.businessName || ""} ${user.industry || ""}`.toLowerCase().includes(needle));
  }, [pending, query]);

  async function approve(id) {
    try {
      await admin.approveUser(id);
      await load();
    } catch (e) {
      alert(e.message || "Approve failed");
    }
  }

  async function decline(id) {
    if (!confirm("Decline this access application? The decision will be retained for audit history.")) return;
    try {
      await admin.rejectUser(id);
      await load();
    } catch (e) {
      alert(e.message || "Decline failed");
    }
  }

  return (
    <div className="page-shell space-y-5">
      {/* Page title */}
      <div className="page-header">
        <h2 className="page-title">Pending Approvals</h2>
        <div />
      </div>

      {err && <div className="text-error">{err}</div>}

      <div className="card-surface p-4">
        <SearchField label="Search pending approvals" placeholder="Search name, email, business, or industry" value={query} onValueChange={setQuery} />
      </div>

      <div className="card-surface overflow-hidden" role="region" aria-label="Pending approvals table" tabIndex="0">
        <table className="table">
          <thead>
            <tr>
              <th className="w-34">Name</th>
              <th className="w-34">Email</th>
              <th className="w-20">Business</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visiblePending.map((u) => (
              <tr key={u._id} className="table-row-hover">
                <td className="font-medium"><Link className="row-link" to={`/admin/users/${u._id}`}>{u.name || "—"}</Link></td>
                <td className="text-muted">{u.email}</td>
                <td>{u.businessName || u.industry || "—"}</td>
                <td className="actions-cell">
                  <button
                    type="button"
                    onClick={() => approve(u._id)}
                    className="icon-btn text-emerald-400 hover:text-emerald-300 mr-1"
                    title={`Approve ${u.name || u.email}`}
                    aria-label={`Approve ${u.name || u.email}`}
                  >
                    <Check size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => decline(u._id)}
                    className="icon-btn text-rose-400 hover:text-rose-300"
                    title={`Decline ${u.name || u.email}`}
                    aria-label={`Decline ${u.name || u.email}`}
                  >
                    <XCircle size={16} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
            {!visiblePending.length && (
              <tr>
                <td colSpan="4" className="empty-cell">
                  {loading ? "Loading…" : query ? "No pending approvals match this search." : "No pending approvals."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
