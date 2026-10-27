import { retiredRestaurantProjectSlug } from '../data/restaurantPlatform.js';
import { publishedProjects } from '../data/projects.js';
import { resolveStoredCardSummary } from './projectCardSummary.js';

export const fallbackPublicProjects = publishedProjects;

// Same-site hosts whose /projects/ media ships with this frontend. Serving those
// paths relatively keeps previews and local builds on their own copy instead of a
// cross-origin request to production.
const legacyMediaHosts = new Set([
  'mspixelpulse.vercel.app',
  'capstone-frontend.vercel.app',
  'mspixelpulse.com',
  'www.mspixelpulse.com',
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
  if (!project._id && project.classification && !curatedProject?.businessDemo) return project;
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
    // Short, consistent card copy; full descriptions stay on the record and detail page.
    cardSummary: resolveStoredCardSummary(project),
  };

  if (!curatedProject) return normalized;

  const merged = {
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
    // Editorial case-study fields are release-managed. API requirement records use a
    // different contract and must not overwrite these public arrays.
    requirements: Array.isArray(curatedProject.requirements) ? curatedProject.requirements : [],
    solution: Array.isArray(curatedProject.solution) ? curatedProject.solution : [],
    seoTitle: curatedProject.seoTitle,
    metaDescription: curatedProject.metaDescription,
    lastModified: curatedProject.lastModified,
    // Curated local captures are release-tested and must not be replaced by stale API hosts.
    thumb: curatedProject.thumb || image,
    imageAlt: curatedProject.imageAlt || normalized.imageAlt,
  };

  // Wellness is maintained in Admin. Keep the durable CMS record authoritative;
  // release captures below are fallbacks only when the API is unavailable.
  if (project._id && project.slug === 'ms-pixelpulse-wellness-studio') {
    return {
      ...merged,
      thumb: image,
      imageAlt: normalized.imageAlt,
      live: normalized.live,
      repo: normalized.repo,
      industry: project.industry,
      platform: project.platform,
      stack: normalized.stack,
      classification: normalized.classification,
      label: normalized.label,
      screenshots: (project.mockupImages || []).filter(item => item.url).map(item => ({
        src: normalizePublicMediaUrl(item.url), alt: item.alt, caption: item.caption,
        width: /mobile/i.test(item.caption || item.alt || '') ? 390 : 1440,
        height: 1000,
      })),
      seoTitle: project.seoTitle || curatedProject.seoTitle,
      metaDescription: project.seoDescription || curatedProject.metaDescription,
    };
  }

  // The founder's in-house (employer) work is never an agency client project. Its
  // label, relationship and disclosure are release-managed, and no repository link
  // is published, so an older API record cannot restore client-style wording.
  if (curatedProject.relationship === 'founder-in-house') {
    return {
      ...merged,
      classification: curatedProject.classification,
      label: curatedProject.label,
      relationship: curatedProject.relationship,
      disclosure: curatedProject.disclosure,
      servicesHeading: curatedProject.servicesHeading,
      repo: curatedProject.repo || '',
    };
  }

  if (!curatedProject.businessDemo) return merged;

  // Approved business metadata is release-managed alongside its capture. A stale
  // API URL must never publish a planned hostname or resurrect a failed preview.
  return {
    ...merged,
    businessDemo: true,
    title: curatedProject.title,
    ...(curatedProject.operationsUrl ? {
      summary: curatedProject.summary,
      shortDescription: curatedProject.shortDescription,
      overview: curatedProject.overview,
      features: curatedProject.features,
      result: curatedProject.result,
      websiteType: curatedProject.websiteType,
      operationsUrl: curatedProject.operationsUrl,
      operationsRepo: curatedProject.operationsRepo,
      customerExperience: curatedProject.customerExperience,
      operationsExperience: curatedProject.operationsExperience,
      screenshots: curatedProject.screenshots,
    } : {}),
    classification: curatedProject.classification,
    label: curatedProject.label,
    industry: curatedProject.industry,
    platform: curatedProject.platform,
    stack: curatedProject.stack,
    repo: curatedProject.repo,
    live: curatedProject.verifiedLiveUrl || '',
    existingLiveUrl: curatedProject.existingLiveUrl,
    plannedCategorySubdomain: curatedProject.plannedCategorySubdomain,
    verifiedLiveUrl: curatedProject.verifiedLiveUrl,
    githubRepository: curatedProject.githubRepository,
    vercelProjectId: curatedProject.vercelProjectId,
    domainStatus: curatedProject.domainStatus,
    deploymentStatus: curatedProject.deploymentStatus,
    portfolioStatus: curatedProject.portfolioStatus,
    demoCategory: curatedProject.demoCategory,
    demoSubcategories: curatedProject.demoSubcategories,
    aurelionStatus: curatedProject.aurelionStatus,
    previewStatus: curatedProject.previewStatus,
  };
}

export function normalizePublicProjects(items = []) {
  const curatedBySlug = new Map(fallbackPublicProjects.map((project) => [project.slug, project]));
  let hasCanonicalRestaurant = false;
  const normalized = (Array.isArray(items) ? items : []).filter((project) =>
    (project.slug || project._id) !== retiredRestaurantProjectSlug,
  ).filter((project) => {
    if ((project.slug || project._id) !== 'savora-kitchen-table') return true;
    if (hasCanonicalRestaurant) return false;
    hasCanonicalRestaurant = true;
    return true;
  }).map((project) =>
    normalizePublicProject(project, curatedBySlug.get(project.slug || project._id)),
  );
  const publishedSlugs = new Set(normalized.map((project) => project.slug).filter(Boolean));
  const localOnlyProjects = fallbackPublicProjects.filter(
    (project) => !publishedSlugs.has(project.slug) && project.slug !== "ms-pixelpulse-wellness-studio",
  );

  return [...normalized, ...localOnlyProjects];
}
