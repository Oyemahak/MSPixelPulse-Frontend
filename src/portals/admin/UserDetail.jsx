import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { admin, portalErrorMessage } from "@/lib/api.js";

export default function UserDetail() {
  const nav = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [identity, setIdentity] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await admin.user(userId);
      const next = data.user || data;
      setUser(next);
      setIdentity({ name: next.name || "", email: next.email || "" });
      setErr("");
    } catch (error) {
      setErr(portalErrorMessage(error, "user"));
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  function flash(message) {
    setOk(message);
    window.setTimeout(() => setOk(""), 2200);
  }

  async function patchUser(next, message = "User saved.") {
    setBusy(true);
    setErr("");
    try {
      const data = await admin.updateUser(userId, next);
      setUser((current) => ({ ...current, ...(data.user || data) }));
      flash(message);
    } catch (error) {
      setErr(portalErrorMessage(error, "user"));
    } finally {
      setBusy(false);
    }
  }

  async function saveIdentity(event) {
    event.preventDefault();
    await patchUser(identity, "Name and email saved.");
  }

  async function changePassword() {
    setErr("");
    if (password.length < 8 || password.length > 72) {
      setErr("Password must be 8-72 characters.");
      return;
    }
    setBusy(true);
    try {
      const result = await admin.setUserPassword(userId, password);
      setUser((current) => ({ ...current, passwordChangedAt: result.passwordChangedAt }));
      flash("Permanent password changed. Existing sessions were signed out.");
    } catch (error) {
      setErr(portalErrorMessage(error, "user"));
    } finally {
      setBusy(false);
    }
  }

  async function copyPassword() {
    if (!password) {
      setErr("Enter or generate a password before copying it.");
      return;
    }
    try {
      await navigator.clipboard.writeText(password);
      flash("Password copied.");
    } catch {
      setErr("Password could not be copied. Select the field and copy it manually.");
    }
  }

  async function remove() {
    const label = user.name || user.email;
    if (!window.confirm(`Permanently delete ${label}? Related records will be safely detached or anonymized. This cannot be undone.`)) return;
    setBusy(true);
    setErr("");
    try {
      await admin.deleteUser(userId);
      nav("/admin/users", { replace: true });
    } catch (error) {
      setErr(portalErrorMessage(error, "user"));
      setBusy(false);
    }
  }

  if (!user) {
    return <div className="page-shell">{err ? <div className="text-error">{err}</div> : "Loading…"}</div>;
  }

  const protectedAccount = user.isSuperAdmin || user.isProtected;
  const applicationStatus = user.accessApplication?.status || "not submitted";

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <div>
          <h2 className="page-title">User Detail</h2>
          <div className="text-muted-xs">Manage identity, access, assignments, and credentials.</div>
        </div>
        <Link to="/admin/users" className="btn btn-outline btn-sm">Back to users</Link>
      </div>

      {(ok || err) && (
        <div aria-live="polite">
          {ok ? <div className="text-success">{ok}</div> : null}
          {err ? <div className="text-error">{err}</div> : null}
        </div>
      )}

      <div className="grid-2">
        <form className="card card-pad-lg form-stack" onSubmit={saveIdentity}>
          <div>
            <div className="text-muted">Identity</div>
            <h3 className="card-title">Account details</h3>
          </div>

          <label className="form-field">
            <div className="form-label">Name</div>
            <input
              className="form-input"
              value={identity.name}
              onChange={(event) => setIdentity((current) => ({ ...current, name: event.target.value }))}
              disabled={busy}
            />
          </label>

          <label className="form-field">
            <div className="form-label">Email</div>
            <input
              className="form-input"
              type="email"
              value={identity.email}
              onChange={(event) => setIdentity((current) => ({ ...current, email: event.target.value }))}
              disabled={busy || protectedAccount}
            />
          </label>

          <div className="form-grid-2">
            <label className="form-field">
              <div className="form-label">Role</div>
              <select
                className="form-input bg-transparent"
                value={user.role}
                onChange={(event) => patchUser({ role: event.target.value }, "Role changed.")}
                disabled={busy || protectedAccount}
              >
                <option value="client">Client</option>
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="form-field">
              <div className="form-label">Status</div>
              <select
                className="form-input bg-transparent"
                value={user.status}
                onChange={(event) => patchUser({ status: event.target.value }, "Account status changed.")}
                disabled={busy || protectedAccount}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={busy}>Save identity</button>
            {user.status === "active" ? (
              <button type="button" className="btn btn-outline" onClick={() => patchUser({ status: "suspended" }, "Account suspended.")} disabled={busy || protectedAccount}>
                Suspend
              </button>
            ) : (
              <button type="button" className="btn btn-outline" onClick={() => patchUser({ status: "active" }, "Account activated.")} disabled={busy || protectedAccount}>
                {user.status === "suspended" ? "Reactivate" : "Activate"}
              </button>
            )}
          </div>
        </form>

        <section className="card card-pad-lg form-stack">
          <div>
            <div className="text-muted">Password</div>
            <h3 className="card-title">Set permanent password</h3>
          </div>
          <p className="text-muted-xs">
            Existing passwords are securely hashed and cannot be displayed. Enter a new permanent password here; it works immediately and replaces the old password.
          </p>
          <label className="form-field">
            <div className="form-label">New password</div>
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              disabled={busy || (protectedAccount && !user.isSuperAdmin)}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />
            Show entered password
          </label>
          <div className="form-actions">
            <button type="button" className="btn btn-primary" onClick={changePassword} disabled={busy || !password}>
              Change password
            </button>
            <button type="button" className="btn btn-outline" onClick={copyPassword} disabled={!password}>
              Copy password
            </button>
          </div>
          <div className="text-muted-xs">
            Last changed: {user.passwordChangedAt ? new Date(user.passwordChangedAt).toLocaleString() : "date unavailable"}
          </div>
        </section>

        <section className="card card-pad-lg form-stack">
          <div>
            <div className="text-muted">Access application</div>
            <h3 className="card-title">Applicant status</h3>
          </div>
          <div className="form-grid-2">
            <div><div className="form-label">Application</div><div className="font-medium capitalize">{applicationStatus}</div></div>
            <div><div className="form-label">Account</div><div className="font-medium capitalize">{user.accountStatus || user.status}</div></div>
            <div><div className="form-label">Business</div><div className="font-medium">{user.businessName || "Not provided"}</div></div>
            <div><div className="form-label">Industry</div><div className="font-medium">{user.industry || "Not provided"}</div></div>
            <div><div className="form-label">Phone</div><div className="font-medium">{user.phone || "Not provided"}</div></div>
            <div><div className="form-label">Submitted</div><div className="font-medium">{user.accessApplication?.submittedAt ? new Date(user.accessApplication.submittedAt).toLocaleString() : "Not available"}</div></div>
          </div>
          <div>
            <div className="form-label">Project request</div>
            <p className="text-muted whitespace-pre-wrap">{user.projectContactPreference || "Not provided"}</p>
          </div>
        </section>

        <section className="card card-pad-lg form-stack">
          <div>
            <div className="text-muted">Projects</div>
            <h3 className="card-title">Assigned projects</h3>
          </div>
          {(user.assignedProjects || []).map((project) => (
            <Link key={project._id} to={`/admin/projects/${project._id}`} className="card-surface card-pad between">
              <span>
                <span className="font-medium">{project.title}</span>
                <span className="row-sub capitalize">{project.status}</span>
              </span>
              <span className="subtle-link">Open</span>
            </Link>
          ))}
          {!user.assignedProjects?.length ? <div className="text-muted-xs">No assigned projects.</div> : null}
        </section>

        <section className="card card-pad-lg form-stack">
          <div className="text-muted">Record</div>
          <div className="meta">
            <div>ID: <code>{user._id}</code></div>
            <div>Created: <code>{new Date(user.createdAt).toLocaleString()}</code></div>
            <div>Updated: <code>{new Date(user.updatedAt).toLocaleString()}</code></div>
          </div>
          <button
            type="button"
            onClick={remove}
            disabled={busy || protectedAccount}
            className="btn btn-outline disabled:opacity-50"
            title={protectedAccount ? "Protected super admin cannot be deleted" : "Permanently delete this account"}
          >
            Permanently delete user
          </button>
        </section>
      </div>
    </div>
  );
}
