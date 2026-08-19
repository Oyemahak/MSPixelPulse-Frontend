import { users } from "@/lib/api.js";
import {
  clearPendingAccountTheme,
  getPendingAccountTheme,
  rememberPendingAccountTheme,
} from "@/lib/theme.js";

const accountThemeSaves = new Map();
const MAX_SAVE_ATTEMPTS = 3;

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

async function drainAccountThemeSave(userId) {
  let latestResult = null;

  while (getPendingAccountTheme(userId)) {
    const requestedTheme = getPendingAccountTheme(userId);
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_SAVE_ATTEMPTS; attempt += 1) {
      try {
        latestResult = await users.updateMe(
          { themePreference: requestedTheme },
          { keepalive: true },
        );
        lastError = null;
        break;
      } catch (error) {
        lastError = error;

        if (attempt < MAX_SAVE_ATTEMPTS) {
          await wait(attempt * 500);
        }
      }
    }

    if (lastError) throw lastError;

    if (getPendingAccountTheme(userId) === requestedTheme) {
      clearPendingAccountTheme(userId, requestedTheme);
    }
  }

  return latestResult;
}

export function queueAccountThemeSave(userId, theme = "") {
  const normalizedUserId = String(userId || "");

  if (!normalizedUserId) return Promise.resolve(null);

  if (theme) {
    rememberPendingAccountTheme(normalizedUserId, theme);
  }

  if (!getPendingAccountTheme(normalizedUserId)) {
    return Promise.resolve(null);
  }

  if (!accountThemeSaves.has(normalizedUserId)) {
    const save = drainAccountThemeSave(normalizedUserId).finally(() => {
      accountThemeSaves.delete(normalizedUserId);
    });

    accountThemeSaves.set(normalizedUserId, save);
  }

  return accountThemeSaves.get(normalizedUserId);
}
