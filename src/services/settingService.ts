import { apiClient } from "./apiClient";

export const settingService = {
  async getSettings() {
    const { data } = await apiClient.get("/settings");
    return data;
  },
  async updateSettings(updates: Record<string, any>) {
    const { data } = await apiClient.patch("/settings", updates);
    return data;
  }
};
