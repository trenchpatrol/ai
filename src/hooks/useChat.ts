import {usePrivy} from "@privy-io/react-auth";
import {useMutation, UseMutationResult, useQuery} from "@tanstack/react-query";
import {useRouter} from "next/router";
import axios from "axios";
import {useSetAtom} from "jotai";
import {chatAtom} from "~/state/chat";
import {useQueryState} from "next-usequerystate";

type SendChatResponse = {
  chatId: string;
  assistantMessage: {
    role: "assistant";
    content: string;
  };
};

type SendChatVariables = {
  userId: string;
  chatId?: string;
  userMessage: string;
};

export const useGetChatHistory = () => {
  const {user} = usePrivy();
  const userId = user?.id;

  return useQuery<ChatListHistory, Error>({
    queryKey: ["get-chats", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await axios.get(`/api/chat-history?userId=${userId}`);
      return res.data;
    },
  });
};

export const useGetChatDetail = () => {
  const {user} = usePrivy();
  const [chatId] = useQueryState("id");

  const userId = user?.id;

  return useQuery<ChatHistoryDetail, Error>({
    queryKey: ["get-chat-detail", chatId],
    enabled: !!userId && !!chatId,
    queryFn: async () => {
      const res = await axios.get(
        `/api/chat/detail?userId=${userId}&chatId=${chatId?.split("?")[0]}`,
      );
      return res.data;
    },
  });
};

const sendChat = async ({
  userId,
  userMessage,
  chatId,
}: SendChatVariables): Promise<SendChatResponse> => {
  const getChatId = chatId ? chatId?.split("?")[0] : undefined;

  const response = await axios.post("/api/chat", {
    userId,
    userMessage,
    chatId: getChatId,
  });
  return response.data;
};

export const useSendChat = (): UseMutationResult<
  SendChatResponse,
  Error,
  Omit<SendChatVariables, "userId">
> => {
  const {user} = usePrivy();

  return useMutation<SendChatResponse, Error, Omit<SendChatVariables, "userId">>({
    mutationFn: (params) => sendChat({...params, userId: user?.id as string}),
  });
};
