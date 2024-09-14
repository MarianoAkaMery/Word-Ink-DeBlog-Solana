import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../style/globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import WalletConnectProvider from "@/components/walletConnectProvider/WalletConnectProvider";
import { ThemeContextProvider } from "@/context/ThemeContext";
import ThemeProvider from "@/provider/ThemeProvider";

const roboto = Roboto({ weight: '400', subsets: ["latin"] });

export const metadata: Metadata = {
  title: "wordink.",
  description: "A Decentralized Publishing Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
      <WalletConnectProvider>
        <ThemeContextProvider>
          <ThemeProvider>
                <div className="container">
                  <Navbar />
                    {children}
                </div>
          </ThemeProvider>
        </ThemeContextProvider>
        </WalletConnectProvider>
      </body>
    </html>
  );
}
