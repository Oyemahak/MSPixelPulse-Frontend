// src/portals/dev/Team.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

import { directory } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import SearchField from "@/components/ui/SearchField.jsx";
import PresenceIndicator from "@/components/portal/PresenceIndicator.jsx";

export default function Team() {
  const { user } = useAuth();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr("");

      try {
        const data =
          await directory.list();

        if (!alive) return;

        const members = (
          data.users || []
        ).filter((member) =>
          [
            "admin",
            "developer",
          ].includes(member.role),
        );

        setRows(members);
      } catch (error) {
        if (!alive) return;

        setErr(
          error?.message ||
            "Team could not be loaded.",
        );

        setRows([]);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle =
      q.trim().toLowerCase();

    return rows.filter(
      (member) =>
        !needle ||
        `${member.name} ${member.email} ${member.role}`
          .toLowerCase()
          .includes(needle),
    );
  }, [rows, q]);

  const grouped = useMemo(() => {
    const groups = {
      admin: [],
      developer: [],
    };

    for (const member of filtered) {
      (
        groups[member.role] ||
        groups.developer
      ).push(member);
    }

    return groups;
  }, [filtered]);

  function Section({
    title,
    items,
  }) {
    return (
      <div className="card overflow-hidden">
        <div className="card-strip between">
          <div className="font-semibold">
            {title}
          </div>

          <div className="text-muted-xs">
            {items.length} member
            {items.length !== 1
              ? "s"
              : ""}
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="w-34">
                Member
              </th>

              <th className="w-34">
                Email
              </th>

              <th className="w-24">
                Presence
              </th>

              <th className="w-20">
                Role
              </th>

              <th className="actions-head">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map(
              (member) => {
                const isMe =
                  String(
                    member._id,
                  ) ===
                  String(
                    user?._id,
                  );

                return (
                  <tr
                    key={`${member.role}-${member._id}`}
                    className="table-row-hover"
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <PresenceIndicator
                          user={member}
                          compact
                        />

                        <span className="font-medium">
                          {member.name ||
                            "—"}
                        </span>

                        {isMe && (
                          <span className="badge">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="text-muted">
                      {member.email}
                    </td>

                    <td>
                      <PresenceIndicator
                        user={member}
                      />
                    </td>

                    <td className="capitalize">
                      <span className="badge">
                        {member.role}
                      </span>
                    </td>

                    <td className="actions-cell">
                      {!isMe && (
                        <Link
                          to={`/dev/direct/${member._id}`}
                          state={{
                            peerEmail:
                              member.email,

                            peerName:
                              member.name,

                            peerLastSeenAt:
                              member.lastSeenAt,

                            peerPresence:
                              member.presence,
                          }}
                          className="icon-btn"
                          title={`Message ${
                            member.name ||
                            member.email
                          }`}
                          aria-label={`Message ${
                            member.name ||
                            member.email
                          }`}
                        >
                          <MessageSquare
                            size={16}
                            aria-hidden="true"
                          />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              },
            )}

            {!items.length && (
              <tr>
                <td
                  colSpan="5"
                  className="empty-cell"
                >
                  {loading
                    ? "Loading…"
                    : "No members."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <h2 className="page-title">
          Team
        </h2>

        <div />
      </div>

      {err && (
        <div className="text-error">
          {err}
        </div>
      )}

      <div className="card card-pad filters-grid portal-search-row">
        <SearchField
          label="Search team members"
          placeholder="Search team members"
          value={q}
          onValueChange={setQ}
        />
      </div>

      <div className="stack">
        <Section
          title={`Admins (${grouped.admin.length})`}
          items={grouped.admin}
        />

        <Section
          title={`Developers (${grouped.developer.length})`}
          items={grouped.developer}
        />
      </div>
    </div>
  );
}