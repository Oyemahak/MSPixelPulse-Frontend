import { useEffect, useState } from 'react';
import { siteContent } from '@/lib/api.js';

const cache = new Map();

export function usePublicContent(kind, fallback = []) {
  const [items, setItems] = useState(() => cache.get(kind) || fallback);
  const [source, setSource] = useState(() => cache.has(kind) ? 'database' : 'fallback');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await siteContent.list(kind);
        const next = (data.items || []).map((item) => ({
          ...item.payload,
          _id: item._id,
          key: item.key,
          title: item.payload?.title || item.title,
          displayOrder: item.displayOrder,
        }));
        cache.set(kind, next);
        if (active) {
          setItems(next);
          setSource('database');
        }
      } catch {
        if (active) setSource('fallback');
      }
    })();
    return () => { active = false; };
  }, [kind]);

  return { items, source };
}
