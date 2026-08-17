// src/lib/presenceApi.js

import { API_BASE } from "@/lib/api.js";

function authToken() {
  try {
    const raw = localStorage.getItem("auth");

    if (!raw) return "";

    return JSON.parse(raw)?.token || "";
  } catch {
    return "";
  }
}

export async function heartbeatPresence() {
  const token = authToken();

  if (!token) {
    return null;
  }

  const response = await fetch(
    `${API_BASE}/users/me/presence`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({}));

    const error = new Error(
      data?.message ||
        "Presence heartbeat failed",
    );

    error.status = response.status;

    throw error;
  }

  return response.json();
}