export type ChatSender =
  | "student"
  | "manager";

export interface ChatBubbleProps {
  sender: string;
  senderType: ChatSender;
  message: string;
  timestamp: string;
}