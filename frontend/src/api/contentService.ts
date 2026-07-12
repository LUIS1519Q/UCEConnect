import api from "./client";

import type { GetHelpResponse, GetAboutResponse } from "../types/content";

export const contentService = {
  async getHelp(): Promise<GetHelpResponse> {
    const response = await api.get<GetHelpResponse>("/help");
    return response.data;
  },

  async getAbout(): Promise<GetAboutResponse> {
    const response = await api.get<GetAboutResponse>("/about");
    return response.data;
  },
};