import { apiClient } from "./apiClient";

export const authService = {
  async login(credentials: Record<string, string>) {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data;
  },
  async logout() {
    const { data } = await apiClient.post("/auth/logout");
    return data;
  },
  async me() {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },
  async updateProfile(name: string) {
    const { data } = await apiClient.post("/auth/me", { name });
    return data;
  }
};
