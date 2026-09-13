import { publishedProjects } from '../data/projects.js';

export const fallbackPublicProjects = publishedProjects;

const legacyMediaHosts = new Set([
  'mspixelpulse.vercel.app',
  'capstone-frontend.vercel.app',
]);

export function normalizePublicMediaUrl(value = '') {
  if (!value || value.startsWith('/')) return value;

  try {
    const url = new URL(value);
    if (legacyMediaHosts.has(url.hostname) && url.pathname.startsWith('/projects/')) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return value;
  }

  return value;
}

function labelFor(project) {
  if (project.projectClassification === 'technical' || project.websiteType === 'LMS Platform') return 'Technical Project';
  if (project.projectClassification === 'live') return 'Live Website';
  if (project.projectClassification === 'concept') return 'Concept Project';
  return 'Agency Demo';
}

export function normalizePublicProject(project = {}, curatedProject = null) {
  if (!project._id && project.classification) return project;
  const image = normalizePublicMediaUrl(project.thumbnail || project.mockupImages?.[0]?.url || '/projects/project-fallback.svg');
  const normalized = {
    ...project,
    id: project.slug || project._id,
    slug: project.slug || project._id,
    classification: project.projectClassification || 'demo',
    label: labelFor(project),
    stack: Array.isArray(project.technologies) ? project.technologies : [],
    live: project.liveUrl || '',
    repo: project.repositoryUrl || '',
    thumb: image,
    imageAlt: project.imageAltText || project.mockupImages?.[0]?.alt || `${project.title} project preview`,
    services: Array.isArray(project.servicesProvided) ? project.servicesProvided : [],
    features: Array.isArray(project.keyFeatures) ? project.keyFeatures : [],
    overview: project.projectOverview || project.fullDescription || project.summary || '',
    result: project.resultSummary || '',
  };

  if (!curatedProject) return normalized;

  return {
    ...curatedProject,
    ...normalized,
    stack: normalized.stack.length ? normalized.stack : curatedProject.stack,
    // Curated release-tested destinations win over stale API records.
    live: curatedProject.live || normalized.live,
    repo: normalized.repo || curatedProject.repo,
    services: normalized.services.length ? normalized.services : curatedProject.services,
    features: normalized.features.length ? normalized.features : curatedProject.features,
    overview: normalized.overview || curatedProject.overview,
    result: normalized.result || curatedProject.result,
    // Curated local captures are release-tested and must not be replaced by stale API hosts.
    thumb: curatedProject.thumb || image,
    imageAlt: curatedProject.imageAlt || normalized.imageAlt,
  };
}

export function normalizePublicProjects(items = []) {
  const curatedBySlug = new Map(fallbackPublicProjects.map((project) => [project.slug, project]));
  const normalized = (Array.isArray(items) ? items : []).map((project) =>
    normalizePublicProject(project, curatedBySlug.get(project.slug || project._id)),
  );
  const publishedSlugs = new Set(normalized.map((project) => project.slug).filter(Boolean));
  const localOnlyProjects = fallbackPublicProjects.filter(
    (project) => !publishedSlugs.has(project.slug),
  );

  return [...normalized, ...localOnlyProjects];
}
