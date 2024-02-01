import { Chat as ChatType } from "../hooks/useChatList";
import { useChatMessages } from "../hooks/useChatMessages";
import { StreamStateProps } from "../hooks/useStreamState";
import { Message } from "./Message";
import TypingBox from "./TypingBox";

interface ChatProps extends Pick<StreamStateProps, "stream" | "stopStream"> {
  assistantId: string;
  threadId: string | null;
  startStream: (message: string, chat?: ChatType | null) => Promise<void>;
  createChat: (message: string, assistantId: string) => Promise<ChatType>;
}

// function usePrevious<T>(value: T): T | undefined {
//   const ref = useRef<T>();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }

export function Chat(props: ChatProps) {
  const messages = useChatMessages(props.threadId, props.stream);

  const startChat = async (message: string) => {
    if (!props.assistantId) return;
    const chat = await props.createChat(message, props.assistantId);
    return props.startStream(message, chat);
  };

  const handleMessageSubmit = (message: string) => {
    if (props.threadId) {
      // Send message to existing chat
      return props.startStream(message);
    } else {
      // Create new chat
      return startChat(message);
    }
  };

  // useEffect(() => {
  //   scrollTo({
  //     top: document.body.scrollHeight,
  //     behavior:
  //       prevMessages && prevMessages?.length === messages?.length
  //         ? "smooth"
  //         : undefined,
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [messages]);

  return (
    <div className="flex-1 flex flex-col items-stretch pb-[76px] pt-2">
      {messages?.map((msg, i) => (
        <Message
          {...msg}
          key={i}
          runId={
            i === messages.length - 1 && props.stream?.status === "done"
              ? props.stream?.run_id
              : undefined
          }
        />
      ))}
      {(props.stream?.status === "inflight" || messages === null) && (
        <div className="leading-6 mb-2 animate-pulse font-black text-gray-400 text-lg">
          ...
        </div>
      )}
      {props.stream?.status === "error" && (
        <div className="flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          An error has occurred. Please try again.
        </div>
      )}
      <div className="fixed left-0 lg:left-72 bottom-0 right-0 p-4">
        <TypingBox
          onSubmit={handleMessageSubmit}
          disabled={props.stream?.status === "inflight"}
        />
      </div>
    </div>
  );
}
