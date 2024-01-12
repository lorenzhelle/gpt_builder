import { useEffect, useState } from "react";
import { Message } from "./useChatList";
import { StreamState } from "./useStreamState";
import { API_BASE_URL } from "../utils/config";

async function getMessages(threadId: string) {
  const { messages } = await fetch(
    `${API_BASE_URL}/threads/${threadId}/messages`,
    {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    }
  ).then((r) => r.json());
  return messages;
}

export function useChatMessages(
  threadId: string | null,
  stream: StreamState | null
): Message[] | null {
  const [messages, setMessages] = useState<Message[] | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      if (threadId) {
        setMessages(await getMessages(threadId));
      }
    }

    fetchMessages();

    return () => {
      setMessages(null);
    };
  }, [threadId]);

  useEffect(() => {
    async function fetchMessages() {
      if (threadId) {
        setMessages(await getMessages(threadId));
      }
    }

    if (stream?.status !== "inflight") {
      fetchMessages();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream?.status]);

  return stream?.merge
    ? [...(messages ?? []), ...(stream.messages ?? [])]
    : stream?.messages ?? messages;
}
