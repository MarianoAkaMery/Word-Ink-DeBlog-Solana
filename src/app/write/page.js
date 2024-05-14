"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as web3 from "@solana/web3.js";
import styles from "./write.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import useProgram from "../../hooks/user_program/load_program.js";
import { Akord, Auth } from "@akord/akord-js";

Auth.configure({ apiKey: "6kkSOcoyyF68IJu69YSuJ54wTFwakC11aJpYoPoe" });

import { InputModal } from "@/components/modal/InputModal";
import { SuccessModal } from "@/components/modal/SuccessModal";
import { WalletModal } from "@/components/modal/WalletModal";
import { NoContentModal } from "@/components/modal/NoContentModal";

import Tiptap from "@/components/editor/TipTap";

const WritePage = () => {
  const [content, setContent] = useState("");
  const { connection } = useConnection();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [showInputModal, setShowInputModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [noContentModal, setNoContentModal] = useState(false);

  const [akordResponseId, setAkordResponseId] = useState(null);

  const { publicKey, wallet, connect, connecting } = useWallet();
  const [transactionPending, setTransactionPending] = useState(false);
  const program = useProgram();

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleInputModalSubmit = async () => {
    console.log("Title:", title);
    console.log("Subtitle:", subtitle);

    setShowInputModal(false); // Close the input modal

    // Continue the blog posting process
    const successTx = await PostBlog(akordResponseId, title, subtitle);

    if (successTx) {
      const data = { content };
      const existingDataString = localStorage.getItem("myData");
      const existingData = existingDataString
        ? JSON.parse(existingDataString)
        : [];
      const updatedData = [...existingData, { ...data, akordResponseId }];
      localStorage.setItem("myData", JSON.stringify(updatedData));
      setContent("");
      setShowSuccessModal(true); // Show the success modal
    }
  };

  const closeModal = () => {
    setShowInputModal(false);
    setShowSuccessModal(false);
    setShowWalletModal(false);
    setNoContentModal(false);
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
          console.log("Account found we can proceed with the publication 0.0");
          return true;
        }
      } catch (error) {
        console.error("Error finding profile accounts:", error);
      }
    }
    return false;
  };

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

  const PostBlog = async (postId, titleFromForm, subtitleFromForm) => {
    if (program && publicKey) {
      console.log("WE CAN POST");
      try {
        setTransactionPending(true);
        const title = titleFromForm;
        const subtitle = subtitleFromForm;
        console.log("Content = " + postId);
        console.log("Title = " + title);

        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        console.log("USER PDA = " + userPda);

        const profileAccount = await program.account.userAccount.fetch(userPda);
        console.log("USER LAST POST ID = " + profileAccount.lastPostId);

        const [postPda] = findProgramAddressSync(
          [
            utf8.encode("post"),
            publicKey.toBuffer(),
            Uint8Array.from([profileAccount.lastPostId]),
          ],
          program.programId
        );
        console.log("POST PDA= " + postPda);
        await program.methods
          .createPost(title, subtitle, postId)
          .accounts({
            postAccount: postPda,
            userAccount: userPda,
            authority: publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc();

        setTransactionPending(false);
        console.log("Successfully Posted Blog Article");
        return true; // Return true if successfully posted
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
        setTransactionPending(false);
        return false; // Return false if an error occurs
      }
    } else {
      return false; // Return false if preconditions are not met
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { content };
    console.log(data);

    if (data.content != "") {
      // Akord API integration
      const akordUrl = "https://api.akord.com/files";

      if (program && publicKey) {
        try {
          const response = await fetch(akordUrl, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Api-Key": "6kkSOcoyyF68IJu69YSuJ54wTFwakC11aJpYoPoe",
              "Content-Type": "text/plain",
            },
            body: data.content,
          });

          const akordResponse = await response.json();
          console.log(akordResponse.id);

          if (response.ok) {
            const userExist = await findProfileAccounts();

            if (userExist) {
              localStorage.setItem("akordResponseId", akordResponse.id);
              setAkordResponseId(akordResponse.id);
              setShowInputModal(true);
            } else {
              await initializeUser();
              localStorage.setItem("akordResponseId", akordResponse.id);
              setAkordResponseId(akordResponse.id);
              setShowInputModal(true);
            }
          } else {
            console.error("Error uploading to Akord:", akordResponse);
          }
        } catch (error) {
          console.error("An error occurred while uploading to Akord:", error);
        }
      } else {
        setShowWalletModal(true);
      }
    }else{
      setNoContentModal(true);

    }
  };

  const handleWalletConnect = async () => {
    if (!publicKey) {
      try {
        await connect();
        setShowWalletModal(false);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  useEffect(() => {
    const initializeAkord = async () => {
      try {
        const email = "marianolibrici2002@gmail.com"; // Replace with actual email
        const password = "Tradate2002!"; // Replace with actual password

        const { wallet, jwt } = await Auth.signIn(email, password);
        console.log(wallet);
        console.log(jwt);
        const akordInstance = Akord.init(wallet, { authToken: jwt });
        setAkord(akordInstance);
        console.log("LOGGED");
      } catch (error) {
        console.error("Error initializing Akord:", error);
      }
    };

    //initializeAkord();
  }, [connection, publicKey, program, wallet]);

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.container}>
        <div className={styles.center}>
          <Tiptap content={content} onChange={handleContentChange} />
        </div>
        <div className={styles.bottom}>
          <div className={styles.buttonarea}>
            <button className={styles.button} type="submit">
              Publish
            </button>
          </div>
        </div>
      </div>
      {showInputModal && (
        <InputModal
          isOpen={showInputModal}
          closeModal={closeModal}
          title={title}
          subtitle={subtitle}
          setTitle={setTitle}
          setSubtitle={setSubtitle}
          onSubmit={handleInputModalSubmit}
        />
      )}
      {showSuccessModal && (
        <SuccessModal isOpen={showSuccessModal} closeModal={closeModal} />
      )}
      {showWalletModal && (
        <WalletModal isOpen={showWalletModal} closeModal={closeModal} />
      )}
      {NoContentModal && (
        <NoContentModal isOpen={noContentModal} closeModal={closeModal} />
      )}
    </form>
  );
};

export default WritePage;
