import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useCallback, useMemo, useState } from "react";
import { Chat } from "./components/Chat";
import { ChatList } from "./components/ChatList";
import { Layout } from "./components/Layout";
import { NewGPT } from "./components/NewGPT";
import { Chat as ChatType, useChatList } from "./hooks/useChatList";
import { useConfigList } from "./hooks/useConfigList";
import { useSchemas } from "./hooks/useSchemas";
import { useStreamState } from "./hooks/useStreamState";
import { API_BASE_URL } from "./utils/config";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { configSchema } = useSchemas();
  const { chats, currentChat, enterChat } = useChatList();
  const { configs, enterConfig } = useConfigList();
  const { startStream, stopStream, stream } = useStreamState();

  const startTurn = useCallback(
    async (message: string, chat: ChatType | null = currentChat) => {
      if (!chat) return;
      const config = configs?.find(
        (c) => c.assistant_id === chat.assistant_id
      )?.config;
      if (!config) return;
      await startStream(
        {
          messages: [
            {
              content: message,
              additional_kwargs: {},
              type: "human",
              example: false,
            },
          ],
        },
        chat.assistant_id,
        chat.thread_id
      );
    },
    [currentChat, startStream, configs]
  );

  // const startChat = useCallback(
  //   async (message: string) => {
  //     if (!currentConfig) return;
  //     const chat = await createChat(message, currentConfig.assistant_id);
  //     return startTurn(message, chat);
  //   },
  //   [createChat, startTurn, currentConfig]
  // );

  const selectChat = useCallback(
    async (id: string | null) => {
      if (currentChat) {
        stopStream?.(true);
      }
      enterChat(id);
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
    },
    [enterChat, stopStream, sidebarOpen, currentChat]
  );
  console.log("API URL:", API_BASE_URL);

  const content = currentChat ? (
    <Chat
      chat={currentChat}
      startStream={startTurn}
      stopStream={stopStream}
      stream={stream}
    />
  ) : (
    <NewGPT />
  );

  const currentChatConfig = configs?.find(
    (c) => c.assistant_id === currentChat?.assistant_id
  );

  return (
    <Layout
      subtitle={
        currentChatConfig ? (
          <span className="inline-flex gap-1 items-center">
            {currentChatConfig.name}
            <InformationCircleIcon
              className="h-5 w-5 cursor-pointer text-indigo-600"
              onClick={() => {
                enterChat(null);
                enterConfig(currentChatConfig.assistant_id);
              }}
            />
          </span>
        ) : null
      }
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      sidebar={
        <ChatList
          chats={useMemo(() => {
            if (configs === null || chats === null) return null;
            return chats.filter((c) =>
              configs.some((config) => config.assistant_id === c.assistant_id)
            );
          }, [chats, configs])}
          currentChat={currentChat}
          enterChat={selectChat}
        />
      }
    >
      {configSchema ? content : null}
    </Layout>
  );
}

export default App;
