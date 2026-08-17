// src/lib/apiReliability.js

const INSTALL_KEY =
  "__msp_api_reliability__";

const LEGACY_ORIGIN =
  "https://mspixelpulse-backend.vercel.app";

const CANONICAL_ORIGIN =
  "https://api.mspixelpulse.com";

const TRANSIENT_STATUS =
  new Set([
    408,
    425,
    429,
    500,
    502,
    503,
    504,
  ]);

const inFlight =
  new Map();

function normalizeUrl(input) {
  const url =
    input instanceof Request
      ? input.url
      : String(input);

  if (
    url.startsWith(
      `${LEGACY_ORIGIN}/api`,
    )
  ) {
    return url.replace(
      LEGACY_ORIGIN,
      CANONICAL_ORIGIN,
    );
  }

  return url;
}

function methodOf(
  input,
  init,
) {
  return String(
    init?.method ||
      (
        input instanceof Request
          ? input.method
          : "GET"
      ) ||
      "GET",
  ).toUpperCase();
}

function isMSPixelPulseApi(
  url,
) {
  return (
    url.startsWith(
      `${CANONICAL_ORIGIN}/api`,
    ) ||
    url.startsWith(
      "http://localhost:4000/api",
    ) ||
    url.startsWith(
      "http://localhost:5000/api",
    )
  );
}

function sleep(ms) {
  return new Promise(
    (resolve) =>
      window.setTimeout(
        resolve,
        ms,
      ),
  );
}

function retryDelay(
  attempt,
  response,
) {
  const retryAfter =
    Number(
      response?.headers?.get?.(
        "retry-after",
      ),
    );

  if (
    Number.isFinite(
      retryAfter,
    ) &&
    retryAfter > 0
  ) {
    return Math.min(
      retryAfter * 1000,
      4000,
    );
  }

  return (
    300 *
      2 ** attempt +
    Math.floor(
      Math.random() *
        180,
    )
  );
}

async function oneAttempt(
  nativeFetch,
  url,
  input,
  init,
) {
  const controller =
    new AbortController();

  const upstreamSignal =
    init?.signal ||
    (
      input instanceof Request
        ? input.signal
        : undefined
    );

  const abort =
    () =>
      controller.abort();

  if (upstreamSignal) {
    if (
      upstreamSignal.aborted
    ) {
      controller.abort();
    } else {
      upstreamSignal.addEventListener(
        "abort",
        abort,
        {
          once: true,
        },
      );
    }
  }

  const timeout =
    window.setTimeout(
      () =>
        controller.abort(),
      12_000,
    );

  try {
    const nextInit = {
      ...init,
      signal:
        controller.signal,
    };

    if (
      input instanceof Request
    ) {
      return nativeFetch(
        new Request(
          url,
          input,
        ),
        nextInit,
      );
    }

    return nativeFetch(
      url,
      nextInit,
    );
  } finally {
    window.clearTimeout(
      timeout,
    );

    upstreamSignal
      ?.removeEventListener?.(
        "abort",
        abort,
      );
  }
}

async function resilientGet(
  nativeFetch,
  url,
  input,
  init,
) {
  let lastError;

  for (
    let attempt = 0;
    attempt < 2;
    attempt += 1
  ) {
    try {
      const response =
        await oneAttempt(
          nativeFetch,
          url,
          input,
          {
            ...init,
            cache:
              init?.cache ||
              "no-store",
          },
        );

      if (
        !TRANSIENT_STATUS.has(
          response.status,
        ) ||
        attempt === 1
      ) {
        return response;
      }

      await sleep(
        retryDelay(
          attempt,
          response,
        ),
      );
    } catch (error) {
      lastError = error;

      /*
       * Caller/user cancellation should not be retried.
       */
      if (
        error?.name ===
        "AbortError" ||
        attempt === 1
      ) {
        throw error;
      }

      await sleep(
        retryDelay(
          attempt,
        ),
      );
    }
  }

  throw (
    lastError ||
    new Error(
      "Request failed",
    )
  );
}

export function installApiReliability() {
  if (
    typeof window ===
      "undefined" ||
    window[INSTALL_KEY]
  ) {
    return;
  }

  const nativeFetch =
    window.fetch.bind(
      window,
    );

  window.fetch =
    async function reliableFetch(
      input,
      init,
    ) {
      const url =
        normalizeUrl(
          input,
        );

      const method =
        methodOf(
          input,
          init,
        );

      /*
       * Never automatically retry writes.
       *
       * A POST/PATCH/DELETE retry could create duplicate
       * messages, invoices, users or project mutations.
       */
      if (
        !isMSPixelPulseApi(
          url,
        ) ||
        ![
          "GET",
          "HEAD",
        ].includes(method)
      ) {
        if (
          input instanceof Request
        ) {
          return nativeFetch(
            new Request(
              url,
              input,
            ),
            init,
          );
        }

        return nativeFetch(
          url,
          init,
        );
      }

      const key =
        `${method}:${url}`;

      let request =
        inFlight.get(
          key,
        );

      if (!request) {
        request =
          resilientGet(
            nativeFetch,
            url,
            input,
            init,
          ).finally(
            () => {
              inFlight.delete(
                key,
              );
            },
          );

        inFlight.set(
          key,
          request,
        );
      }

      /*
       * Multiple React components may await the same GET.
       * Each receives its own Response clone.
       */
      const response =
        await request;

      return response.clone();
    };

  window[INSTALL_KEY] =
    true;
}