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
  // we specify which wallets we want our wallet adapter to support
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new walletAdapterWallets.PhantomWalletAdapter()],
    [network,ConnectionProvider, WalletProvider]
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
