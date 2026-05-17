/**
 * Admin API Client
 * ────────────────
 * Axios instance configured for the real backend.
 * Uses adminAccessToken (separate from user accessToken).
 * Includes JWT interceptor and error handling.
 */

import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api/admin`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
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
