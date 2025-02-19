import "~/styles/globals.css";
import type {AppProps} from "next/app";
import {PrivyProvider} from "@privy-io/react-auth";
import {Provider as JotaiProvider} from "jotai";
import {toSolanaWalletConnectors} from "@privy-io/react-auth/solana";
import Clarity from "@microsoft/clarity";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {useRef} from "react";

if (process.env.NODE_ENV === "production") {
  Clarity.init("qca5gan1q3");
}

export default function App({Component, pageProps}: AppProps) {
  const queryClientRef = useRef<QueryClient | null>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 0,
          refetchOnWindowFocus: process.env.NODE_ENV === "production",
        },
      },
    });
  }

  const solanaConnectors = toSolanaWalletConnectors({});

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
      <PrivyProvider
        appId="cm78xp5gj01bge4zn7eq813yw"
        config={{
          externalWallets: {
            solana: {connectors: solanaConnectors},
            walletConnect: {enabled: false},
          },
          appearance: {theme: "dark", walletList: ["phantom", "backpack", "solflare"]},
          solanaClusters: [
            {
              name: "mainnet-beta",
              rpcUrl: "https://api.mainnet-beta.solana.com",
            },
          ],
        }}>
        <JotaiProvider>
          <Component {...pageProps} />
        </JotaiProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}
