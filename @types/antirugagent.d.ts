interface TokenHolder {
  address: string;
  usd: number;
  percentage: number;
}

interface TokenInfo {
  name: string;
  symbol: string;
  ca: string;
  creator: string;
  createTx: string;
  image: string;
  description: string;
  createdTime: number;
  ageDays: number;
  age: string;
  x: string;
  tg: string;
  website: string;
  dex: string;
  mintUrl: string;
  liq: number | null;
  liqStr: string | null;
  mintAuthDisabled: boolean;
  lpBurnt: boolean | null;
  mc: number;
  mcStr: string;
  freeze: boolean;
  topTenPer: number;
  topTenAmount: number;
  topTenAmountStr: string;
  topIndvPer: number;
  topIndvAmount: number;
  topIndvAmountStr: string;
  totalWallets: number;
  topTenHolders: TokenHolder[];
}

interface AnalyzeScore {
  score: number;
  message: string;
}

interface AntiRugAgentResponse {
  checkCA: TokenInfo;
  analyze: AnalyzeScore;
}
