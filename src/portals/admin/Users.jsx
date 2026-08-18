// src/portals/admin/Users.jsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Check,
  MessageSquare,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { admin } from "@/lib/api.js";
import SearchField from "@/components/ui/SearchField.jsx";
import PresenceIndicator from "@/components/portal/PresenceIndicator.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Users() {
  const nav = useNavigate();
  const { user: currentUser } = useAuth();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] =
    useState(false);

  const load = useCallback(
    async (query = "") => {
      setLoading(true);

      try {
        const data =
          await admin.users(query);

        setRows(data.users || []);
        setErr("");
      } catch (error) {
        setErr(
          error.message ||
            "Users could not be loaded.",
        );

        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  const visibleRows = useMemo(
    () => rows.map((row) => {
      if (
        String(row._id) !==
        String(currentUser?._id || currentUser?.id || "")
      ) {
        return row;
      }

      return {
        ...row,
        lastSeenAt:
          currentUser.lastSeenAt ||
          currentUser.lastActivityAt ||
          row.lastSeenAt,
        lastActivityAt:
          currentUser.lastActivityAt ||
          currentUser.lastSeenAt ||
          row.lastActivityAt,
        presenceState:
          "online",
        online: true,
        presence: {
          ...(row.presence || {}),
          ...(currentUser.presence || {}),
          state: "online",
          online: true,
        },
      };
    }),
    [currentUser, rows],
  );

  const grouped = useMemo(() => {
    const base = {
      admin: [],
      developer: [],
      client: [],
    };

    for (const user of visibleRows) {
      (
        base[user.role] ||
        base.client
      ).push(user);
    }

    return base;
  }, [visibleRows]);

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
            {items.length} user
            {items.length !== 1 ? "s" : ""}
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="w-34">Name</th>
              <th className="w-34">Email</th>
              <th className="w-24">
                Presence
              </th>
              <th className="w-20">
                Account
              </th>
              <th className="actions-head">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((user) => {
              const protectedAccount =
                Boolean(
                  user.isSuperAdmin ||
                    user.isProtected,
                );

              return (
                <tr
                  key={user._id}
                  className="table-row-hover"
                >
                  <td>
                    <div className="flex min-w-0 items-center gap-2">
                      <PresenceIndicator
                        user={user}
                        compact
                      />

                      <span className="font-medium truncate">
                        {user.name || "—"}
                      </span>

                      {protectedAccount && (
                        <span className="badge">
                          Super Admin
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="text-muted">
                    {user.email}
                  </td>

                  <td>
                    <PresenceIndicator
                      user={user}
                    />
                  </td>

                  <td className="capitalize">
                    <span className="badge">
                      {user.status ||
                        user.accountStatus ||
                        "pending"}
                    </span>
                  </td>

                  <td className="actions-cell">
                    <Link
                      to={`/admin/direct/${user._id}`}
                      state={{
                        peerEmail:
                          user.email,

                        peerName:
                          user.name,

                        peerLastSeenAt:
                          user.lastSeenAt,

                        peerPresence:
                          user.presence,
                      }}
                      className="icon-btn mr-1"
                      title={`Message ${
                        user.name ||
                        user.email
                      }`}
                      aria-label={`Message ${
                        user.name ||
                        user.email
                      }`}
                    >
                      <MessageSquare
                        size={16}
                        aria-hidden="true"
                      />
                    </Link>

                    <Link
                      to={`/admin/users/${user._id}`}
                      className="icon-btn mr-1"
                      title={`Open and edit ${
                        user.name ||
                        user.email
                      }`}
                      aria-label={`Open and edit ${
                        user.name ||
                        user.email
                      }`}
                    >
                      <Pencil
                        size={16}
                        aria-hidden="true"
                      />
                    </Link>

                    {user.status !==
                      "active" &&
                      !protectedAccount && (
                        <button
                          type="button"
                          className="icon-btn mr-1"
                          onClick={async () => {
                            await admin.approveUser(
                              user._id,
                            );

                            load(q);
                          }}
                          title={`Approve ${
                            user.name ||
                            user.email
                          }`}
                          aria-label={`Approve ${
                            user.name ||
                            user.email
                          }`}
                        >
                          <Check
                            size={16}
                            aria-hidden="true"
                          />
                        </button>
                      )}

                    {!protectedAccount && (
                      <button
                        type="button"
                        className="icon-btn text-rose-300"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              "Permanently delete this user?",
                            )
                          ) {
                            return;
                          }

                          await admin.deleteUser(
                            user._id,
                          );

                          load(q);
                        }}
                        title={`Delete ${
                          user.name ||
                          user.email
                        }`}
                        aria-label={`Delete ${
                          user.name ||
                          user.email
                        }`}
                      >
                        <Trash2
                          size={16}
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {!items.length && (
              <tr>
                <td
                  colSpan="5"
                  className="empty-cell"
                >
                  No users in this group.
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
          Users
        </h2>

        <div />
      </div>

      <form
        className="card card-pad filters-grid portal-search-row"
        onSubmit={(event) => {
          event.preventDefault();

          load(q);
        }}
      >
        <SearchField
          label="Search users by name or email"
          placeholder="Search by name or email"
          value={q}
          onValueChange={setQ}
        />

        <button
          type="submit"
          className="btn btn-outline"
          disabled={loading}
        >
          {loading
            ? "Searching…"
            : "Search"}
        </button>
      </form>

      {err && (
        <div className="text-error">
          {err}
        </div>
      )}

      <div className="stack">
        <Section
          title="Admins"
          items={grouped.admin}
        />

        <Section
          title="Developers"
          items={grouped.developer}
        />

        <Section
          title="Clients"
          items={grouped.client}
        />
      </div>

      <div className="toolbar-bottom">
        <button
          onClick={() =>
            nav("/admin/users/new")
          }
          className="btn btn-primary"
          title="Create a new user"
        >
          <Plus
            className="mr-2"
            size={16}
          />
          New user
        </button>
      </div>
    </div>
  );
}
