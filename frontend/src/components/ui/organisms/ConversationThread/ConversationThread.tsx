import { ChatBubble } from "../../molecules/ChatBubble";

import type { ConversationThreadProps } from "./ConversationThread.types";

export default function ConversationThread({
  messages,
}: ConversationThreadProps) {
  return (
    <section className="space-y-4">
      {messages.map((message, index) => (
        <ChatBubble
          key={`${message.sender}-${index}`}
          {...message}
        />
      ))}
    </section>
  );
}