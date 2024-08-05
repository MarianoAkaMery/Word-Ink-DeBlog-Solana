import React from "react";
import styles from "./accountElement.module.css";
import Link from "next/link";

interface Account {
  authorAddress: string;
  username: string;
}

const AccountElement: React.FC<{ account: Account }> = ({ account }) => {
  return (
    <Link href={`/profile/${account.authorAddress}`} passHref>
      <div className={styles.container}>
        <div className={styles.details}>
          <span className={styles.username}>{account.username}</span> {/* Display the username */}
          <span className={styles.author}>
            {account.authorAddress.slice(0, 4)}...{account.authorAddress.slice(-4)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AccountElement;
