"use client"
import Link from "next/link";
import Links from "./links/Links";
import styles from "./navbar.module.css";
import dynamic from "next/dynamic";
import ThemeToggle from "../themetoggle/themeToggle";
import '../../style/wallet.css';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const Navbar = () => {
    return (
        <div className={styles.container}>
            {/*left*/}
            <div className={styles.left}>
                <Link href="/" className={styles.logo}>wordink.</Link>

            </div>

            {/*center*/}
            <div className={styles.center}>

                <div className={styles.navItems}>
                    <div className={styles.navLinks}>
                        <Links />
                    </div>
                </div>
            </div>
            <div className={styles.right}>

                <div className={styles.rightItems}>
                    <div className={styles.toggle}>
                        <ThemeToggle />
                    </div>
                    {/*right*/}
                    <div className={styles.walletButtonContainer}>
                        <WalletMultiButtonDynamic className={styles.wallet} />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Navbar;