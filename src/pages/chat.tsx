import {GetServerSideProps} from "next";
import {useGetChatDetail} from "~/hooks/useChat";
import {Layout} from "~/components/layout";
import {Loader} from "lucide-react";
import {ListChatConversation} from "~/components/list-chat-conversations";
import {ChatBox} from "~/components/chatbox";
import {useQueryState} from "next-usequerystate";
import {randomUUID} from "crypto";
import Image from "next/image";
import Head from "next/head";

import {MessageSquare, Sparkles, ShieldAlert} from "lucide-react";
import {useAtomValue} from "jotai";
import {isAgentThinkingAtom} from "~/state/chat";

type FeatureSectionProps = {
  icon: React.ReactNode;
  title: string;
  items: string[];
};

const FeatureSection: React.FC<FeatureSectionProps> = ({icon, title, items}) => {
  return (
    <div className="h-[320px] w-full max-w-xs rounded-2xl bg-zinc-900 p-6 shadow-lg">
      <div className="mb-4 flex items-center space-x-3">
        {icon}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="rounded-md bg-zinc-800 p-3 text-white">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Chat = () => {
  const {isLoading, data} = useGetChatDetail();
  const [type] = useQueryState("type");

  const isAgentThinking = useAtomValue(isAgentThinkingAtom);

  return (
    <Layout>
      <Head>
        <title>TrenchPatrol - Agent Terminal</title>
        <meta
          name="description"
          content="TrenchPatrol - Your AI Agent that can help you analyze coin in Solana trenches."
        />
      </Head>
      <div className="flex h-full w-full items-center justify-center">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="relative">
              <Loader className="h-6 w-6 animate-spin text-[#00FFA3]" />
              <div className="absolute inset-0 animate-ping rounded-full bg-[#00FFA3]/90 opacity-30" />
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full">
            {type === "current-chat" ? (
              <div className="absolute left-1/2 top-1/2 -z-[1] -translate-x-1/2 -translate-y-1/2 transform">
                <div className="h-80 w-64 overflow-hidden">
                  <Image src="/img/logo-black.png" alt="logo-black" fill priority />
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-5">
                <div className="">
                  <Image
                    src="/img/logo-full.png"
                    alt="logo-full"
                    priority
                    width={320}
                    height={200}
                  />
                </div>

                {!isAgentThinking && (
                  <div className="mt-16 w-full max-w-full">
                    <div className="flex w-full flex-col items-center justify-center gap-4 px-12 py-10 md:flex-row">
                      <FeatureSection
                        icon={<MessageSquare className="text-white" />}
                        title="Examples"
                        items={[
                          "Explain what is Solana?",
                          "Explain what is Bitcoin?",
                          "Explain what is Crypto?",
                        ]}
                      />
                      <FeatureSection
                        icon={<Sparkles className="text-white" />}
                        title="Capabilities"
                        items={[
                          "Remembers what user said earlier in the conversation.",
                          "Allows user to provide follow-up corrections.",
                          "Analyze token safety with CA",
                        ]}
                      />
                      <FeatureSection
                        icon={<ShieldAlert className="text-white" />}
                        title="Limitations"
                        items={[
                          "May occasionally generate incorrect information.",
                          "May occasionally produce biased and wrong content",
                        ]}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <ListChatConversation messages={data?.messages as Message[]} />
          </div>
        )}
      </div>

      <div className="fixed bottom-5 left-[58%] flex w-full -translate-x-1/2 items-center justify-center">
        <ChatBox />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl}) => {
  if (resolvedUrl === "/chat" || resolvedUrl === "/chat/") {
    const uuid = randomUUID();
    return {
      redirect: {
        destination: `/chat?id=${uuid}&type=new-chat`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Chat;
