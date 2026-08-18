// src/lib/api.js

/*
 * MSPixelPulse API client
 *
 * Production:
 *   VITE_API_BASE=https://api.mspixelpulse.com/api
 *
 * Development:
 *   defaults to http://localhost:4000/api
 */

const IS_DEV = import.meta.env?.DEV === true;

const configuredBase = import.meta.env?.VITE_API_BASE
  ?.trim()
  .replace(/\/+$/, "");

if (!IS_DEV && !configuredBase) {
  throw new Error("VITE_API_BASE is required in production");
}

export const API_BASE =
  configuredBase || "http://localhost:4000/api";

/* ---------------------------------------------------------
   Core helpers
   --------------------------------------------------------- */

function apiRoot() {
  return API_BASE.replace(/\/api$/, "");
}

function getToken() {
  try {
    const raw = localStorage.getItem("auth");

    if (!raw) return "";

    return JSON.parse(raw)?.token || "";
  } catch {
    return "";
  }
}

function errorFromResponse(data, status) {
  const message =
    (data && (data.message || data.error)) ||
    `HTTP ${status}`;

  const error = new Error(message);

  error.status = status;
  error.data = data;

  return error;
}

async function readResponse(res) {
  const contentType =
    res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json().catch(() => ({}));
  }

  return res.text();
}

async function http(
  path,
  {
    method = "GET",
    body,
    headers,
  } = {},
) {
  const token = getToken();

  const requestHeaders = {
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: requestHeaders,
    credentials: "include",
    body:
      body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  const data = await readResponse(res);

  if (!res.ok) {
    throw errorFromResponse(data, res.status);
  }

  return data;
}

async function multipart(
  path,
  formData,
  {
    method = "POST",
  } = {},
) {
  const token = getToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  /*
   * Do not manually set Content-Type here.
   * fetch() must add the multipart boundary itself.
   */
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers,
    body: formData,
  });

  const data = await readResponse(res);

  if (!res.ok) {
    throw errorFromResponse(data, res.status);
  }

  return data;
}

function qs(obj = {}) {
  const query = Object.entries(obj)
    .filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "",
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return query ? `?${query}` : "";
}

/* ---------------------------------------------------------
   Health
   --------------------------------------------------------- */

export async function pingApi({
  timeoutMs = 4000,
} = {}) {
  const url = `${apiRoot()}/health`;

  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    timeoutMs,
  );

  try {
    await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      credentials: "omit",
    });

    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function ensureAwake({
  attempts = 6,
} = {}) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const ok = await pingApi({
      timeoutMs: 4500,
    });

    if (ok) return true;

    await new Promise((resolve) =>
      setTimeout(
        resolve,
        500 * Math.max(1, 2 ** attempt),
      ),
    );
  }

  return false;
}

/* ---------------------------------------------------------
   Google Drive resumable uploads

   Used for larger project files that should not travel
   through the Vercel Function request body.

   Avatar upload intentionally does NOT use this helper.
   Avatars use /users/me/avatar through the backend because
   they are capped below the Vercel request limit.
   --------------------------------------------------------- */

async function directGoogleUpload(
  file,
  {
    purpose,
    projectId = "",
    requirementField = "",
  } = {},
) {
  const session = await http(
    "/files/upload-session",
    {
      method: "POST",
      body: {
        name: file.name,
        type:
          file.type ||
          "application/octet-stream",
        size: file.size,
        purpose,
        projectId,
        requirementField,
      },
    },
  );

  const upload = session?.upload;

  if (
    !upload?.url ||
    !upload?.completionToken
  ) {
    throw new Error(
      "Upload session could not be created",
    );
  }

  const response = await fetch(
    upload.url,
    {
      method: upload.method || "PUT",

      headers: {
        "Content-Type":
          file.type ||
          "application/octet-stream",
      },

      body: file,

      credentials: "omit",
    },
  );

  const result = await response
    .json()
    .catch(() => ({}));

  if (
    !response.ok ||
    !result?.id
  ) {
    const error = new Error(
      "Google Drive upload failed. Please try again.",
    );

    error.status = response.status;

    throw error;
  }

  return http(
    "/files/upload-complete",
    {
      method: "POST",
      body: {
        driveFileId: result.id,
        completionToken:
          upload.completionToken,
      },
    },
  );
}

/* ---------------------------------------------------------
   Authentication
   --------------------------------------------------------- */

