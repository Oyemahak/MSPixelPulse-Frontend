/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.jsx

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { auth } from "@/lib/api.js";
import { heartbeatPresence } from "@/lib/presenceApi.js";

const Ctx = createContext(null);

const HEARTBEAT_INTERVAL_MS = 60_000;
const HEARTBEAT_THROTTLE_MS = 30_000;

function readToken() {
  try {
    const raw = localStorage.getItem("auth");

    return raw
      ? JSON.parse(raw)?.token || ""
      : "";
  } catch {
    return "";
  }
}

function writeToken(token) {
  try {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: token || "",
      }),
    );
  } catch {
    void 0;
  }
}

function clearToken() {
  try {
    localStorage.removeItem("auth");
  } catch {
    void 0;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  const lastHeartbeatRef = useRef(0);
  const heartbeatBusyRef = useRef(false);

  const updateUser = useCallback((partial) => {
    setUser((previous) =>
      previous
        ? {
            ...previous,
            ...partial,
          }
        : previous,
    );
  }, []);

  const sendHeartbeat = useCallback(
    async ({ force = false } = {}) => {
      if (!readToken()) return null;

      const now = Date.now();

      if (
        !force &&
        now - lastHeartbeatRef.current <
          HEARTBEAT_THROTTLE_MS
      ) {
        return null;
      }

      if (heartbeatBusyRef.current) {
        return null;
      }

      heartbeatBusyRef.current = true;

      try {
        const result = await heartbeatPresence();

        if (result?.presence) {
          lastHeartbeatRef.current = Date.now();

          setUser((previous) =>
            previous
              ? {
                  ...previous,
                  lastSeenAt:
                    result.presence.lastSeenAt ||
                    previous.lastSeenAt ||
                    "",
                  online: true,
                  presence: {
                    ...(previous.presence || {}),
                    ...result.presence,
                  },
                }
              : previous,
          );
        }

        return result;
      } catch {
        // Presence must never log the user out or block portal use.
        return null;
      } finally {
        heartbeatBusyRef.current = false;
      }
    },
    [],
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const token = readToken();

        if (!token) {
          if (alive) {
            setUser(null);
            setChecked(true);
          }

          return;
        }

        const response = await auth.me();

        if (alive) {
          setUser(response?.user || null);
        }
      } catch {
        if (alive) {
          setUser(null);
        }
      } finally {
        if (alive) {
          setChecked(true);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!user?._id) return undefined;

    void sendHeartbeat({
      force: true,
    });

    const timer = window.setInterval(() => {
      void sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    const onFocus = () => {
      void sendHeartbeat();
    };

    const onOnline = () => {
      void sendHeartbeat({
        force: true,
      });
    };

    const onVisibilityChange = () => {
      if (
        document.visibilityState === "visible"
      ) {
        void sendHeartbeat();
      }
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);

    document.addEventListener(
      "visibilitychange",
      onVisibilityChange,
    );

    return () => {
      window.clearInterval(timer);

      window.removeEventListener(
        "focus",
        onFocus,
      );

      window.removeEventListener(
        "online",
        onOnline,
      );

      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange,
      );
    };
  }, [user?._id, sendHeartbeat]);

  const login = useCallback(
    async (email, password) => {
      const response = await auth.login(
        email,
        password,
      );

      if (response?.token) {
        writeToken(response.token);
      }

      setUser(response?.user || null);

      lastHeartbeatRef.current = 0;

      return response?.user || null;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch {
      void 0;
    }

    clearToken();

    lastHeartbeatRef.current = 0;

    setUser(null);
  }, []);

  const register = useCallback(
    async (payload) => auth.register(payload),
    [],
  );

  const value = useMemo(
    () => ({
      user,

      role: user?.role || null,

      isAuthed: Boolean(user),

      checked,

      login,
      logout,
      register,
      updateUser,
      sendHeartbeat,
    }),
    [
      user,
      checked,
      login,
      logout,
      register,
      updateUser,
      sendHeartbeat,
    ],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const context = useContext(Ctx);

  if (!context) {
    throw new Error(
      "useAuth must be used inside <AuthProvider>",
    );
  }

  return context;
}