
import { mockRequest } from "./mockapi.js";

// Mock mode is ON by default.
// Change to false only when your backend is ready.
export const USE_MOCK_API =
  import.meta.env.VITE_USE_MOCK_API !== "false";

const BASE = import.meta.env.VITE_API_URL || "/api";

export const session = {
  get token() {
    return localStorage.getItem("kyros_token");
  },

  get user() {
    try {
      return JSON.parse(localStorage.getItem("kyros_user"));
    } catch {
      return null;
    }
  },

  save(token, user) {
    localStorage.setItem("kyros_token", token);
    localStorage.setItem("kyros_user", JSON.stringify(user));
  },

  clear() {
    localStorage.removeItem("kyros_token");
    localStorage.removeItem("kyros_user");
  },
};

async function request(path, { method = "GET", body } = {}) {
  // FRONTEND DEVELOPMENT MODE
  if (USE_MOCK_API) {
    return mockRequest(path, { method, body });
  }

  // REAL BACKEND MODE
  const isForm = body instanceof FormData;

  const res = await fetch(BASE + path, {
    method,
    headers: {
      ...(isForm || !body
        ? {}
        : { "Content-Type": "application/json" }),

      ...(session.token
        ? { Authorization: `Bearer ${session.token}` }
        : {}),
    },
    body: body
      ? isForm
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  if (res.status === 401) {
    session.clear();
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.message || `Request failed (${res.status})`
    );
  }

  return data;
}

export const api = {
  get: (path) => request(path),

  post: (path, body) =>
    request(path, {
      method: "POST",
      body,
    }),
};
