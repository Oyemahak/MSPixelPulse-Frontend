import { API_BASE } from "./api.js";

const ANONYMOUS_KEY = "mspixelpulse-blog-anonymous-v1";

function token() {
  try {
    return JSON.parse(localStorage.getItem("auth") || "{}")?.token || "";
  } catch {
    return "";
  }
}

function randomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(24);
  globalThis.crypto?.getRandomValues?.(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function getBlogAnonymousId() {
  try {
    const stored = localStorage.getItem(ANONYMOUS_KEY);
    if (/^[a-zA-Z0-9-]{20,200}$/.test(stored || "")) return stored;
    const next = randomId();
    localStorage.setItem(ANONYMOUS_KEY, next);
    return next;
  } catch {
    return randomId();
  }
}

async function request(path, { method = "GET", body } = {}) {
  const authToken = token();
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error || data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function articlePayload(article) {
  return {
    blogSlug: article.slug,
    blogTitle: article.title,
    blogUrl: article.url,
    anonymousId: getBlogAnonymousId(),
  };
}

export const blogEngagement = {
  get(article, { page = 1, limit = 8 } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      anonymousId: getBlogAnonymousId(),
    });
    return request(`/blog-engagement/${encodeURIComponent(article.slug)}?${params}`);
  },
  react(article, reactionType) {
    return request(`/blog-engagement/${encodeURIComponent(article.slug)}/reaction`, {
      method: "PUT",
      body: { ...articlePayload(article), reactionType },
    });
  },
  removeReaction(article) {
    return request(`/blog-engagement/${encodeURIComponent(article.slug)}/reaction`, {
      method: "DELETE",
      body: articlePayload(article),
    });
  },
  comment(article, payload) {
    return request(`/blog-engagement/${encodeURIComponent(article.slug)}/comments`, {
      method: "POST",
      body: { ...articlePayload(article), ...payload },
    });
  },
  share(article, platform, eventType = "share_option_selected") {
    return request(`/blog-engagement/${encodeURIComponent(article.slug)}/shares`, {
      method: "POST",
      body: { ...articlePayload(article), platform, eventType },
    });
  },
  subscribe(article, payload) {
    return request("/blog-engagement/subscriptions", {
      method: "POST",
      body: { ...articlePayload(article), ...payload },
    });
  },
  confirmSubscription(subscriptionToken) {
    return request(`/blog-engagement/subscriptions/confirm?token=${encodeURIComponent(subscriptionToken)}`);
  },
  unsubscribe(subscriptionToken) {
    return request(`/blog-engagement/subscriptions/unsubscribe?token=${encodeURIComponent(subscriptionToken)}`);
  },
};
