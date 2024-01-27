import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useCallback, useMemo, useState } from "react";
import { Chat } from "./components/Chat";
import { ChatList } from "./components/ChatList";
import { Layout } from "./components/Layout";
import { Chat as ChatType, useChatList } from "./hooks/useChatList";
import { Config, useConfigList } from "./hooks/useConfigList";
import { useSchemas } from "./hooks/useSchemas";
import { useStreamState } from "./hooks/useStreamState";
import { API_BASE_URL } from "./utils/config";
import { NewGPT } from "./components/NewGPT";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { configSchema } = useSchemas();
  const { chats, currentChat, enterChat, createChat, deselectChat } =
    useChatList();
  const { configs, enterConfig, currentConfig } = useConfigList();
  const { startStream, stopStream, stream } = useStreamState();

  console.log("currentChat:", currentChat);
  console.log("chats:", chats);

  const startTurn = useCallback(
    async (message: string, chat: ChatType | null = currentChat) => {
      console.log("startTurn:", message, chat);
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

  const startChat = useCallback(
    async (message: string) => {
      if (!currentConfig) return;
      const chat = await createChat(message, currentConfig.assistant_id);
      return startTurn(message, chat);
    },
    [createChat, startTurn, currentConfig]
  );

  console.log("currentConfig:", currentConfig);

  const selectChat = useCallback(
    async (id: string | null) => {
      console.log("selectChat:", id);
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
  console.log("currentChat:", currentChat);

  const content = currentChat ? (
    <Chat
      assistantId={currentChat.assistant_id}
      threadId={currentChat.thread_id}
      startStream={startTurn}
      stopStream={stopStream}
      createChat={(message, assistantId) => createChat(message, assistantId)}
      stream={stream}
    />
  ) : currentConfig !== null ? (
    // Create new chat
    <Chat
      createChat={(message, assistantId) => createChat(message, assistantId)}
      assistantId={currentConfig.assistant_id}
      threadId={null}
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

  const selectGPT = (gpt: Config) => {
    enterConfig(gpt.assistant_id);

    // if current chat is not of this config, deselect it
    if (currentChat?.assistant_id !== gpt.assistant_id) {
      deselectChat();
    }
  };

  console.log("currentChatConfig:", currentChatConfig);

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
      gpts={configs || []}
      onSelectGPT={selectGPT}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      sidebar={
        <ChatList
          chats={useMemo(() => {
            if (currentConfig === null || chats === null) return null;

            // only show chats of current config
            if (currentConfig) {
              return chats.filter(
                (c) => c.assistant_id === currentConfig.assistant_id
              );
            } else {
              return [];
            }
          }, [chats, currentConfig])}
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
