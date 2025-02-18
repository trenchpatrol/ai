import axios, {AxiosError} from "axios";
import {NextApiRequest, NextApiResponse} from "next";
import {transformToCamelCase} from "transform-obj";

const API_URL = `${process.env.ANTIRUGAGENT_API}/prod`;

const headers = {
  "Content-Type": "application/json",
} as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AntiRugAgentResponse | any>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }

  const {address} = req.body;

  if (!address) {
    return res.status(400).json({error: "Address is required"});
  }

  try {
    const responseCheckTokenInfo = await axios.post<{checkCA: TokenInfo}>(
      API_URL + "/get-token-info",
      {ca: address},
      {headers},
    );

    const responseAnalyzeTokenInfo = await axios.post<AnalyzeScore>(
      API_URL + "/check-ca-v2",
      {ca: address},
      {headers},
    );

    const returnResponse = {
      ...responseCheckTokenInfo.data,
      analyze: {...responseAnalyzeTokenInfo.data},
    };

    return res.status(200).json(transformToCamelCase(returnResponse));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        return res.status(axiosError.response.status).json({
          error: "API Error",
          details: axiosError.response.data,
        });
      } else if (axiosError.request) {
        return res.status(503).json({
          error: "Service unavailable",
          details: "No response received from API",
        });
      }
    }

    console.error("Unexpected error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}
