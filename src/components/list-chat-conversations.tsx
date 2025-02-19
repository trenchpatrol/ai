import {usePrivy} from "@privy-io/react-auth";
import {useAtom, useAtomValue} from "jotai";
import {useEffect, useRef} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui";
import {cn} from "~/lib/utils";
import {chatAtom, isAgentThinkingAtom} from "~/state/chat";

export const ListChatConversation: React.FC<{messages: Message[]}> = ({messages}) => {
  const {user} = usePrivy();

  const [chatsState, setChatsState] = useAtom(chatAtom);

  useEffect(() => {
    if (messages) setChatsState(messages);

    return () => setChatsState(null);
  }, [messages]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isAgentThinking = useAtomValue(isAgentThinkingAtom);
  const chats = chatsState?.filter((c) => c.role !== "system");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chats]);

  const formatMessageText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div
      ref={scrollRef}
      className="z-[2] h-screen max-w-full overflow-y-auto px-4 pb-24 pt-7">
      {chats?.map((chat, index) => (
        <div
          key={index}
          className={`mb-3 flex items-start gap-2 ${
            chat.role === "user" ? "flex-row-reverse" : "flex-row"
          }`}>
          <div className="flex flex-col items-center">
            <Avatar className="mt-1">
              {user && (
                <AvatarImage
                  className="object-contain"
                  src={
                    chat.role === "user"
                      ? `https://api.dicebear.com/9.x/glass/svg?seed=${user.id}`
                      : "/img/logo.png"
                  }
                  alt={chat.role === "user" ? "User" : "TrenchPatrol Agent"}
                />
              )}
              <AvatarFallback>{chat.role === "user" ? "TP" : null}</AvatarFallback>
            </Avatar>
          </div>

          {chat.role !== "user" ? (
            <div className="mt-1 flex flex-col space-y-2">
              <span className="text-[14px] text-gray-400">TrenchPatrol Agent</span>
              <div
                className={cn(
                  "mt-1 max-w-[60%] whitespace-pre-wrap break-words rounded-lg p-3 text-base",
                  "border border-white/20 bg-[#1c1c1c]",
                )}>
                {formatMessageText(chat.content)}
              </div>
            </div>
          ) : (
            <div className="max-w-[50%] rounded-lg bg-green-500 p-3 text-base text-black">
              {formatMessageText(chat.content)}
            </div>
          )}
        </div>
      ))}
      {isAgentThinking && (
        <div className="mt-10 pb-10">
          <div className="flex items-center space-x-2">
            <Avatar className="mt-1">
              <AvatarImage
                className="object-contain"
                src="/img/logo.png"
                alt="TrenchPatrol Agent"
              />
            </Avatar>
            <div className="mt-1 flex flex-col space-y-1">
              <span className="text-xs text-gray-400">TrenchPatrol Agent</span>
              <div>Thinking...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
