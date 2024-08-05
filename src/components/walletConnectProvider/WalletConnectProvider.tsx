"use client";

// imports methods relevant to the react framework
import { useMemo } from "react"; // library we use to interact with the solana json rpc api
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

const WalletConnectProvider = ({ children }: { children: React.ReactNode }) => {
  const network = WalletAdapterNetwork.Devnet;
  // Replace with your custom RPC URL
  const customRpcUrl = "https://devnet.helius-rpc.com/?api-key=466d756e-98f1-45ed-8ee9-09fb5346eb06";
  const endpoint = useMemo(() => customRpcUrl, [network]); // Use custom RPC URL

  const wallets = useMemo(
    () => [new walletAdapterWallets.PhantomWalletAdapter()],
    [network, ConnectionProvider, WalletProvider]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectProvider;
