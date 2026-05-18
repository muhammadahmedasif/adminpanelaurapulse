/**
 * Admin API Client
 * ────────────────
 * Axios instance configured for the real backend via Next.js proxy.
 * Requests go to /backend/api/admin/* which Next.js rewrites to the backend.
 * This avoids browser CORS entirely — no cross-origin requests from the browser.
 * Uses adminAccessToken (separate from user accessToken).
 */

import axios from "axios";

// Use the Next.js rewrite proxy path (same-origin, no CORS issues)
// next.config.mjs rewrites /backend/:path* → BACKEND_URL/:path*
const BASE_PATH = "/backend/api/admin";

export const apiClient = axios.create({
  baseURL: BASE_PATH,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

// ── Request interceptor: attach admin JWT ─────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("adminAccessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 → redirect to login ──────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Don't redirect if already on login page
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("adminAccessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
