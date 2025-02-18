import {UseMutationResult, useMutation} from "@tanstack/react-query";
import axios from "axios";

type SendAnalyzerVariables = {address: string};

const sendAnalyzer = async ({address}: SendAnalyzerVariables) => {
  const response = await axios.post("/api/antirugagent", {address});
  return response.data;
};

export const useSendAnalyzer = (): UseMutationResult<
  any,
  Error,
  SendAnalyzerVariables
> => {
  return useMutation<any, Error, SendAnalyzerVariables>({mutationFn: sendAnalyzer});
};
