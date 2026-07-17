import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { admin, projects as api } from "@/lib/api.js";
import SearchField from "@/components/ui/SearchField.jsx";
import {
  LuArchive,
  LuBadgeCheck,
  LuExternalLink,
  LuEye,
  LuGrid2X2,
  LuImage,
  LuLayoutList,
  LuLoaderCircle,
  LuMessageSquare,
  LuPenLine,
  LuPlus,
  LuRefreshCw,
  LuSlidersHorizontal,
  LuSparkles,
  LuStar,
  LuX,
} from "react-icons/lu";

const emptyFilters = {
  q: "",
  status: "",
  classification: "",
  industry: "",
  websiteType: "",
  platform: "",
  published: "",
  featured: "",
  sort: "display",
};

const statusOptions = [
  ["", "All status"],
  ["draft", "Draft"],
  ["active", "Active"],
  ["completed", "Completed"],
  ["archived", "Archived"],
];

const classificationOptions = [
  ["", "All work types"],
  ["live", "Live website work"],
  ["demo", "Industry concept"],
  ["concept", "Concept project"],
];

const sortOptions = [
  ["display", "Featured order"],
  ["newest", "Recently updated"],
  ["oldest", "Oldest created"],
  ["title", "Project name"],
  ["completed", "Completion date"],
];

function uniq(rows, key) {
  return Array.from(new Set(rows.map((item) => item?.[key]).filter(Boolean))).sort((a, b) =>
    String(a).localeCompare(String(b))
  );
}

function labelFor(value, options) {
  return options.find(([key]) => key === value)?.[1] || value || "None";
}

