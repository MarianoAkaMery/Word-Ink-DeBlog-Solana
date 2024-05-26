"use client";

import styles from "./profile.module.css";
import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as web3 from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import useProgram from "../../hooks/user_program/load_program.js";
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";

const ProfilePage = () => {
  const [profileInfo, setProfileInfo] = useState(null);
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();
  const [abbreviatedAddress, setAbbreviatedAddress] = useState('');
  const [transactionPending, setTransactionPending] = useState(false);
  const program = useProgram();

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateAbbreviatedAddress = (authority) => {
    if (authority) {
      const addr = authority.toString();
      const abbreviated = `${addr.slice(0, 4)}...${addr.slice(-4)}`;
      setAbbreviatedAddress(abbreviated);
    }
  };

  const initializeUser = async () => {
    if (program && publicKey) {
      console.log("WE CAN INIT USER");

      try {
        setTransactionPending(true);
        const name = "mario0000";
        const avatar = "avatar_mario0";
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        console.log(userPda);
        const tx = await program.methods
          .initialize(name, avatar)
          .accounts({
            userAccount: userPda,
            authority: publicKey,
            systemProgram: web3.SystemProgram.programId, // Ensure this is correctly imported or accessed
          })
          .rpc();
        console.log(`Transaction successful: ${tx}`);
        setTransactionPending(false);
        // After initializing, fetch the profile accounts again
        await sleep(2000); // Sleep for 2 seconds
        findProfileAccounts();
      } catch (error) {
        console.error("Error initializing user:", error);
        setTransactionPending(false);
      }
    }
  };

  const findProfileAccounts = async () => {
    if (program && publicKey && !transactionPending) {
      try {
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        const profileAccount = await program.account.userAccount.fetch(userPda);

        if (profileAccount) {
          setProfileInfo({
            publicKey: userPda.toString(),
            name: profileAccount.name,
            avatar: profileAccount.avatar,
            authority: publicKey.toString(),
            lastPostId: profileAccount.lastPostId, // Assuming this is how your data model is set up
            postCount: profileAccount.postCount,
          });
        } else {
          setProfileInfo(null);
        }
      } catch (error) {
        console.error("Error fetching profile account:", error);
        setProfileInfo(null);
        // Uncomment the following line if you want to initialize the user automatically if the profile is not found
        // initializeUser();
      }
    }
  };

  useEffect(() => {
    findProfileAccounts();

    if (publicKey) {
      updateAbbreviatedAddress(publicKey);
    }
  }, [connection, publicKey, program, wallet]); // Ensure dependencies are correctly set

  return (
    <div className={styles.container}>
      {connection && publicKey ? (
        profileInfo === null ? (
          <div className={styles.NoAccountPlaceholder}>
            <div className={styles.disclaimer}>
              <h1>Get Started with Publishing</h1>
              <p className={styles.paragraph}>
                Start exploring decentralized knowledge by creating your account
                today. <br />
                Join our network and become an active contributor, ready to
                collaborate and share insights with others. <br />
                Creating an account allows you to write and share your own
                articles, <br /> helping to spread your expertise and contribute
                to the <br />{" "}
                <span className={styles.accent}>
                  decentralized ecosystem knowledge pool.{" "}
                </span>
              </p>
              <button className={styles.button} onClick={initializeUser}>
                Create Account
              </button>
            </div>
          </div>
        ) : profileInfo ? (
          <div>
            <div className={styles.head}>
              <div className={styles.info}>
                <div className={styles.avatar}></div>
                <h2>{profileInfo.name}</h2>
                <div className={styles.address}>
                  <span>
                    <Link
                      href={`https://solscan.io/account/${publicKey.toString()}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {abbreviatedAddress}
                    </Link>
                    <button className={styles.addressinfo}>
                      <HiOutlineExternalLink />
                    </button>
                  </span>
                </div>
              </div>
              <div className={styles.data}>
                <div className={styles.articles}>
                  <h4>Posted articles</h4>
                  <h4>{profileInfo.postCount}</h4>
                </div>
              </div>
            </div>
            <div className={styles.ownposts}>
              <h3>Your articles</h3>
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )
      ) : (
        <div className={styles.NotConnectedPlaceholder}>
          <h1>Connect your wallet first.</h1>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
