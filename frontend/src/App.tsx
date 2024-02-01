import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useCallback, useMemo, useState } from "react";
import { Chat } from "./components/Chat";
import { ChatList } from "./components/ChatList";
import { Layout } from "./components/Layout";
import { NewGPT } from "./components/NewGPT";
import { Chat as ChatType, useChatList } from "./hooks/useChatList";
import { Config, useConfigList } from "./hooks/useConfigList";
import { useSchemas } from "./hooks/useSchemas";
import { useStreamState } from "./hooks/useStreamState";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { configSchema } = useSchemas();
  const { chats, currentChat, enterChat, createChat, deselectChat } =
    useChatList();
  const { configs, enterConfig, currentConfig } = useConfigList();
  const { startStream, stopStream, stream } = useStreamState();

  const startTurn = useCallback(
    async (message: string, chat: ChatType | null = currentChat) => {
      if (!chat) return;
      const config = configs?.find(
        (c) => c.assistant_id === chat.assistant_id
      )?.config;
      if (!config) return;
      await startStream(
        [
          {
            content: message,
            additional_kwargs: {},
            type: "human",
            example: false,
          },
        ],
        chat.assistant_id,
        chat.thread_id
      );
    },
    [currentChat, startStream, configs]
  );

  const selectChat = useCallback(
    async (id: string | null) => {
      if (currentChat) {
        stopStream?.(true);
      }
      enterChat(id);
      if (!id) {
        enterConfig(configs?.[0]?.assistant_id ?? null);
        window.scrollTo({ top: 0 });
      }
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
    },
    [enterChat, stopStream, sidebarOpen, currentChat, enterConfig, configs]
  );

  const selectConfig = useCallback(
    (id: string | null) => {
      enterConfig(id);
      enterChat(null);
    },
    [enterConfig, enterChat]
  );

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
    // <NewChat
    //   startChat={noop}
    //   configSchema={configSchema}
    //   configDefaults={null}
    //   configs={configs}
    //   currentConfig={currentConfig}
    //   saveConfig={noop}
    //   enterConfig={selectConfig}
    // />
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

  return (
    <Layout
      subtitle={
        currentChatConfig ? (
          <span className="inline-flex gap-1 items-center">
            {currentChatConfig.name}
            <InformationCircleIcon
              className="h-5 w-5 cursor-pointer text-indigo-600"
              onClick={() => {
                selectConfig(currentChatConfig.assistant_id);
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
          currentConfig={currentConfig}
          enterConfig={selectConfig}
        />
      }
    >
      {configSchema ? content : null}
    </Layout>
  );
}

export default App;
