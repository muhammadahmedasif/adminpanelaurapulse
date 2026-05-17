import { apiClient } from "./apiClient";

export interface GetSessionsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const sessionService = {
  async getSessions(params: GetSessionsParams) {
    const { data } = await apiClient.get("/sessions", { params });
    return data;
  },
  async flagSession(id: string) {
    const { data } = await apiClient.post(`/sessions/${id}/flag`);
    return data;
  }
};