export const auth = {
  login: (email, password) =>
    http("/auth/login", {
      method: "POST",
      body: {
        email,
        password,
      },
    }),

  logout: () =>
    http("/auth/logout", {
      method: "POST",
    }),

  me: () =>
    http("/auth/me"),

  register: async (payload) => {
    try {
      return await http(
        "/auth/register",
        {
          method: "POST",
          body: payload,
        },
      );
    } catch (error) {
      /*
       * Temporary compatibility with older deployments.
       * We will remove this during the final API cleanup
       * once every production route is audited.
       */
      if (error?.status === 404) {
        return http("/register", {
          method: "POST",
          body: payload,
        });
      }

      throw error;
    }
  },
};

/* ---------------------------------------------------------
   Admin
   --------------------------------------------------------- */

export const admin = {
  users: (q = "") =>
    http(
      `/admin/users${
        q
          ? `?q=${encodeURIComponent(q)}`
          : ""
      }`,
    ),

  user: (id) =>
    http(`/admin/users/${id}`),

  createUser: (payload) =>
    http("/admin/users", {
      method: "POST",
      body: payload,
    }),

  updateUser: (id, payload) =>
    http(`/admin/users/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  setUserPassword: (
    id,
    password,
  ) =>
    http(
      `/admin/users/${id}/password`,
      {
        method: "PATCH",
        body: {
          password,
        },
      },
    ),

  deleteUser: (id) =>
    http(`/admin/users/${id}`, {
      method: "DELETE",
    }),

  pending: () =>
    http(
      "/admin/users?status=pending",
    ),

  approveUser: (id) =>
    http(
      `/admin/users/${id}/approve`,
      {
        method: "PATCH",
      },
    ),

  rejectUser: (id) =>
    http(
      `/admin/users/${id}/reject`,
      {
        method: "PATCH",
      },
    ),

  stats: () =>
    http("/admin/stats"),

  leads: (params = {}) =>
    http(
      `/admin/leads${qs(params)}`,
    ),

  updateLead: (id, status) =>
    http(`/admin/leads/${id}`, {
      method: "PATCH",
      body: {
        status,
      },
    }),

  archiveLead: (id) =>
    http(`/admin/leads/${id}`, {
      method: "DELETE",
    }),

  content: (kind) =>
    http(
      `/admin/content/${encodeURIComponent(
        kind,
      )}`,
    ),

  createContent: (
    kind,
    payload,
  ) =>
    http(
      `/admin/content/${encodeURIComponent(
        kind,
      )}`,
      {
        method: "POST",
        body: payload,
      },
    ),

  updateContent: (
    kind,
    id,
    payload,
  ) =>
    http(
      `/admin/content/${encodeURIComponent(
        kind,
      )}/${id}`,
      {
        method: "PATCH",
        body: payload,
      },
    ),

  archiveContent: (
    kind,
    id,
  ) =>
    http(
      `/admin/content/${encodeURIComponent(
        kind,
      )}/${id}`,
      {
        method: "DELETE",
      },
    ),
};

/* ---------------------------------------------------------
   Projects
   --------------------------------------------------------- */

export const projects = {
  list: (params = {}) =>
    http(
      `/projects${qs(params)}`,
    ),

  one: (id) =>
    http(`/projects/${id}`),

  create: (payload) =>
    http("/projects", {
      method: "POST",
      body: payload,
    }),

  update: (id, payload) =>
    http(`/projects/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  remove: (id) =>
    http(`/projects/${id}`, {
      method: "DELETE",
    }),

  archive: (id) =>
    http(
      `/projects/${id}/archive`,
      {
        method: "PATCH",
      },
    ),

  publish: (
    id,
    published,
  ) =>
    http(
      `/projects/${id}/publish`,
      {
        method: "PATCH",
        body: {
          published,
        },
      },
    ),

  feature: (
    id,
    featured,
  ) =>
    http(
      `/projects/${id}/feature`,
      {
        method: "PATCH",
        body: {
          featured,
        },
      },
    ),

  deleteCover: (id) =>
    http(
      `/projects/${id}/cover`,
      {
        method: "DELETE",
      },
    ),

  addEvidence: (
    id,
    entry,
  ) =>
    http(
      `/projects/${id}/evidence`,
      {
        method: "POST",
        body: entry,
      },
    ),

  listAnnouncements: (id) =>
    http(
      `/projects/${id}/announcements`,
    ),

  createAnnouncement: (
    id,
    payload,
  ) =>
    http(
      `/projects/${id}/announcements`,
      {
        method: "POST",
        body: payload,
      },
    ),

  deleteAnnouncement: (
    id,
    index,
  ) =>
    http(
      `/projects/${id}/announcements/${index}`,
      {
        method: "DELETE",
      },
    ),
};

/* ---------------------------------------------------------
   Public portfolio
   --------------------------------------------------------- */

export const portfolio = {
  list: (params = {}) =>
    http(
      `/public/projects${qs(params)}`,
    ),

  one: (slug) =>
    http(
      `/public/projects/${encodeURIComponent(
        slug,
      )}`,
    ),
};

export const siteContent = {
  list: (kind) =>
    http(
      `/content/${encodeURIComponent(
        kind,
      )}`,
    ),
};

/* ---------------------------------------------------------
   Debug
   --------------------------------------------------------- */

export const debug = {
  seedBasic: () =>
    http("/debug/seed-basic", {
      method: "POST",
    }),

  resetBasic: () =>
    http("/debug/reset-basic", {
      method: "POST",
    }),
};

/* ---------------------------------------------------------
   Directory
   --------------------------------------------------------- */

export const directory = {
  list: () =>
    http("/directory"),
};

/* ---------------------------------------------------------
   Direct messages
   --------------------------------------------------------- */

export const dm = {
  open: (peerId) =>
    http("/dm/open", {
      method: "POST",
      body: {
        peerId,
      },
    }),

  threads: () =>
    http("/dm/threads"),

  get: (
    threadId,
    {
      before,
      limit = 50,
    } = {},
  ) =>
    http(
      `/dm/threads/${threadId}/messages${qs(
        {
          before,
          limit,
        },
      )}`,
    ),

  send: (
    threadId,
    {
      text,
      attachments,
    },
  ) =>
    http(
      `/dm/threads/${threadId}/messages`,
      {
        method: "POST",
        body: {
          text,
          attachments,
        },
      },
    ),
};

/* ---------------------------------------------------------
   Project rooms
   --------------------------------------------------------- */

export const rooms = {
  get: (
    projectId,
    {
      before,
      limit = 50,
    } = {},
  ) =>
    http(
      `/rooms/${projectId}/messages${qs(
        {
          before,
          limit,
        },
      )}`,
    ),

  send: (
    projectId,
    {
      text,
      attachments,
    },
  ) =>
    http(
      `/rooms/${projectId}/messages`,
      {
        method: "POST",
        body: {
          text,
          attachments,
        },
      },
    ),
};

/* ---------------------------------------------------------
   Requirements

   Larger requirement documents continue to use the
   resumable Google Drive flow. We will audit this route
   separately before removing the legacy fallback.
   --------------------------------------------------------- */

export const requirements = {
  get: (projectId) =>
    http(
      `/projects/${projectId}/requirements`,
    ),

  async upsert(
    projectId,
    payload,
  ) {
    const uploadOne = (
      file,
      requirementField,
    ) =>
      directGoogleUpload(file, {
        purpose: "requirement",
        projectId,
        requirementField,
      }).then(
        (result) =>
          result.file,
      );

    try {
      const uploadedFiles = {
        supporting: [],
        pageFiles: {},
      };

      if (
        payload.files?.logo
      ) {
        uploadedFiles.logo =
          await uploadOne(
            payload.files.logo,
            "logo",
          );
      }

      if (
        payload.files?.brief
      ) {
        uploadedFiles.brief =
          await uploadOne(
            payload.files.brief,
            "brief",
          );
      }

      for (
        const file of
        payload.files
          ?.supporting || []
      ) {
        uploadedFiles.supporting.push(
          await uploadOne(
            file,
            "supporting",
          ),
        );
      }

      for (
        const [
          name,
          list,
        ] of Object.entries(
          payload.files
            ?.pageFiles || {},
        )
      ) {
        uploadedFiles.pageFiles[
          name
        ] = [];

        for (
          const file of
          list || []
        ) {
          uploadedFiles.pageFiles[
            name
          ].push(
            await uploadOne(
              file,
              `page:${name}`,
            ),
          );
        }
      }

      return http(
        `/projects/${projectId}/requirements`,
        {
          method: "PUT",
          body: {
            pages:
              payload.pages ||
              [],
            uploadedFiles,
          },
        },
      );
    } catch (error) {
      /*
       * Leave rollback behavior in place until the project
       * file migration path is verified end-to-end.
       */
      if (
        error?.status !== 409
      ) {
        throw error;
      }
    }

    const token =
      getToken();

    const headers =
      token
        ? {
            Authorization:
              `Bearer ${token}`,
          }
        : undefined;

    const formData =
      new FormData();

    formData.append(
      "replace",
      "true",
    );

    formData.append(
      "pages",
      JSON.stringify(
        payload.pages ||
          [],
      ),
    );

    if (
      payload.files?.logo
    ) {
      formData.append(
        "logo",
        payload.files.logo,
      );
    }

    if (
      payload.files?.brief
    ) {
      formData.append(
        "brief",
        payload.files.brief,
      );
    }

    (
      payload.files
        ?.supporting || []
    ).forEach((file) =>
      formData.append(
        "supporting",
        file,
      ),
    );

    if (
      payload.files
        ?.pageFiles
    ) {
      for (
        const [
          name,
          list,
        ] of Object.entries(
          payload.files.pageFiles,
        )
      ) {
        (
          list || []
        ).forEach(
          (file) =>
            formData.append(
              `pageFiles[${name}]`,
              file,
            ),
        );
      }
    }

    const res = await fetch(
      `${API_BASE}/projects/${projectId}/requirements`,
      {
        method: "PUT",
        credentials:
          "include",
        headers,
        body: formData,
      },
    );

    const data =
      await readResponse(
        res,
      );

    if (!res.ok) {
      throw errorFromResponse(
        data,
        res.status,
      );
    }

    return data;
  },

  setReview: (
    projectId,
    reviewed,
  ) =>
    http(
      `/projects/${projectId}/requirements/review`,
      {
        method: "PATCH",
        body: {
          reviewed,
        },
      },
    ),

  remove: (projectId) =>
    http(
      `/projects/${projectId}/requirements`,
      {
        method: "DELETE",
      },
    ),
};

/* ---------------------------------------------------------
   Project files

   Larger files continue through the resumable Drive flow.
   The temporary fallback stays until the backend file route
   is cleaned in the next stage.
   --------------------------------------------------------- */

export const files = {
  upload: async (
    file,
    {
      purpose,
      projectId,
      requirementField,
    } = {},
  ) => {
    try {
      return await directGoogleUpload(
        file,
        {
          purpose,
          projectId,
          requirementField,
        },
      );
    } catch (error) {
      if (
        error?.status !== 409
      ) {
        throw error;
      }
    }

    const token =
      getToken();

    const headers =
      token
        ? {
            Authorization:
              `Bearer ${token}`,
          }
        : undefined;

    const formData =
      new FormData();

    formData.append(
      "file",
      file,
    );

    formData.append(
      "purpose",
      purpose || "",
    );

    formData.append(
      "projectId",
      projectId || "",
    );

    const res = await fetch(
      `${API_BASE}/files/upload`,
      {
        method: "POST",
        credentials:
          "include",
        headers,
        body: formData,
      },
    );

    const data =
      await readResponse(
        res,
      );

    if (!res.ok) {
      throw errorFromResponse(
        data,
        res.status,
      );
    }

    return data;
  },
};

/* ---------------------------------------------------------
   Invoices
   --------------------------------------------------------- */

export const invoices = {
  all: () =>
    http("/invoices"),

  list: (projectId) =>
    http(
      `/projects/${projectId}/invoices`,
    ),

  create: (
    projectId,
    payload,
  ) =>
    http(
      `/projects/${projectId}/invoices`,
      {
        method: "POST",
        body: payload,
      },
    ),

  updateStatus: (
    projectId,
    invoiceId,
    status,
  ) =>
    http(
      `/projects/${projectId}/invoices/${invoiceId}`,
      {
        method: "PATCH",
        body: {
          status,
        },
      },
    ),

  update: (
    projectId,
    invoiceId,
    payload,
  ) =>
    http(
      `/projects/${projectId}/invoices/${invoiceId}`,
      {
        method: "PATCH",
        body: payload,
      },
    ),

  async upload(
    file,
    {
      projectId,
      kind,
      invoiceId = "",
      invoice = {},
      onProgress,
    } = {},
  ) {
    if (!file || !projectId || !kind) {
      throw new Error("Select an invoice file and project.");
    }

    const extension = String(file.name || "")
      .split(".")
      .pop()
      ?.toLowerCase();
    const typeByExtension = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const contentType = file.type || typeByExtension[extension] || "";
    const allowedTypes = new Set(Object.values(typeByExtension));
    const maxBytes = 15 * 1024 * 1024;

    if (!allowedTypes.has(contentType)) {
      const error = new Error("Invoice must be a PDF, JPG, PNG, or WebP file.");
      error.status = 415;
      throw error;
    }

    if (!Number.isFinite(file.size) || file.size <= 0 || file.size > maxBytes) {
      const error = new Error("Invoice must be 15 MB or smaller.");
      error.status = 413;
      throw error;
    }

    const session = await http(
      `/projects/${projectId}/invoices/upload-session`,
      {
        method: "POST",
        body: {
          name: file.name,
          type: contentType,
          size: file.size,
          kind,
          invoiceId,
          invoice,
        },
      },
    );
    const token = session?.upload?.token;
    const chunkSize = Number(session?.upload?.chunkSize || 2 * 1024 * 1024);

    if (!token || !Number.isFinite(chunkSize) || chunkSize <= 0) {
      throw new Error("Invoice upload session could not be created.");
    }

    let offset = 0;

    while (offset < file.size) {
      const endExclusive = Math.min(offset + chunkSize, file.size);
      const chunk = file.slice(offset, endExclusive);
      const authToken = getToken();
      const headers = {
        "Content-Type": "application/octet-stream",
        "Content-Range": `bytes ${offset}-${endExclusive - 1}/${file.size}`,
        "X-Upload-Token": token,
      };

      if (authToken) headers.Authorization = `Bearer ${authToken}`;

      const response = await fetch(
        `${API_BASE}/projects/${projectId}/invoices/upload-chunk`,
        {
          method: "POST",
          credentials: "include",
          headers,
          body: chunk,
        },
      );
      const data = await readResponse(response);

      if (!response.ok) {
        throw errorFromResponse(data, response.status);
      }

      if (data?.complete && data?.invoice) {
        onProgress?.(100);
        return data;
      }

      const nextOffset = Number(data?.nextOffset || endExclusive);

      if (!Number.isFinite(nextOffset) || nextOffset <= offset || nextOffset > file.size) {
        throw new Error("Invoice upload did not advance. Please try again.");
      }

      offset = nextOffset;
      onProgress?.(Math.min(99, Math.round((offset / file.size) * 100)));
    }

    throw new Error("Invoice upload did not complete. Please try again.");
  },

  remove: (
    projectId,
    invoiceId,
  ) =>
    http(
      `/projects/${projectId}/invoices/${invoiceId}`,
      {
        method: "DELETE",
      },
    ),
};

/* ---------------------------------------------------------
   User profile

   Avatar upload is intentionally backend-mediated.

   This avoids the failing browser -> Google resumable PUT
   observed in production and keeps Google credentials and
   storage implementation completely server-side.

   Backend currently limits avatar uploads to 4 MB.
   --------------------------------------------------------- */

export const users = {
  me: () =>
    http("/users/me"),

  updateMe: (payload) =>
    http("/users/me", {
      method: "PATCH",
      body: payload,
    }),

  async uploadMyAvatar(
    file,
  ) {
    if (!file) {
      throw new Error(
        "Please select an image.",
      );
    }

    const allowedTypes =
      new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
      ]);

    if (
      !allowedTypes.has(
        file.type,
      )
    ) {
      const error =
        new Error(
          "Avatar must be a JPG, PNG, or WebP image.",
        );

      error.status = 415;

      throw error;
    }

    const maxBytes =
      4 * 1024 * 1024;

    if (
      !Number.isFinite(
        file.size,
      ) ||
      file.size <= 0 ||
      file.size >
        maxBytes
    ) {
      const error =
        new Error(
          "Avatar must be smaller than 4 MB.",
        );

      error.status = 413;

      throw error;
    }

    const formData =
      new FormData();

    formData.append(
      "avatar",
      file,
    );

    return multipart(
      "/users/me/avatar",
      formData,
      {
        method: "POST",
      },
    );
  },

  deleteMyAvatar: () =>
    http(
      "/users/me/avatar",
      {
        method: "DELETE",
      },
    ),
};