function classificationLabel(value) {
  if (value === "live") return "Live website work";
  if (value === "demo") return "Industry concept";
  if (value === "concept") return "Concept project";
  return "Unclassified";
}

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function listText(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function projectImage(project) {
  return project.thumbnail || project.mockupImages?.[0]?.url || "/projects/project-fallback.svg";
}

function fallbackImage(event) {
  event.currentTarget.src = "/projects/project-fallback.svg";
}

function emptyForm() {
  return {
    _id: "",
    title: "",
    summary: "",
    shortDescription: "",
    status: "draft",
    projectClassification: "demo",
    industry: "",
    websiteType: "",
    platform: "",
    technologies: "",
    liveUrl: "",
    repositoryUrl: "",
    thumbnail: "",
    clientName: "",
    client: "",
    developer: "",
    published: false,
    featured: false,
    displayOrder: 999,
  };
}

function formFromProject(project = {}) {
  return {
    ...emptyForm(),
    _id: project._id || "",
    title: project.title || "",
    summary: project.summary || "",
    shortDescription: project.shortDescription || "",
    status: project.status || "draft",
    projectClassification: project.projectClassification || "demo",
    industry: project.industry || "",
    websiteType: project.websiteType || "",
    platform: project.platform || "",
    technologies: listText(project.technologies),
    liveUrl: project.liveUrl || "",
    repositoryUrl: project.repositoryUrl || "",
    thumbnail: project.thumbnail || "",
    clientName: project.clientName || "",
    client: project.client?._id || project.client || "",
    developer: project.developer?._id || project.developer || "",
    published: !!project.published,
    featured: !!project.featured,
    displayOrder: project.displayOrder ?? 999,
  };
}

function payloadFromForm(form) {
  return {
    title: form.title.trim(),
    summary: form.summary.trim(),
    shortDescription: form.shortDescription.trim(),
    status: form.status,
    projectClassification: form.projectClassification,
    industry: form.industry.trim(),
    websiteType: form.websiteType.trim(),
    platform: form.platform.trim(),
    technologies: parseList(form.technologies),
    liveUrl: form.liveUrl.trim(),
    repositoryUrl: form.repositoryUrl.trim(),
    thumbnail: form.thumbnail.trim(),
    clientName: form.clientName.trim(),
    client: form.client || null,
    developer: form.developer || null,
    published: !!form.published,
    featured: !!form.featured,
    displayOrder: Number(form.displayOrder) || 999,
  };
}

function Stat({ label, value, tone }) {
  return (
    <div className={`admin-project-stat ${tone || ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProjectEditor({ form, setForm, users, onClose, onSave, saving }) {
  const clients = useMemo(() => users.filter((user) => user.role === "client"), [users]);
  const developers = useMemo(() => users.filter((user) => user.role === "developer"), [users]);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <form className="admin-project-editor" onSubmit={onSave}>
      <div className="admin-project-editor-head">
        <div>
          <div className="text-muted-xs">{form._id ? "Edit project" : "Create project"}</div>
          <h3>{form._id ? form.title || "Project details" : "New portfolio project"}</h3>
        </div>
        <button type="button" className="portal-icon-button" onClick={onClose} aria-label="Close editor">
          <LuX className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="form-grid-2">
        <label className="form-field form-span-2">
          <div className="form-label">Project title</div>
          <input value={form.title} onChange={(event) => set("title", event.target.value)} required />
        </label>

        <label className="form-field form-span-2">
          <div className="form-label">Short card description</div>
          <textarea className="form-textarea-sm" value={form.shortDescription} onChange={(event) => set("shortDescription", event.target.value)} />
        </label>

        <label className="form-field form-span-2">
          <div className="form-label">Internal summary</div>
          <textarea className="form-textarea-sm" value={form.summary} onChange={(event) => set("summary", event.target.value)} />
        </label>

        <label className="form-field">
          <div className="form-label">Status</div>
          <select value={form.status} onChange={(event) => set("status", event.target.value)}>
            {statusOptions.filter(([value]) => value).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <div className="form-label">Work type</div>
          <select value={form.projectClassification} onChange={(event) => set("projectClassification", event.target.value)}>
            {classificationOptions.filter(([value]) => value).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <div className="form-label">Industry</div>
          <input value={form.industry} onChange={(event) => set("industry", event.target.value)} />
        </label>

        <label className="form-field">
          <div className="form-label">Website type</div>
          <input value={form.websiteType} onChange={(event) => set("websiteType", event.target.value)} />
        </label>

        <label className="form-field">
          <div className="form-label">Platform</div>
          <input value={form.platform} onChange={(event) => set("platform", event.target.value)} />
        </label>

        <label className="form-field">
          <div className="form-label">Technologies</div>
          <input value={form.technologies} onChange={(event) => set("technologies", event.target.value)} placeholder="React, Vite, SEO" />
        </label>

        <label className="form-field">
          <div className="form-label">Live URL</div>
          <input value={form.liveUrl} onChange={(event) => set("liveUrl", event.target.value)} inputMode="url" />
        </label>

        <label className="form-field">
          <div className="form-label">Repository URL</div>
          <input value={form.repositoryUrl} onChange={(event) => set("repositoryUrl", event.target.value)} inputMode="url" />
        </label>

        <label className="form-field form-span-2">
          <div className="form-label">Cover mockup URL</div>
          <input value={form.thumbnail} onChange={(event) => set("thumbnail", event.target.value)} placeholder="https://mspixelpulse.vercel.app/projects/mockups/..." />
        </label>

        <label className="form-field">
          <div className="form-label">Client display name</div>
          <input value={form.clientName} onChange={(event) => set("clientName", event.target.value)} />
        </label>

        <label className="form-field">
          <div className="form-label">Display order</div>
          <input type="number" value={form.displayOrder} onChange={(event) => set("displayOrder", event.target.value)} />
        </label>

        <label className="form-field">
          <div className="form-label">Client account</div>
          <select value={form.client} onChange={(event) => set("client", event.target.value)}>
            <option value="">Unassigned</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>{client.name || client.email} - {client.email}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <div className="form-label">Developer account</div>
          <select value={form.developer} onChange={(event) => set("developer", event.target.value)}>
            <option value="">Unassigned</option>
            {developers.map((developer) => (
              <option key={developer._id} value={developer._id}>{developer.name || developer.email} - {developer.email}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="admin-project-switches">
        <label>
          <input type="checkbox" checked={form.published} onChange={(event) => set("published", event.target.checked)} />
          Published on portfolio
        </label>
        <label>
          <input type="checkbox" checked={form.featured} onChange={(event) => set("featured", event.target.checked)} />
          Featured
        </label>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : form._id ? "Save changes" : "Create project"}
        </button>
        <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
      </div>
    </form>
  );
}

function ProjectCard({ project, busyId, onEdit, onPublish, onFeature, onArchive }) {
  return (
    <article className="admin-project-card">
      <Link to={`/admin/projects/${project._id}`} className="admin-project-cover" aria-label={`Open ${project.title}`}>
        <img src={projectImage(project)} alt={project.imageAltText || `${project.title} website cover`} onError={fallbackImage} />
        <span className="admin-project-cover-badge">{classificationLabel(project.projectClassification)}</span>
      </Link>

      <div className="admin-project-card-body">
        <div className="admin-project-card-top">
          <div>
            <Link to={`/admin/projects/${project._id}`} className="admin-project-title">{project.title}</Link>
            <p>{project.shortDescription || project.summary || "No project summary yet."}</p>
          </div>
          <span className={`admin-status-pill status-${project.status || "draft"}`}>{project.status || "draft"}</span>
        </div>

        <div className="admin-project-meta">
          <span>{project.industry || "No industry"}</span>
          <span>{project.websiteType || "No website type"}</span>
          <span>{project.platform || "No platform"}</span>
        </div>

        <div className="admin-project-flags">
          {project.published ? <span><LuBadgeCheck /> Published</span> : <span>Private</span>}
          {project.featured && <span><LuStar /> Featured</span>}
          {project.client?.name && <span>{project.client.name}</span>}
          {project.developer?.name && <span>{project.developer.name}</span>}
        </div>

        <div className="admin-project-actions" role="group" aria-label={`${project.title} actions`}>
          <Link
            className="portal-icon-button"
            title={`View ${project.title} details`}
            aria-label={`View ${project.title} details`}
            to={`/admin/projects/${project._id}`}
          >
            <LuEye className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            className="portal-icon-button"
            title={`Open ${project.title} project room`}
            aria-label={`Open ${project.title} project room`}
            to={`/admin/discussions/${project._id}`}
          >
            <LuMessageSquare className="h-4 w-4" aria-hidden="true" />
          </Link>
          {project.liveUrl && (
            <a
              className="portal-icon-button"
              title={`Open ${project.title} live website`}
              aria-label={`Open ${project.title} live website in a new tab`}
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              <LuExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          <button
            type="button"
            className="portal-icon-button"
            title={`Edit ${project.title}`}
            aria-label={`Edit ${project.title}`}
            onClick={() => onEdit(project)}
          >
            <LuPenLine className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="portal-icon-button"
            title={project.published ? "Unpublish from portfolio" : "Publish to portfolio"}
            aria-label={`${project.published ? "Unpublish" : "Publish"} ${project.title} ${project.published ? "from" : "to"} the portfolio`}
            aria-pressed={Boolean(project.published)}
            disabled={busyId === project._id}
            onClick={() => onPublish(project)}
          >
            <LuBadgeCheck className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="portal-icon-button"
            title={project.featured ? "Remove featured flag" : "Feature project"}
            aria-label={`${project.featured ? "Remove" : "Add"} ${project.title} ${project.featured ? "from" : "to"} featured projects`}
            aria-pressed={Boolean(project.featured)}
            disabled={busyId === project._id}
            onClick={() => onFeature(project)}
          >
            <LuStar className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="portal-icon-button danger"
            title="Archive project"
            aria-label={`Archive ${project.title}`}
            disabled={busyId === project._id || project.status === "archived"}
            onClick={() => onArchive(project)}
          >
            <LuArchive className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

function ProjectTable({ rows, busyId, onEdit, onPublish, onFeature, onArchive }) {
  return (
    <div className="admin-project-table-wrap">
      <table className="table admin-project-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Type</th>
            <th>Status</th>
            <th>Assigned</th>
            <th>Portfolio</th>
            <th className="actions-head">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((project) => (
            <tr key={project._id} className="table-row-hover">
              <td>
                <div className="admin-table-project">
                  <img src={projectImage(project)} alt="" onError={fallbackImage} />
                  <div>
                    <Link to={`/admin/projects/${project._id}`} className="row-link">{project.title}</Link>
                    <div className="row-sub">{project.shortDescription || project.summary || project.slug}</div>
                  </div>
                </div>
              </td>
              <td>
                <div>{classificationLabel(project.projectClassification)}</div>
                <div className="row-sub">{project.industry || "No industry"}</div>
              </td>
              <td><span className={`admin-status-pill status-${project.status || "draft"}`}>{project.status || "draft"}</span></td>
              <td>
                <div className="row-sub">Client: {project.client?.name || project.clientName || "Unassigned"}</div>
                <div className="row-sub">Dev: {project.developer?.name || "Unassigned"}</div>
              </td>
              <td>
                <div className="admin-project-flags compact">
                  {project.published ? <span><LuBadgeCheck /> Published</span> : <span>Private</span>}
                  {project.featured && <span><LuStar /> Featured</span>}
                </div>
              </td>
              <td className="actions-cell" aria-label={`${project.title} actions`}>
                <Link className="icon-btn" title={`View ${project.title} details`} aria-label={`View ${project.title} details`} to={`/admin/projects/${project._id}`}><LuEye aria-hidden="true" /></Link>
                <button type="button" className="icon-btn" title={`Edit ${project.title}`} aria-label={`Edit ${project.title}`} onClick={() => onEdit(project)}><LuPenLine aria-hidden="true" /></button>
                <button type="button" className="icon-btn" title={project.published ? "Unpublish from portfolio" : "Publish to portfolio"} aria-label={`${project.published ? "Unpublish" : "Publish"} ${project.title}`} aria-pressed={Boolean(project.published)} disabled={busyId === project._id} onClick={() => onPublish(project)}><LuBadgeCheck aria-hidden="true" /></button>
                <button type="button" className="icon-btn" title={project.featured ? "Remove from featured projects" : "Add to featured projects"} aria-label={`${project.featured ? "Remove" : "Add"} ${project.title} ${project.featured ? "from" : "to"} featured projects`} aria-pressed={Boolean(project.featured)} disabled={busyId === project._id} onClick={() => onFeature(project)}><LuStar aria-hidden="true" /></button>
                <button type="button" className="icon-btn text-rose-300" title={`Archive ${project.title}`} aria-label={`Archive ${project.title}`} disabled={busyId === project._id || project.status === "archived"} onClick={() => onArchive(project)}><LuArchive aria-hidden="true" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Projects() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [view, setView] = useState(() => localStorage.getItem("admin-project-view") || "grid");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busyId, setBusyId] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorForm, setEditorForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const query = useMemo(() => ({
    q: filters.q,
    status: filters.status,
    classification: filters.classification,
    industry: filters.industry,
    websiteType: filters.websiteType,
    platform: filters.platform,
    published: filters.published,
    featured: filters.featured,
    sort: filters.sort,
  }), [filters]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters((current) => (
        current.q === searchTerm ? current : { ...current, q: searchTerm }
      ));
    }, 320);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  async function load(nextQuery = query) {
    setLoading(true);
    setErr("");
    try {
      const [projectData, userData] = await Promise.all([api.list(nextQuery), admin.users()]);
      setRows(projectData.projects || []);
      setUsers(userData.users || []);
    } catch (error) {
      setErr(error?.message || "Projects could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    localStorage.setItem("admin-project-view", view);
  }, [view]);

  const stats = useMemo(() => ({
    total: rows.length,
    published: rows.filter((project) => project.published).length,
    featured: rows.filter((project) => project.featured).length,
    archived: rows.filter((project) => project.status === "archived").length,
  }), [rows]);

  const choices = useMemo(() => ({
    industries: uniq(rows, "industry"),
    websiteTypes: uniq(rows, "websiteType"),
    platforms: uniq(rows, "platform"),
  }), [rows]);

  const activeFilterCount = useMemo(() => (
    (searchTerm.trim() ? 1 : 0) +
    Object.entries(filters).filter(([key, value]) => key !== "q" && value !== emptyFilters[key]).length
  ), [filters, searchTerm]);

  const advancedFilterCount = useMemo(() => (
    ["classification", "industry", "websiteType", "platform", "featured"]
      .filter((key) => filters[key] !== emptyFilters[key]).length
  ), [filters]);

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setSearchTerm("");
    setFilters(emptyFilters);
    setMoreFiltersOpen(false);
  }

  function openCreate() {
    setEditorForm(emptyForm());
    setEditorOpen(true);
  }

  function openEdit(project) {
    setEditorForm(formFromProject(project));
    setEditorOpen(true);
  }

  async function saveProject(event) {
    event.preventDefault();
    setSaving(true);
    setErr("");
    setOk("");

    try {
      const payload = payloadFromForm(editorForm);
      if (!payload.title) throw new Error("Project title is required.");

      if (editorForm._id) {
        await api.update(editorForm._id, payload);
        setOk("Project updated.");
      } else {
        await api.create(payload);
        setOk("Project created.");
      }

      setEditorOpen(false);
      await load();
    } catch (error) {
      setErr(error?.message || "Project could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function quickAction(project, action, nextValue, successMessage) {
    setBusyId(project._id);
    setErr("");
    setOk("");

    try {
      await action(project._id, nextValue);
      setOk(successMessage);
      await load();
    } catch (error) {
      setErr(error?.message || "Action failed.");
    } finally {
      setBusyId("");
    }
  }

  function publish(project) {
    quickAction(
      project,
      api.publish,
      !project.published,
      project.published ? "Project unpublished." : "Project published."
    );
  }

  function feature(project) {
    quickAction(
      project,
      api.feature,
      !project.featured,
      project.featured ? "Featured flag removed." : "Project featured."
    );
  }

  async function archive(project) {
    if (!confirm(`Archive "${project.title}"? It will be hidden from the public portfolio but not deleted.`)) return;
    quickAction(project, (id) => api.archive(id), undefined, "Project archived.");
  }

  return (
    <div className="page-shell admin-projects space-stack">
      <section className="admin-project-hero">
        <div>
          <div className="text-muted-xs">Admin workspace</div>
          <h2>Project management</h2>
          <p>Manage portfolio records, assignment, publication, and safe archive actions from the backend source of truth.</p>
        </div>

        <div className="admin-project-hero-actions">
          <button className="btn btn-outline" onClick={() => load()} disabled={loading}>
            <LuRefreshCw className={loading ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} aria-hidden="true" />
            Refresh
          </button>
          <Link className="btn btn-outline" to="/projects" target="_blank" rel="noreferrer">
            <LuExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
            Public portfolio
          </Link>
          <button className="btn btn-primary" onClick={openCreate}>
            <LuPlus className="mr-2 h-4 w-4" aria-hidden="true" />
            New project
          </button>
        </div>
      </section>

      <div className="admin-project-stats">
        <Stat label="Loaded records" value={stats.total} />
        <Stat label="Published" value={stats.published} tone="good" />
        <Stat label="Featured" value={stats.featured} tone="accent" />
        <Stat label="Archived" value={stats.archived} tone="muted" />
      </div>

      {editorOpen && (
        <ProjectEditor
          form={editorForm}
          setForm={setEditorForm}
          users={users}
          onClose={() => setEditorOpen(false)}
          onSave={saveProject}
          saving={saving}
        />
      )}

      <section className="admin-project-filters" aria-label="Project filters">
        <div className="admin-project-filter-main">
          <SearchField
            className="admin-search-field"
            label="Search projects"
            placeholder="Search projects"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />

          <select value={filters.status} onChange={(event) => setFilter("status", event.target.value)} aria-label="Filter by status">
            {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>

          <select value={filters.published} onChange={(event) => setFilter("published", event.target.value)} aria-label="Filter by publication state">
            <option value="">All publication states</option>
            <option value="true">Published</option>
            <option value="false">Private</option>
          </select>

          <select value={filters.sort} onChange={(event) => setFilter("sort", event.target.value)} aria-label="Sort projects">
            {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>

          <button
            type="button"
            className={moreFiltersOpen ? "btn btn-outline admin-more-filters is-active" : "btn btn-outline admin-more-filters"}
            onClick={() => setMoreFiltersOpen((open) => !open)}
            aria-expanded={moreFiltersOpen}
          >
            <LuSlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            More filters
            {!!advancedFilterCount && <span>{advancedFilterCount}</span>}
          </button>

          {!!activeFilterCount && (
            <button type="button" className="btn btn-outline admin-filter-clear" onClick={clearFilters}>
              <LuX className="h-4 w-4" aria-hidden="true" /> Clear
            </button>
          )}

          <div className="admin-view-toggle" role="group" aria-label="Project view">
            <button type="button" className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")} aria-label="Show projects in a grid" title="Grid view" aria-pressed={view === "grid"}>
              <LuGrid2X2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-label="Show projects in a list" title="List view" aria-pressed={view === "list"}>
              <LuLayoutList className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {moreFiltersOpen && (
          <div className="admin-project-advanced-filters">
            <label className="admin-filter-control">
              <span>Work type</span>
              <select value={filters.classification} onChange={(event) => setFilter("classification", event.target.value)}>
                {classificationOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>

            <label className="admin-filter-control">
              <span>Industry</span>
              <select value={filters.industry} onChange={(event) => setFilter("industry", event.target.value)}>
                <option value="">All industries</option>
                {choices.industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
              </select>
            </label>

            <label className="admin-filter-control">
              <span>Website type</span>
              <select value={filters.websiteType} onChange={(event) => setFilter("websiteType", event.target.value)}>
                <option value="">All website types</option>
                {choices.websiteTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>

            <label className="admin-filter-control">
              <span>Platform</span>
              <select value={filters.platform} onChange={(event) => setFilter("platform", event.target.value)}>
                <option value="">All platforms</option>
                {choices.platforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
              </select>
            </label>

            <label className="admin-filter-control">
              <span>Featured state</span>
              <select value={filters.featured} onChange={(event) => setFilter("featured", event.target.value)}>
                <option value="">All featured states</option>
                <option value="true">Featured</option>
                <option value="false">Not featured</option>
              </select>
            </label>
          </div>
        )}

        <output className="admin-project-filter-summary" aria-live="polite" aria-atomic="true">
          Showing {rows.length} project{rows.length === 1 ? "" : "s"}
          {activeFilterCount ? ` with ${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}` : ""}.
        </output>
      </section>

      {(ok || err) && (
        <div>
          {ok && <div className="text-success">{ok}</div>}
          {err && <div className="text-error">{err}</div>}
        </div>
      )}

      {loading && !rows.length ? (
        <div className="admin-project-loading">
          <LuLoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
          Loading project records...
        </div>
      ) : rows.length ? (
        view === "grid" ? (
          <div className="admin-project-grid">
            {rows.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                busyId={busyId}
                onEdit={openEdit}
                onPublish={publish}
                onFeature={feature}
                onArchive={archive}
              />
            ))}
          </div>
        ) : (
          <ProjectTable
            rows={rows}
            busyId={busyId}
            onEdit={openEdit}
            onPublish={publish}
            onFeature={feature}
            onArchive={archive}
          />
        )
      ) : (
        <div className="admin-project-empty">
          <LuImage className="h-7 w-7" aria-hidden="true" />
          <h3>No projects match these filters</h3>
          <p>Clear filters or create a backend-managed project record. No seed/demo data is created from this screen.</p>
          <div className="form-actions">
            <button className="btn btn-outline" onClick={clearFilters}>Clear filters</button>
            <button className="btn btn-primary" onClick={openCreate}><LuPlus className="mr-2 h-4 w-4" />New project</button>
          </div>
        </div>
      )}

      <div className="admin-project-footnote">
        <LuSparkles className="h-4 w-4" aria-hidden="true" />
        Showing {rows.length} project{rows.length === 1 ? "" : "s"} using {labelFor(filters.sort, sortOptions).toLowerCase()}.
      </div>
    </div>
  );
}
