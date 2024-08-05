"use client";

import styles from "./[slug]/profile.module.css";
import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as web3 from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import useProgram from "../../hooks/user_program/load_program.js";
import ProfileInfo from "./components/ProfileInfo";
import ProfileNoAccount from "./components/ProfileNoAccount";
import ProfileLoading from "./components/ProfileLoading";
import ProfileNotConnected from "./components/ProfileNotConnected";

const MyProfilePage = () => {
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
      try {
        setTransactionPending(true);

        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        const tx = await program.methods
          .initialize()
          .accounts({
            userAccount: userPda,
            authority: publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc();
        console.log(`Transaction successful: ${tx}`);
        setTransactionPending(false);
        await sleep(2000);
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
          console.log(profileAccount);
          setProfileInfo({
            publicKey: userPda.toString(),
            name: profileAccount.name,
            bio: profileAccount.bio,
            avatar: profileAccount.avatar,
            authority: publicKey.toString(),
            lastPostId: profileAccount.lastPostId,
            postCount: profileAccount.postCount,
          });
        } else {
          setProfileInfo({});
        }
      } catch (error) {
        console.error("Error fetching profile account:", error);
        setProfileInfo({});
      }
    }
  };

  useEffect(() => {
    if (publicKey && program) {
      findProfileAccounts();
      updateAbbreviatedAddress(publicKey);
    } else {
      setProfileInfo(null); // Clear profile info when wallet is disconnected
    }
  }, [connection, publicKey, program]);

  return (
    <div className={styles.container}>
      {connection && publicKey ? (
        profileInfo === null ? (
          <ProfileLoading />
        ) : Object.keys(profileInfo).length === 0 ? (
          <ProfileNoAccount initializeUser={initializeUser} />
        ) : (
          <ProfileInfo profileInfo={profileInfo} abbreviatedAddress={abbreviatedAddress} />
        )
      ) : (
        <ProfileNotConnected />
      )}
    </div>
  );
};

export default MyProfilePage;