/* ---------------------------------------------------------
   Support
   --------------------------------------------------------- */

export const supportTickets = {
  list: () =>
    http("/support"),

  one: (ticketId) =>
    http(
      `/support/${ticketId}`,
    ),

  create: (payload) =>
    http("/support", {
      method: "POST",
      body: payload,
    }),

  reply: (
    ticketId,
    message,
  ) =>
    http(
      `/support/${ticketId}/replies`,
      {
        method: "POST",
        body: {
          message,
        },
      },
    ),

  updateStatus: (
    ticketId,
    status,
  ) =>
    http(
      `/support/${ticketId}`,
      {
        method: "PATCH",
        body: {
          status,
        },
      },
    ),
};

/* ---------------------------------------------------------
   Portal error messages
   --------------------------------------------------------- */

export function portalErrorMessage(
  error,
  resource = "resource",
) {
  if (
    error?.status === 403
  ) {
    return `You don't have access to this ${resource}.`;
  }

  if (
    error?.status === 404
  ) {
    const title =
      `${resource[0]?.toUpperCase() || "R"}${resource.slice(1)}`;

    return `${title} not found.`;
  }

  if (
    error?.status >= 500
  ) {
    return "Something went wrong. Please try again.";
  }

  return (
    error?.message ||
    "Something went wrong. Please try again."
  );
}
