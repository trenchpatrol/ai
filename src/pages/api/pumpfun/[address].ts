import axios from "axios";
import {NextApiRequest, NextApiResponse} from "next";
import {transformToCamelCase} from "transform-obj";

const getMetadataToken = async (address: string): Promise<PumpfunMetadataResponse> => {
  try {
    const {data} = await axios.get<PumpfunMetadataResponse>(
      `${process.env.PUMPFUN_API}/${address}?sync=true`,
    );
    return transformToCamelCase(data);
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw error;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PumpfunMetadataResponse | {error: string}>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({error: "Method Not Allowed"});
  }

  const {address} = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({error: "Invalid or missing address parameter"});
  }

  try {
    const metadata = await getMetadataToken(address);
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({error: "Failed to fetch token metadata"});
  }
}
