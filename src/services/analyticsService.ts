import { apiClient } from "./apiClient";

export const analyticsService = {
  async getAnalytics() {
    const { data } = await apiClient.get("/analytics");
    return data;
  }
};
