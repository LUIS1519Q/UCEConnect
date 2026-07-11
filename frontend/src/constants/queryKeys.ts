import type {
  GetIncidentsParams,
} from "../types/incident";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },

  incidents: {
    all: ["incidents"] as const,

    list: (filters?: GetIncidentsParams) =>
      [...queryKeys.incidents.all, "list", filters] as const,

    detail: (id: number | string) =>
      [...queryKeys.incidents.all, "detail", id] as const,

    similar: (
      title: string,
      description?: string
    ) =>
      [
        ...queryKeys.incidents.all,
        "similar",
        title,
        description,
      ] as const,

    similarDetail: (id: number) =>
      [
        ...queryKeys.incidents.all,
        "similar-detail",
        id,
      ] as const,
  },

  notifications: {
    all: ["notifications"] as const,

    list: () =>
      [...queryKeys.notifications.all, "list"] as const,
  },

  profile: {
    me: ["profile", "me"] as const,
  },
} as const;