import { apiClient } from "./apiClient";

export interface GetUsersParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const userService = {
  async getUsers(params: GetUsersParams) {
    const { data } = await apiClient.get("/users", { params });
    return data;
  },
  async updateUser(id: string, updates: Record<string, any>) {
    const { data } = await apiClient.patch(`/users/${id}`, updates);
    return data;
  },
  async deleteUser(id: string) {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
  }
};
