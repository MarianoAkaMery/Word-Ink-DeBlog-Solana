"use client";

// imports methods relevant to the react framework
import { useMemo } from "react"; // library we use to interact with the solana json rpc api
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

const WalletConnectProvider = ({ children }: { children: React.ReactNode }) => {
  const network = WalletAdapterNetwork.Devnet;

  const wallets = useMemo(
    () => [new walletAdapterWallets.PhantomWalletAdapter()],
    [network, ConnectionProvider, WalletProvider]
  );

  return (
    <ConnectionProvider endpoint={'https://yolo-morning-yard.solana-devnet.quiknode.pro/0d90ab7feefcfce268e695b29e43f84ade7170af/'}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectProvider;
