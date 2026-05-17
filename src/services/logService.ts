import { apiClient } from "./apiClient";

export interface GetLogsParams {
  category?: string;
  severity?: string;
  page?: number;
  limit?: number;
}

export const logService = {
  async getLogs(params: GetLogsParams) {
    const { data } = await apiClient.get("/logs", { params });
    return data;
  }
};
