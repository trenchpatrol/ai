import {usePrivy} from "@privy-io/react-auth";
import {useAtom, useAtomValue} from "jotai";
import {useEffect, useRef, useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui";
import {cn} from "~/lib/utils";
import {chatAtom, isAgentThinkingAtom, isAgentWritingResponseAtom} from "~/state/chat";
import {Share2} from "lucide-react";

import {useCallback} from "react";

interface ButtonShareToXProps {
  title?: string;
  text?: string;
  url?: string;
}

const ButtonShareToX: React.FC<ButtonShareToXProps> = ({
  title = "Check out this cool web3 project \n",
  text,
}) => {
  const handleShare = useCallback(() => {
    // Construct the sharing URL with proper intent parameters
    const shareUrl = new URL("https://x.com/intent/tweet");

    // Add query parameters
    if (text) shareUrl.searchParams.append("text", text);
    if (title) shareUrl.searchParams.append("title", title);

    // Open in a new tab/window
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  }, [title, text]);

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share to X"
      className="mt-2 flex items-center justify-center space-x-2 rounded-lg border border-white/20 bg-[#1c1c1c] p-2 transition-colors duration-200 hover:bg-[#2a2a2a]">
      <Share2 size={20} />
      <p>Share to</p>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          fill="#fff"
          width="20"
          height="20"
          viewBox="0 0 50 50">
          <path d="M 11 4 C 7.1456661 4 4 7.1456661 4 11 L 4 39 C 4 42.854334 7.1456661 46 11 46 L 39 46 C 42.854334 46 46 42.854334 46 39 L 46 11 C 46 7.1456661 42.854334 4 39 4 L 11 4 z M 11 6 L 39 6 C 41.773666 6 44 8.2263339 44 11 L 44 39 C 44 41.773666 41.773666 44 39 44 L 11 44 C 8.2263339 44 6 41.773666 6 39 L 6 11 C 6 8.2263339 8.2263339 6 11 6 z M 13.085938 13 L 22.308594 26.103516 L 13 37 L 15.5 37 L 23.4375 27.707031 L 29.976562 37 L 37.914062 37 L 27.789062 22.613281 L 36 13 L 33.5 13 L 26.660156 21.009766 L 21.023438 13 L 13.085938 13 z M 16.914062 15 L 19.978516 15 L 34.085938 35 L 31.021484 35 L 16.914062 15 z"></path>
        </svg>
      </div>
    </button>
  );
};

export const ListChatConversation: React.FC<{messages: Message[]}> = ({messages}) => {
  const {user} = usePrivy();

  const [typingProgress, setTypingProgress] = useState(0);
  const [chatsState, setChatsState] = useAtom(chatAtom);
  const [isAgentWriting, setIsAgentWriting] = useAtom(isAgentWritingResponseAtom);

  const isAgentThinking = useAtomValue(isAgentThinkingAtom);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chats = chatsState?.filter((c) => c.role !== "system");

  const lastMessage = chats?.[chats.length - 1];

  useEffect(() => {
    if (messages) setChatsState(messages);

    return () => setChatsState(null);
  }, [messages]);

  useEffect(() => {
    if (isAgentWriting && lastMessage) {
      setTypingProgress(0);

      const interval = setInterval(() => {
        setTypingProgress((prev) => {
          if (prev < lastMessage.content.length) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setIsAgentWriting(false);
            return prev;
          }
        });
      }, 10);

      return () => clearInterval(interval);
    }
  }, [isAgentWriting, lastMessage, setIsAgentWriting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chats, typingProgress]);

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
            <div>
              <div className="mt-1 flex w-4/5 flex-col space-y-2">
                <span className="text-[14px] text-gray-400">TrenchPatrol Agent</span>
                <div
                  className={cn(
                    "mt-1 max-w-[60%] whitespace-pre-wrap break-words rounded-lg p-3 text-base",
                    "border border-white/20 bg-[#1c1c1c]",
                  )}>
                  {formatMessageText(
                    index === chats.length - 1 && isAgentWriting
                      ? (lastMessage?.content.substring(0, typingProgress) as string)
                      : chat.content,
                  )}
                </div>
              </div>
              <ButtonShareToX text={chat.content} />
            </div>
          ) : (
            <div className="max-w-[50%] rounded-lg bg-[#00FFA3] p-3 text-base text-black">
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
              <span className="text-[14px] text-gray-400">TrenchPatrol Agent</span>
              <div>Thinking...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
