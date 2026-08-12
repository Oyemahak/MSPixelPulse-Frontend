import { useEffect, useState } from 'react';
import { portfolio } from '@/lib/api.js';
import { fallbackPublicProjects, normalizePublicProjects } from '@/lib/publicPortfolio.js';

let cache = null;
let pending = null;

async function loadPortfolio() {
  if (cache) return cache;
  if (!pending) {
    pending = portfolio.list()
      .then((response) => {
        cache = normalizePublicProjects(response.projects || []);
        return cache;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

export function usePublicPortfolio() {
  const [state, setState] = useState({
    projects: cache || fallbackPublicProjects,
    loading: !cache,
    source: cache ? 'database' : 'fallback',
  });

  useEffect(() => {
    let active = true;
    loadPortfolio()
      .then((projects) => {
        if (active) setState({ projects, loading: false, source: 'database' });
      })
      .catch(() => {
        if (active) setState({ projects: fallbackPublicProjects, loading: false, source: 'fallback' });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

