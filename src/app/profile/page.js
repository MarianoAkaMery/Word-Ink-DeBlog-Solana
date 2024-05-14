"use client";

import styles from "./profile.module.css";
import React, {
  useState,
  useEffect,
} from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as web3 from "@solana/web3.js";
import toast from "react-hot-toast";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import useProgram from "../../hooks/user_program/load_program.js";

const ProfilePage = () => {
  const [profileInfo, setProfileInfo] = useState(null);
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();
  const [transactionPending, setTransactionPending] = useState(false);
  const program = useProgram();

  useEffect(() => {
    const initializeUser = async () => {
      if (program && publicKey) {
        console.log("WE CAN INIT USER");

        try {
          setTransactionPending(true);
          const name = "mario0000";
          const avatar = " avatar_mario0";
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
              systemProgram: web3.SystemProgram.programId, // Make sure this is correctly imported or accessed
            })
            .rpc();
          setTransactionPending(false);
          toast.success("Successfully initialized user.");
        } catch (error) {
          console.log(error);
          toast.error(error.toString());
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
          const profileAccount = await program.account.userAccount.fetch(
            userPda
          );

          if (profileAccount) {
            setProfileInfo({
              publicKey: userPda.toString(),
              name: profileAccount.name,
              avatar: profileAccount.avatar,
              authority: publicKey.toString(),
              lastPostId: profileAccount.lastPostId, // Assuming this is how your data model is setup
              postCount: profileAccount.postCount,
            });
          }
        } catch (error) {
          console.log(error);
          initializeUser();
        }
      }
    };

    findProfileAccounts();
  }, [connection, publicKey, program, wallet]);

  return (
    <div className={styles.container}>
      {connection && publicKey ? (
        profileInfo ? (
          <div className={styles.profileInfo}>
            <h3>Profile Info</h3>
            <p>Public Key: {profileInfo.publicKey}</p>
            <p>Name: {profileInfo.name}</p>
            <p>Avatar: {profileInfo.avatar}</p>
            <p>Authority: {profileInfo.authority}</p>
            <p>Last Post ID: {profileInfo.lastPostId}</p>
            <p>Post Count: {profileInfo.postCount}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )
      ) : (
        <h3>Connect Wallet</h3>
      )}
      <div className={styles.sidebar}>
        <h3>Your latest posts</h3>
        {/* Add content for the sidebar here */}
      </div>
    </div>
  );
};

export default ProfilePage;
