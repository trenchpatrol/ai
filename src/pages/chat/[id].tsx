import {useState} from "react";
import {useGetChatDetail, useSendChat} from "~/hooks/useChat";
import {useQueryClient} from "@tanstack/react-query";
import {Layout} from "~/components/layout";
import Image from "next/image";
import {Loader} from "lucide-react";

const ChatId = () => {
  const [message, setMessage] = useState("");

  const {data, isLoading} = useGetChatDetail();
  const sendChat = useSendChat();
  const qc = useQueryClient();

  const onStartChat = () => {
    setMessage("");

    sendChat.mutateAsync(
      {userMessage: message},
      {
        onSuccess: () => {
          qc.invalidateQueries({queryKey: ["get-chats"]});
        },
      },
    );
  };

  return (
    <Layout>
      <div className="flex h-full w-full items-center justify-center">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="relative">
              <Loader className="h-6 w-6 animate-spin text-[#00FFA3]" />
              <div className="absolute inset-0 animate-ping rounded-full bg-[#00FFA3]/90 opacity-30"></div>
            </div>
          </div>
        ) : (
          data?.messages.length === 0 && (
            <div>
              <Image
                style={{width: "220px", height: "270px"}}
                src="/img/logo-black.png"
                alt="logo-black"
                width={220}
                height={270}
                priority
              />
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export default ChatId;
