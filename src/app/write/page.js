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
import { HiCheckCircle, HiOutlineXCircle  } from "react-icons/hi";
import { Modal } from "@/components/modal/modal";
import Tiptap from "@/components/editor/TipTap";
import modalStyle from "@/components/modal/modal.module.css";
import { categories } from "@/constants/categories";

Auth.configure({ apiKey: "6kkSOcoyyF68IJu69YSuJ54wTFwakC11aJpYoPoe" });

const WritePage = () => {
  const [content, setContent] = useState("");
  const { connection } = useConnection();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [showInputModal, setShowInputModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [noContentModal, setNoContentModal] = useState(false);
  const [category, setCategory] = useState(categories[0].value);
  const [akord, setAkord] = useState(null);
  const [akordResponseId, setAkordResponseId] = useState(null);
  const { publicKey, wallet, connect } = useWallet();
  const [transactionPending, setTransactionPending] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [subtitleError, setSubtitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const program = useProgram();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initializeAkord = async () => {
        try {
          const email = "marianolibrici2002@gmail.com";
          const password = "Tradate2002!";

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

      initializeAkord();
    }
  }, [connection, publicKey, program, wallet]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.length > 256) {
      setTitleError("Title cannot exceed 256 characters");
    } else {
      setTitleError("");
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubtitleChange = (e) => {
    setSubtitle(e.target.value);
    if (e.target.value.length > 2048) {
      setSubtitleError("Subtitle cannot exceed 2048 characters");
    } else {
      setSubtitleError("");
    }
  };

  const handleInputModalSubmit = async () => {
    if (title.trim() === "") {
      setTitleError("Title cannot be empty");
      return;
    } else if (title.length > 256) {
      setTitleError("Title cannot exceed 256 characters");
      return;
    }

    if (subtitle.length > 2048) {
      setSubtitleError("Subtitle cannot exceed 2048 characters");
      return;
    }

    if (content.length > 64) {
      setContentError("Content cannot exceed 64 characters");
      return;
    }

    setShowInputModal(false);

    const successTx = await PostBlog(akordResponseId, title, category, subtitle);

    if (successTx) {
      const data = { content };
      const existingDataString = typeof window !== 'undefined' ? localStorage.getItem("myData") : null;
      const existingData = existingDataString ? JSON.parse(existingDataString) : [];
      const updatedData = [...existingData, { ...data, akordResponseId }];
      typeof window !== 'undefined' && localStorage.setItem("myData", JSON.stringify(updatedData));
      setContent("");
      setShowSuccessModal(true);
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

        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        console.log(userPda);
        const tx = await program.methods
          .initialize()
          .accounts({
            userAccount: userPda,
            authority: publicKey,
            systemProgram: web3.SystemProgram.programId,
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

  const PostBlog = async (AkordPostId, titleFromForm, categoryFromForm, subtitleFromForm) => {
    if (program && publicKey) {
      console.log("WE CAN POST");
      try {
        setTransactionPending(true);
        const title = titleFromForm;
        const subtitle = subtitleFromForm;
        const category = categoryFromForm;
        const image = "https://thecryptogateway.it/wp-content/uploads/solana-e1638787112402.jpeg";
        console.log("Content = " + AkordPostId);
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
          .createPost(title, subtitle, category, image, AkordPostId)
          .accounts({
            postAccount: postPda,
            userAccount: userPda,
            authority: publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc();

        setTransactionPending(false);
        console.log("Successfully Posted Blog Article");
        return true;
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
        setTransactionPending(false);
        return false;
      }
    } else {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { content };
    console.log(data);

    if (data.content !== "" && data.content !== "<p></p>") {
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
              typeof window !== 'undefined' && localStorage.setItem("akordResponseId", akordResponse.id);
              setAkordResponseId(akordResponse.id);
              setShowInputModal(true);
            } else {
              await initializeUser();
              typeof window !== 'undefined' && localStorage.setItem("akordResponseId", akordResponse.id);
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
    } else {
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
        <Modal isOpen={showInputModal} closeModal={closeModal} variant="opaque">
          <div className={modalStyle.modalArticleContainer}>
            <div className={modalStyle.modalArticle}>
            <h1>Wordink</h1>
            <h2>Article is almost ready</h2>
            <div className={modalStyle.articleInfo}>
              <div className={modalStyle.articleTextInfo}>
                <p>Add a title and subtitle, select a category</p>
                <textarea
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Write a Title"
                  className={modalStyle.textareaTitle}
                />
                {titleError && <p className={modalStyle.error}>{titleError}</p>}
                <textarea
                  value={subtitle}
                  onChange={handleSubtitleChange}
                  placeholder="Write a subtitle..."
                  className={modalStyle.textareaSubtitle}
                />
                {subtitleError && <p className={modalStyle.error}>{subtitleError}</p>}
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className={modalStyle.dropdownCategory}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value} disabled={cat.disabled}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <p>The article is fully stored on Arweave. The publishing cost depends on the content.</p>

              </div>
            </div>
            <div className={modalStyle.bottom}>
              <button className={styles.button} onClick={handleInputModalSubmit}>
                Publish
              </button>
            </div>
            </div>
          </div>
        </Modal>
      )}
      {showSuccessModal && (
        <Modal isOpen={showSuccessModal} closeModal={closeModal} variant="transparent">
          <div>
            <HiCheckCircle className={modalStyle.icon} />
            <h1>Well done!</h1>
            <p>Keep up the great work with your articles!</p>
          </div>
        </Modal>
      )}
      {showWalletModal && (
        <Modal isOpen={showWalletModal} closeModal={closeModal} variant="transparent">
          <div>
            <h2>Connect Wallet</h2>
            <p>Please connect your wallet to continue.</p>
            <button onClick={handleWalletConnect} className={styles.button}>
              Connect Wallet
            </button>
          </div>
        </Modal>
      )}
      {noContentModal && (
        <Modal isOpen={noContentModal} closeModal={closeModal}>
          <div>
          <HiOutlineXCircle  className={modalStyle.icon} />
            <h2>No content</h2>
            <p>Make sure to add some content before publishing.</p>
          </div>
        </Modal>
      )}
    </form>
  );
};

export default WritePage;
