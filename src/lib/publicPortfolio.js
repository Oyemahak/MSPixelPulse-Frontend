import { publishedProjects } from '@/data/projects.js';

export const fallbackPublicProjects = publishedProjects;

function labelFor(project) {
  if (project.projectClassification === 'technical' || project.websiteType === 'LMS Platform') return 'Technical Project';
  if (project.projectClassification === 'live') return 'Live Website';
  if (project.projectClassification === 'concept') return 'Concept Project';
  return 'Agency Demo';
}

export function normalizePublicProject(project = {}) {
  if (!project._id && project.classification) return project;
  const image = project.thumbnail || project.mockupImages?.[0]?.url || '/projects/project-fallback.svg';
  return {
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
}

export function normalizePublicProjects(items = []) {
  return (Array.isArray(items) ? items : []).map(normalizePublicProject);
}
