// src/portals/admin/UserDetail.jsx

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  admin,
  portalErrorMessage,
} from "@/lib/api.js";

import { useAuth } from "@/context/AuthContext.jsx";
import PresenceIndicator from "@/components/portal/PresenceIndicator.jsx";
import { formatLocalDateTime } from "@/lib/messageTime.js";

export default function UserDetail() {
  const { user: currentUser } =
    useAuth();

  const nav =
    useNavigate();

  const { userId } =
    useParams();

  const [user, setUser] =
    useState(null);

  const [
    identity,
    setIdentity,
  ] = useState({
    name: "",
    email: "",
  });

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [busy, setBusy] =
    useState(false);

  const [err, setErr] =
    useState("");

  const [ok, setOk] =
    useState("");

  const load =
    useCallback(async () => {
      try {
        const data =
          await admin.user(
            userId,
          );

        const next =
          data.user ||
          data;

        setUser(next);

        setIdentity({
          name:
            next.name ||
            "",

          email:
            next.email ||
            "",
        });

        setErr("");
      } catch (error) {
        setErr(
          portalErrorMessage(
            error,
            "user",
          ),
        );
      }
    }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  function flash(
    message,
  ) {
    setOk(message);

    window.setTimeout(
      () =>
        setOk(""),
      2200,
    );
  }

  async function patchUser(
    next,
    message = "User saved.",
  ) {
    setBusy(true);
    setErr("");

    try {
      const data =
        await admin.updateUser(
          userId,
          next,
        );

      setUser(
        (current) => ({
          ...current,
          ...(
            data.user ||
            data
          ),
        }),
      );

      flash(message);
    } catch (error) {
      setErr(
        portalErrorMessage(
          error,
          "user",
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveIdentity(
    event,
  ) {
    event.preventDefault();

    const payload =
      user?.isSuperAdmin ||
      user?.isProtected
        ? {
            name:
              identity.name,
          }
        : identity;

    await patchUser(
      payload,
      "Identity saved.",
    );
  }

  async function changePassword() {
    setErr("");

    if (
      password.length < 8 ||
      password.length > 72
    ) {
      setErr(
        "Password must be 8-72 characters.",
      );

      return;
    }

    setBusy(true);

    try {
      const result =
        await admin.setUserPassword(
          userId,
          password,
        );

      setUser(
        (current) => ({
          ...current,

          passwordChangedAt:
            result.passwordChangedAt,
        }),
      );

      setPassword("");

      flash(
        "Permanent password changed. Existing sessions were signed out.",
      );
    } catch (error) {
      setErr(
        portalErrorMessage(
          error,
          "user",
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyPassword() {
    if (!password) {
      setErr(
        "Enter a password before copying it.",
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(
        password,
      );

      flash(
        "Password copied.",
      );
    } catch {
      setErr(
        "Password could not be copied. Select the field and copy it manually.",
      );
    }
  }

  async function remove() {
    const label =
      user.name ||
      user.email;

    if (
      !window.confirm(
        `Permanently delete ${label}? Related records will be safely detached or anonymized. This cannot be undone.`,
      )
    ) {
      return;
    }

    setBusy(true);
    setErr("");

    try {
      await admin.deleteUser(
        userId,
      );

      nav(
        "/admin/users",
        {
          replace:
            true,
        },
      );
    } catch (error) {
      setErr(
        portalErrorMessage(
          error,
          "user",
        ),
      );

      setBusy(false);
    }
  }

  if (!user) {
    return (
      <div className="page-shell">
        {err ? (
          <div className="text-error">
            {err}
          </div>
        ) : (
          "Loading…"
        )}
      </div>
    );
  }

  const protectedAccount =
    Boolean(
      user.isSuperAdmin ||
        user.isProtected,
    );

  const viewingOwnAccount =
    String(
      currentUser?._id,
    ) ===
    String(
      user._id,
    );

  const canResetPassword =
    !protectedAccount ||
    viewingOwnAccount;

  const applicationStatus =
    user.accessApplication
      ?.status ||
    "not submitted";

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="page-title">
              User Detail
            </h2>

            {protectedAccount && (
              <span className="badge">
                Protected Super Admin
              </span>
            )}
          </div>

          <div className="mt-1">
            <PresenceIndicator
              user={user}
            />
          </div>

          <div className="text-muted-xs mt-1">
            Manage identity, access, assignments, and credentials.
          </div>
        </div>

        <Link
          to="/admin/users"
          className="btn btn-outline btn-sm"
        >
          Back to users
        </Link>
      </div>

      {(ok || err) && (
        <div aria-live="polite">
          {ok && (
            <div className="text-success">
              {ok}
            </div>
          )}

          {err && (
            <div className="text-error">
              {err}
            </div>
          )}
        </div>
      )}

      <div className="grid-2">
        <form
          className="card card-pad-lg form-stack"
          onSubmit={
            saveIdentity
          }
        >
          <div>
            <div className="text-muted">
              Identity
            </div>

            <h3 className="card-title">
              Account details
            </h3>
          </div>

          <label className="form-field">
            <div className="form-label">
              Name
            </div>

            <input
              className="form-input"
              value={
                identity.name
              }
              onChange={(
                event,
              ) =>
                setIdentity(
                  (current) => ({
                    ...current,

                    name:
                      event.target
                        .value,
                  }),
                )
              }
              disabled={busy}
            />
          </label>

          <label className="form-field">
            <div className="form-label">
              Email
            </div>

            <input
              className="form-input"
              type="email"
              value={
                identity.email
              }
              onChange={(
                event,
              ) =>
                setIdentity(
                  (current) => ({
                    ...current,

                    email:
                      event.target
                        .value,
                  }),
                )
              }
              disabled={
                busy ||
                protectedAccount
              }
            />
          </label>

          <div className="form-grid-2">
            <label className="form-field">
              <div className="form-label">
                Role
              </div>

              <select
                className="form-input bg-transparent"
                value={
                  user.role
                }
                onChange={(
                  event,
                ) =>
                  patchUser(
                    {
                      role:
                        event.target
                          .value,
                    },
                    "Role changed.",
                  )
                }
                disabled={
                  busy ||
                  protectedAccount
                }
              >
                <option value="client">
                  Client
                </option>

                <option value="developer">
                  Developer
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </label>

            <label className="form-field">
              <div className="form-label">
                Status
              </div>

              <select
                className="form-input bg-transparent"
                value={
                  user.status
                }
                onChange={(
                  event,
                ) =>
                  patchUser(
                    {
                      status:
                        event.target
                          .value,
                    },
                    "Account status changed.",
                  )
                }
                disabled={
                  busy ||
                  protectedAccount
                }
              >
                <option value="active">
                  Active
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="suspended">
                  Suspended
                </option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={busy}
            >
              Save identity
            </button>

            {!protectedAccount &&
              (
                user.status ===
                "active" ? (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() =>
                      patchUser(
                        {
                          status:
                            "suspended",
                        },
                        "Account suspended.",
                      )
                    }
                    disabled={busy}
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() =>
                      patchUser(
                        {
                          status:
                            "active",
                        },
                        "Account activated.",
                      )
                    }
                    disabled={busy}
                  >
                    {user.status ===
                    "suspended"
                      ? "Reactivate"
                      : "Activate"}
                  </button>
                )
              )}
          </div>
        </form>

        <section className="card card-pad-lg form-stack">
          <div>
            <div className="text-muted">
              Password
            </div>

            <h3 className="card-title">
              Set permanent password
            </h3>
          </div>

          {protectedAccount &&
          !viewingOwnAccount ? (
            <div className="text-muted-xs">
              This protected Super Admin's credentials cannot be reset by another administrator.
            </div>
          ) : (
            <>
              <p
                id="admin-password-help"
                className="text-muted-xs"
              >
                Create an 8–72 character password. It replaces the current password immediately and signs out existing sessions.
              </p>

              <div className="admin-password-row">
                <label className="form-field min-w-0">
                  <div className="form-label">
                    New password
                  </div>

                  <input
                    id="admin-user-password"
                    className="form-input"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      password
                    }
                    onChange={(
                      event,
                    ) =>
                      setPassword(
                        event.target
                          .value,
                      )
                    }
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    aria-describedby="admin-password-help"
                    disabled={
                      busy ||
                      !canResetPassword
                    }
                  />
                </label>

                <label className="password-visibility-control">
                  <input
                    className="password-visibility-checkbox"
                    type="checkbox"
                    checked={
                      showPassword
                    }
                    onChange={(
                      event,
                    ) =>
                      setShowPassword(
                        event.target
                          .checked,
                      )
                    }
                    disabled={
                      busy ||
                      !canResetPassword
                    }
                  />

                  <span>Show password</span>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    changePassword
                  }
                  disabled={
                    busy ||
                    !password ||
                    !canResetPassword
                  }
                >
                  Set new password
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={
                    copyPassword
                  }
                  disabled={
                    !password
                  }
                >
                  Copy password
                </button>
              </div>
            </>
          )}

          <div className="text-muted-xs">
            Last changed:{" "}
            {formatLocalDateTime(
              user.passwordChangedAt,
              "date unavailable",
            )}
          </div>
        </section>

        <section className="card card-pad-lg form-stack">
          <div>
            <div className="text-muted">
              Access application
            </div>

            <h3 className="card-title">
              Applicant status
            </h3>
          </div>

          <div className="form-grid-2">
            <div>
              <div className="form-label">
                Application
              </div>

              <div className="font-medium capitalize">
                {
                  applicationStatus
                }
              </div>
            </div>

            <div>
              <div className="form-label">
                Account
              </div>

              <div className="font-medium capitalize">
                {user.accountStatus ||
                  user.status}
              </div>
            </div>

            <div>
              <div className="form-label">
                Business
              </div>

              <div className="font-medium">
                {user.businessName ||
                  "Not provided"}
              </div>
            </div>

            <div>
              <div className="form-label">
                Industry
              </div>

              <div className="font-medium">
                {user.industry ||
                  "Not provided"}
              </div>
            </div>

            <div>
              <div className="form-label">
                Phone
              </div>

              <div className="font-medium">
                {user.phone ||
                  "Not provided"}
              </div>
            </div>

            <div>
              <div className="form-label">
                Submitted
              </div>

              <div className="font-medium">
                {formatLocalDateTime(
                  user
                    .accessApplication
                    ?.submittedAt,
                  "Not available",
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="form-label">
              Project request
            </div>

            <p className="text-muted whitespace-pre-wrap">
              {user.projectContactPreference ||
                "Not provided"}
            </p>
          </div>
        </section>

        <section className="card card-pad-lg form-stack">
          <div>
            <div className="text-muted">
              Projects
            </div>

            <h3 className="card-title">
              Assigned projects
            </h3>
          </div>

          {(user.assignedProjects ||
            []).map(
            (project) => (
              <Link
                key={
                  project._id
                }
                to={`/admin/projects/${project._id}`}
                className="card-surface card-pad between"
              >
                <span>
                  <span className="font-medium">
                    {
                      project.title
                    }
                  </span>

                  <span className="row-sub capitalize">
                    {
                      project.status
                    }
                  </span>
                </span>

                <span className="subtle-link">
                  Open
                </span>
              </Link>
            ),
          )}

          {!user
            .assignedProjects
            ?.length && (
            <div className="text-muted-xs">
              No assigned projects.
            </div>
          )}
        </section>

        <section className="card card-pad-lg form-stack">
          <div className="text-muted">
            Record
          </div>

          <div className="meta">
            <div>
              ID:{" "}
              <code>
                {user._id}
              </code>
            </div>

            <div>
              Created:{" "}
              <code>
                {formatLocalDateTime(
                  user.createdAt,
                  "Unavailable",
                )}
              </code>
            </div>

            <div>
              Updated:{" "}
              <code>
                {formatLocalDateTime(
                  user.updatedAt,
                  "Unavailable",
                )}
              </code>
            </div>
          </div>

          {!protectedAccount && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="btn btn-outline disabled:opacity-50"
              title="Permanently delete this account"
            >
              Permanently delete user
            </button>
          )}

          {protectedAccount && (
            <div className="text-muted-xs">
              This primary Super Admin account is permanently protected from deletion, suspension, demotion, and identity takeover.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
