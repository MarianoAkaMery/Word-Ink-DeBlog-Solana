"use client";

import styles from "./profile.module.css";
import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as web3 from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import useProgram from "../../../hooks/user_program/load_program.js";
import ProfileInfo from "../components/ProfileInfo";
import ProfileNoAccount from "../components/ProfileNoAccount";
import ProfileNotConnected from "../components/ProfileNotConnected";
import { useParams } from 'next/navigation';

const UserProfilePage = () => {
  const [profileInfo, setProfileInfo] = useState(null);
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();
  const [abbreviatedAddress, setAbbreviatedAddress] = useState('');
  const [transactionPending, setTransactionPending] = useState(false);
  const program = useProgram();
  const params = useParams();
  const authority = params.slug;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateAbbreviatedAddress = (authority) => {
    if (authority) {
      const addr = authority.toString();
      const abbreviated = `${addr.slice(0, 4)}...${addr.slice(-4)}`;
      setAbbreviatedAddress(abbreviated);
    }
  };

  const findProfileAccounts = async () => {
    if (program && authority && !transactionPending) {
      try {
        const profileAddress = new web3.PublicKey(authority.toString());
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), profileAddress.toBuffer()],
          program.programId
        );
        const profileAccount = await program.account.userAccount.fetch(userPda);

        if (profileAccount) {
          console.log("Fetched account user");
          console.log(profileAccount);
          setProfileInfo({
            publicKey: userPda.toString(),
            name: profileAccount.name,
            avatar: profileAccount.avatar,
            authority: profileAddress.toString(),
            lastPostId: profileAccount.lastPostId,
            postCount: profileAccount.postCount,
          });
          console.log(profileInfo);
        } else {
          setProfileInfo(null);
        }
      } catch (error) {
        console.error("Error fetching profile account:", error);
        setProfileInfo(null);
      }
    }
  };

  useEffect(() => {
    if (authority) {
      findProfileAccounts();
    }

    if (publicKey) {
      updateAbbreviatedAddress(publicKey);
    }
  }, [connection, publicKey, program, wallet, authority]);

  return (
    <div className={styles.container}>
      <ProfileInfo profileInfo={profileInfo} abbreviatedAddress={abbreviatedAddress} />
    </div>
  );
};

export default UserProfilePage;
