
import { mockRequest } from "./mockapi.js";

// Live API mode is the default. Enable sample data explicitly with
// VITE_USE_MOCK_API=true when running without a configured backend.
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

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
    if (token) localStorage.setItem("kyros_token", token);
    if (user) localStorage.setItem("kyros_user", JSON.stringify(user));
  },

  clear() {
    localStorage.removeItem("kyros_token");
    localStorage.removeItem("kyros_user");
  },

  async getAccessToken() {
    if (USE_MOCK_API) return null;
    try {
      const { getFirebaseIdToken } = await import("./firebaseClient.js");
      const currentToken = await getFirebaseIdToken();
      if (currentToken) return currentToken;
    } catch (error) {
      if (error.message?.includes("Firebase web configuration")) throw error;
    }
    return this.token;
  },
};

async function request(path, { method = "GET", body } = {}) {
  // FRONTEND DEVELOPMENT MODE
  if (USE_MOCK_API) {
    return mockRequest(path, { method, body });
  }

  // REAL BACKEND MODE
  const isForm = body instanceof FormData;

  const token = await session.getAccessToken();
  const res = await fetch(BASE + path, {
    method,
    headers: {
      ...(isForm || !body
        ? {}
        : { "Content-Type": "application/json" }),

      ...(token
        ? { Authorization: `Bearer ${token}` }
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

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      payload?.message || `Request failed (${res.status})`
    );
  }

  return payload && Object.prototype.hasOwnProperty.call(payload, "data")
    ? payload.data
    : payload;
}

export const api = {
  get: (path) => request(path),

  post: (path, body) =>
    request(path, {
      method: "POST",
      body,
    }),

  patch: (path, body) =>
    request(path, {
      method: "PATCH",
      body,
    }),

  delete: (path) => request(path, { method: "DELETE" }),
};
