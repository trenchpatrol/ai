import {useMutation, UseMutationResult, useQuery} from "@tanstack/react-query";
import axios from "axios";

type GetChatParams = {
  userId: string;
};

type ChatHistory = {
  messages: Array<{role: string; content: string}>;
};

type SendChatResponse = {
  assistantMessage: {
    role: "assistant";
    content: string;
  };
};

type SendChatVariables = {
  userId: string;
  userMessage: string;
};

export const useGetChat = (params: GetChatParams) => {
  return useQuery<ChatHistory, Error>({
    queryKey: ["get-chats", params.userId],
    enabled: !!params.userId,
    queryFn: async () => {
      const res = await axios.get(`/api/chat-history?userId=${params.userId}`);
      return res.data;
    },
  });
};

const sendChat = async ({
  userId,
  userMessage,
}: SendChatVariables): Promise<SendChatResponse> => {
  const response = await axios.post("/api/chat", {userId, userMessage});
  return response.data;
};

export const useSendChat = (): UseMutationResult<
  SendChatResponse,
  Error,
  SendChatVariables
> => {
  return useMutation<SendChatResponse, Error, SendChatVariables>({mutationFn: sendChat});
};
