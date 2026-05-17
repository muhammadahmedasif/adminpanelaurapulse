import { apiClient } from "./apiClient";

export const emergencyService = {
  async getEmergencyData() {
    const { data } = await apiClient.get("/emergency");
    return data;
  },
  async toggleGlobalEmergency() {
    const { data } = await apiClient.post("/emergency/toggle");
    return data;
  }
};
