import api from "./client";

import type {
  GetNotificationsParams,
  GetNotificationsResponse,
} from "../types/notification";

export const notificationService = {
  async getNotifications(
    params?: GetNotificationsParams
  ): Promise<GetNotificationsResponse> {

    const query = new URLSearchParams();

    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.unread) query.append("unread", String(params.unread));

    const response = await api.get<GetNotificationsResponse>(
      `/api/v1/notifications${query.toString() ? `?${query.toString()}` : ""}`
    );

    return response.data;
  },

  async markAsRead(id: number): Promise<{ message: string }> {
    const response = await api.patch<{ message: string }>(
      `/api/v1/notifications/${id}/read`
    );

    return response.data;
  },
};