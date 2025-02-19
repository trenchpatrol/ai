import {usePrivy} from "@privy-io/react-auth";
import {useQueryClient} from "@tanstack/react-query";
import {Send} from "lucide-react";
import {useRouter} from "next/router";
import {useState, useRef, useEffect} from "react";
import {useSendChat} from "~/hooks/useChat";

export const ChatBox = () => {
  const {authenticated, login} = usePrivy();
  const {replace, query} = useRouter();

  const [message, setMessage] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const sendChat = useSendChat();
  const qc = useQueryClient();

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "40px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const onStartChat = () => {
    if (!authenticated) return login();

    setMessage("");
    return sendChat.mutateAsync(
      {userMessage: message, chatId: query.id as string},
      {
        onSuccess: (data) => {
          qc.invalidateQueries({queryKey: ["get-chats"]});

          if (data.chatId) {
            qc.invalidateQueries({queryKey: ["get-chat-detail", query.id]});
            replace(`/chat/${data.chatId}`);
          }
        },
      },
    );
  };

  return (
    <div className="flex w-full max-w-3xl items-start justify-center rounded-xl border border-white/10 bg-[#1C1C1C] p-3">
      <textarea
        ref={textAreaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
        className="flex-1 resize-none overflow-y-auto rounded-lg bg-[#151313] px-4 py-2 text-gray-300 placeholder-gray-500 outline-none"
        rows={1}
        style={{minHeight: "40px"}}
      />
      <button className="p-2 text-gray-400 hover:text-white" onClick={onStartChat}>
        <Send size={20} />
      </button>
    </div>
  );
};
