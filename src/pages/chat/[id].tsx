import {useGetChatDetail} from "~/hooks/useChat";
import {Layout} from "~/components/layout";
import {Loader} from "lucide-react";
import {ListChatConversation} from "~/components/list-chat-conversations";
import {ChatBox} from "~/components/chatbox";
import Image from "next/image";

const ChatId = () => {
  const {data, isLoading} = useGetChatDetail();

  return (
    <Layout>
      <div className="flex h-full w-full items-center justify-center">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="relative">
              <Loader className="h-6 w-6 animate-spin text-[#00FFA3]" />
              <div className="absolute inset-0 animate-ping rounded-full bg-[#00FFA3]/90 opacity-30" />
            </div>
          </div>
        ) : (
          <div className="relative w-full">
            <div className="absolute left-1/2 top-1/2 -z-[1] -translate-x-1/2 -translate-y-1/2 transform">
              <div className="h-80 w-64 overflow-hidden">
                <Image src="/img/logo-black.png" alt="logo-black" fill priority />
              </div>
            </div>
            <ListChatConversation data={data} />
          </div>
        )}
      </div>

      <div className="fixed bottom-5 left-[60%] flex w-full -translate-x-1/2 items-center justify-center">
        <ChatBox />
      </div>
    </Layout>
  );
};

export default ChatId;
