export type AuthorRole = "student" | "manager";

export interface Observation {
  id: number;
  authorId: number;
  authorName: string;
  authorRole: AuthorRole;
  message: string;
  createdAt: string;
}

export interface GetObservationsResponse {
  observations: Observation[];
}

export interface ConversationLoadedPayload {
  conversationEnabled: boolean;
  messages: Observation[];
  locked?: boolean;
  status?: string;
}

export interface NewMessagePayload extends Observation {
  incidentId: number;
}

export interface ConversationLockedPayload {
  status: string;
  message: string;
}

export interface ChatErrorPayload {
  message: string;
  event?: string;
}