import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { users } from "@/lib/api.js";
import { useTheme } from "@/lib/theme.js";
import {
  LuBell,
  LuBriefcaseBusiness,
  LuCheck,
  LuGlobe,
  LuMail,
  LuPhone,
  LuShieldCheck,
  LuTrash2,
  LuUpload,
  LuUserRound,
} from "react-icons/lu";

const roleLabels = {
  admin: "Admin",
  developer: "Developer",
  client: "Client",
};

const defaultPrefs = {
  portalUpdates: true,
  emailUpdates: true,
  billingAlerts: true,
};

function initials(user) {
  const source = user?.name || user?.email || "MS";
  return source
    .split(/[ @._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MS";
}

function asTextList(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function fromTextList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeProfile(user = {}) {
  return {
    name: user.name || "",
    phone: user.phone || "",
    companyName: user.companyName || "",
    businessName: user.businessName || "",
    businessWebsite: user.businessWebsite || "",
    industry: user.industry || "",
    jobTitle: user.jobTitle || "",
    timezone: user.timezone || "America/Toronto",
    preferredContactMethod: user.preferredContactMethod || "email",
    bio: user.bio || "",
    specialties: asTextList(user.specialties),
    technologies: asTextList(user.technologies),
    availability: user.availability || "",
    projectContactPreference: user.projectContactPreference || "",
    notificationPreferences: {
      ...defaultPrefs,
      ...(user.notificationPreferences || {}),
    },
  };
}

function profilePayload(form) {
  return {
    ...form,
    specialties: fromTextList(form.specialties),
    technologies: fromTextList(form.technologies),
    notificationPreferences: {
      portalUpdates: !!form.notificationPreferences.portalUpdates,
      emailUpdates: !!form.notificationPreferences.emailUpdates,
      billingAlerts: !!form.notificationPreferences.billingAlerts,
    },
  };
}

function niceSize(n = 0) {
  if (!n) return "";
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProfilePage() {
  const { user, role, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [form, setForm] = useState(() => normalizeProfile(user || {}));
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || "");
  const [fileBlob, setFileBlob] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const pickRef = useRef(null);
  const revokeRef = useRef(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await users.me();
        if (!active) return;
        const fresh = data.user || user || {};
        updateUser(fresh);
        setForm(normalizeProfile(fresh));
        setPreviewUrl(fresh.avatarUrl || "");
        setFileBlob(null);
        setFileMeta(null);
      } catch {
        if (!active) return;
        setForm(normalizeProfile(user || {}));
        setPreviewUrl(user?.avatarUrl || "");
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const avatarText = useMemo(() => {
    if (fileMeta?.name) return [fileMeta.name, niceSize(fileMeta.size)].filter(Boolean).join(" - ");
    if (previewUrl || user?.avatarUrl) return "Current profile image";
    return "PNG or JPG up to 5 MB";
  }, [fileMeta, previewUrl, user?.avatarUrl]);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setPref(key, value) {
    setForm((current) => ({
      ...current,
      notificationPreferences: {
        ...current.notificationPreferences,
        [key]: value,
      },
    }));
  }

  function onPick(event) {
    const file = (event.target.files || [])[0];
    if (!file) return;
    if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
    const url = URL.createObjectURL(file);
    revokeRef.current = url;
    setFileBlob(file);
    setFileMeta({ name: file.name, size: file.size, type: file.type });
    setPreviewUrl(url);
  }

  function removeAvatar() {
    setFileBlob(null);
    setFileMeta(null);
    setPreviewUrl("");
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const profile = await users.updateMe(profilePayload(form));
      let nextUser = profile.user || user || {};

      if (fileBlob) {
        const avatar = await users.uploadMyAvatar(fileBlob);
        nextUser = { ...nextUser, avatarUrl: avatar.avatarUrl || "" };
      } else if (!previewUrl && user?.avatarUrl) {
        await users.deleteMyAvatar();
        nextUser = { ...nextUser, avatarUrl: "" };
      }

      updateUser(nextUser);
      setPreviewUrl(nextUser.avatarUrl || "");
      setFileBlob(null);
      setFileMeta(null);
      setMessage("Profile saved.");
    } catch (err) {
      setError(err?.message || "Profile could not be saved.");
    } finally {
      setBusy(false);
      if (pickRef.current) pickRef.current.value = "";
      if (revokeRef.current) {
        URL.revokeObjectURL(revokeRef.current);
        revokeRef.current = null;
      }
    }
  }

  return (
    <form onSubmit={save} className="page-shell portal-profile space-stack">
      <div className="portal-profile-hero">
        <div className="portal-profile-avatar">
          {previewUrl || user?.avatarUrl ? (
            <img src={previewUrl || user?.avatarUrl || ""} alt="" onError={removeAvatar} />
          ) : (
            initials(user)
          )}
        </div>

        <div className="portal-profile-copy">
          <div className="text-muted-xs">{roleLabels[role] || "Portal"} account</div>
          <h2 className="page-title">{user?.name || "Your profile"}</h2>
          <p className="text-muted">
            Keep the workspace identity, contact preferences, and avatar current for project communication.
          </p>
        </div>

        <div className="portal-profile-actions">
          <input ref={pickRef} type="file" accept="image/*" className="sr-only" onChange={onPick} />
          <button type="button" className="btn btn-outline btn-sm" onClick={() => pickRef.current?.click()}>
            <LuUpload className="mr-2 h-4 w-4" aria-hidden="true" />
            Upload
          </button>
          {(previewUrl || user?.avatarUrl) && (
            <button type="button" className="btn btn-outline btn-sm" onClick={removeAvatar}>
              <LuTrash2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="text-muted-xs">{avatarText}</div>

      {(message || error) && (
        <div>
          {message && <div className="text-success">{message}</div>}
          {error && <div className="text-error">{error}</div>}
        </div>
      )}

      <div className="portal-profile-grid">
        <section className="card-surface card-pad-lg space-stack">
          <div className="portal-card-heading">
            <LuUserRound className="h-5 w-5" aria-hidden="true" />
            Identity
          </div>

          <div className="form-grid-2">
            <label className="form-field">
              <div className="form-label">Full name</div>
              <input value={form.name} onChange={(event) => setField("name", event.target.value)} />
            </label>

            <label className="form-field">
              <div className="form-label">Email</div>
              <input value={user?.email || ""} disabled />
            </label>

            <label className="form-field">
              <div className="form-label">Role</div>
              <input value={roleLabels[role] || role || ""} disabled />
            </label>

            <label className="form-field">
              <div className="form-label">Account status</div>
              <input value={user?.status || "active"} disabled />
            </label>
          </div>
        </section>

        <section className="card-surface card-pad-lg space-stack">
          <div className="portal-card-heading">
            <LuMail className="h-5 w-5" aria-hidden="true" />
            Contact
          </div>

          <div className="form-grid-2">
            <label className="form-field">
              <div className="form-label">Phone</div>
              <input value={form.phone} onChange={(event) => setField("phone", event.target.value)} inputMode="tel" />
            </label>

            <label className="form-field">
              <div className="form-label">Preferred contact</div>
              <select value={form.preferredContactMethod} onChange={(event) => setField("preferredContactMethod", event.target.value)}>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="portal">Portal message</option>
              </select>
            </label>

            <label className="form-field">
              <div className="form-label">Timezone</div>
              <input value={form.timezone} onChange={(event) => setField("timezone", event.target.value)} />
            </label>

            <label className="form-field">
              <div className="form-label">Project contact note</div>
              <input value={form.projectContactPreference} onChange={(event) => setField("projectContactPreference", event.target.value)} />
            </label>
          </div>
        </section>

        <section className="card-surface card-pad-lg space-stack">
          <div className="portal-card-heading">
            <LuBriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
            Work Profile
          </div>

          <div className="form-grid-2">
            <label className="form-field">
              <div className="form-label">Company</div>
              <input value={form.companyName} onChange={(event) => setField("companyName", event.target.value)} />
            </label>

            <label className="form-field">
              <div className="form-label">Business name</div>
              <input value={form.businessName} onChange={(event) => setField("businessName", event.target.value)} />
            </label>

            <label className="form-field">
              <div className="form-label">Website</div>
              <input value={form.businessWebsite} onChange={(event) => setField("businessWebsite", event.target.value)} inputMode="url" />
            </label>

            <label className="form-field">
              <div className="form-label">Industry</div>
              <input value={form.industry} onChange={(event) => setField("industry", event.target.value)} />
            </label>

            <label className="form-field">
              <div className="form-label">Job title</div>
              <input value={form.jobTitle} onChange={(event) => setField("jobTitle", event.target.value)} />
            </label>

            <label className="form-field">
              <div className="form-label">Availability</div>
              <input value={form.availability} onChange={(event) => setField("availability", event.target.value)} />
            </label>

            <label className="form-field form-span-2">
              <div className="form-label">Bio</div>
              <textarea className="form-textarea-sm" value={form.bio} onChange={(event) => setField("bio", event.target.value)} />
            </label>

            <label className="form-field">
              <div className="form-label">Specialties</div>
              <input value={form.specialties} onChange={(event) => setField("specialties", event.target.value)} placeholder="Design, SEO, content" />
            </label>

            <label className="form-field">
              <div className="form-label">Technologies</div>
              <input value={form.technologies} onChange={(event) => setField("technologies", event.target.value)} placeholder="React, WordPress, Wix" />
            </label>
          </div>
        </section>

        <aside className="card-surface card-pad-lg space-stack">
          <div className="portal-card-heading">
            <LuShieldCheck className="h-5 w-5" aria-hidden="true" />
            Settings
          </div>

          <div className="portal-setting-row">
            <div>
              <div className="font-bold">Theme</div>
              <div className="row-sub">Applies across public pages and portals.</div>
            </div>
            <div className="portal-segmented" role="group" aria-label="Theme">
              <button type="button" className={theme === "light" ? "is-active" : ""} onClick={() => setTheme("light")}>
                Light
              </button>
              <button type="button" className={theme === "dark" ? "is-active" : ""} onClick={() => setTheme("dark")}>
                Dark
              </button>
            </div>
          </div>

          {[
            { key: "portalUpdates", label: "Portal updates", icon: <LuBell className="h-4 w-4" aria-hidden="true" /> },
            { key: "emailUpdates", label: "Email updates", icon: <LuMail className="h-4 w-4" aria-hidden="true" /> },
            { key: "billingAlerts", label: "Billing alerts", icon: <LuPhone className="h-4 w-4" aria-hidden="true" /> },
          ].map((item) => (
            <label key={item.key} className="portal-toggle-row">
              <span>
                {item.icon}
                {item.label}
              </span>
              <input
                type="checkbox"
                checked={!!form.notificationPreferences[item.key]}
                onChange={(event) => setPref(item.key, event.target.checked)}
              />
            </label>
          ))}

          <div className="portal-readonly-note">
            <LuGlobe className="h-4 w-4" aria-hidden="true" />
            Email, role, and account status are controlled by admin policy.
          </div>
        </aside>
      </div>

      <div className="portal-sticky-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          <LuCheck className="mr-2 h-4 w-4" aria-hidden="true" />
          {busy ? "Saving..." : "Save profile"}
        </button>
        <button type="button" className="btn btn-outline" onClick={logout}>
          Log out
        </button>
        <span className="text-muted-xs">
          Last updated {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "after save"}
        </span>
      </div>
    </form>
  );
}
