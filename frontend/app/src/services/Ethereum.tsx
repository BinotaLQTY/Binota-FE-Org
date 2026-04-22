"use client";

import type { ReactNode } from "react";

import content from "@/src/content";
import {
  CHAIN_BLOCK_EXPLORER,
  CHAIN_CONTRACT_ENS_REGISTRY,
  CHAIN_CONTRACT_ENS_RESOLVER,
  CHAIN_CONTRACT_MULTICALL,
  CHAIN_CURRENCY,
  CHAIN_ID,
  CHAIN_NAME,
  CHAIN_RPC_URL,
  WALLET_CONNECT_PROJECT_ID,
} from "@/src/env";
import { CHAIN_RPC_URLS } from "@/src/hub-utils";
import { blo } from "blo";
import { ConnectKitProvider, getDefaultConfig as getDefaultConfigFromConnectKit } from "connectkit";
import Image from "next/image";
import type { Chain } from "viem";
import { arbitrum, base, bsc, mainnet } from "viem/chains";
import { createConfig, http, WagmiProvider } from "wagmi";

// Primary chain from environment config
const primaryChain: Chain = {
  id: CHAIN_ID,
  name: CHAIN_NAME,
  nativeCurrency: CHAIN_CURRENCY,
  rpcUrls: {
    default: { http: [CHAIN_RPC_URL] },
  },
  blockExplorers: CHAIN_BLOCK_EXPLORER ? { default: CHAIN_BLOCK_EXPLORER } : undefined,
  contracts: {
    ensRegistry: CHAIN_CONTRACT_ENS_REGISTRY ?? undefined,
    ensUniversalResolver: CHAIN_CONTRACT_ENS_RESOLVER ?? undefined,
    multicall3: { address: CHAIN_CONTRACT_MULTICALL },
  },
};

// Hub chains for cross-chain bridge functionality
const hubChains: Chain[] = [mainnet, arbitrum, base, bsc];

// All chains: primary chain + hub chains (excluding duplicates)
const allChains: [Chain, ...Chain[]] = [
  primaryChain,
  ...hubChains.filter((c) => c.id !== CHAIN_ID),
];

export const wagmiConfig = createConfig(
  getDefaultConfigFromConnectKit({
    appName: content.appName,
    appDescription: content.appDescription,
    appUrl: content.appUrl,
    appIcon: content.appIcon,
    chains: allChains,
    enableFamily: false,
    ssr: true,
    transports: {
      [CHAIN_ID]: http(CHAIN_RPC_URL),
      [mainnet.id]: http(CHAIN_RPC_URLS[1]),
      [arbitrum.id]: http(CHAIN_RPC_URLS[42161]),
      [base.id]: http(CHAIN_RPC_URLS[8453]),
      [bsc.id]: http(CHAIN_RPC_URLS[56]),
    },
    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
  }),
);

export function Ethereum({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <ConnectKitProvider
        mode="light"
        options={{
          avoidLayoutShift: true,
          customAvatar: ({ address, size }) => (
            address && (
              <Image
                alt={address}
                src={blo(address)}
                width={size}
                height={size}
              />
            )
          ),
          embedGoogleFonts: false,
          hideBalance: true,
          hideQuestionMarkCTA: true,
          hideRecentBadge: true,
          language: "en-US",
          overlayBlur: 0,
          reducedMotion: true,
          walletConnectCTA: "link",
          walletConnectName: "WalletConnect",
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiProvider>
  );
}
