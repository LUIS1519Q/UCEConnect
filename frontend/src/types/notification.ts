export type NotificationType =
  | "incident_created"
  | "status_updated"
  | "manager_request"
  | "student_reply";

export interface AppNotification {
  id: number;
  type: NotificationType;
  incidentId: number;
  ticket: string;
  title: string;
  read: boolean;
  createdAt: string;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  unread?: boolean;
}

export interface GetNotificationsResponse {
  data: AppNotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}