import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { directory } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import SearchField from "@/components/ui/SearchField.jsx";

export default function DirectIndex() {
  const { user } = useAuth();
  const [people, setPeople] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await directory.list();
        setPeople((data.users || []).filter((person) => String(person._id) !== String(user?._id)));
      } catch (err) {
        setError(err?.message || "The user directory could not be loaded.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?._id]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return people.filter((person) => (
      !normalized || `${person.name || ""} ${person.email || ""} ${person.role || ""}`.toLowerCase().includes(normalized)
    ));
  }, [people, query]);

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <div>
          <div className="text-muted-xs">Persisted conversations</div>
          <h2 className="page-title">Direct messages</h2>
          <p className="text-muted">Choose an active team member or client to open the saved conversation.</p>
        </div>
      </div>

      <div className="card-surface p-4">
        <SearchField
          label="Search people"
          placeholder="Search by name, email, or role"
          value={query}
          onValueChange={setQuery}
        />
      </div>

      {error && <div className="text-error" role="alert">{error}</div>}
      <div className="card-surface">
        <div className="list">
          {filtered.map((person) => (
            <Link
              key={person._id}
              to={`/admin/direct/${person._id}`}
              state={{ peerName: person.name, peerEmail: person.email }}
              className="block px-4 py-3 hover:bg-white/5"
            >
              <div className="font-semibold">{person.name || person.email}</div>
              <div className="row-sub">{person.email} · <span className="capitalize">{person.role}</span></div>
            </Link>
          ))}
          {loading && <div className="empty-cell">Loading people…</div>}
          {!loading && !filtered.length && <div className="empty-cell">No active people match this search.</div>}
        </div>
      </div>
    </div>
  );
}
