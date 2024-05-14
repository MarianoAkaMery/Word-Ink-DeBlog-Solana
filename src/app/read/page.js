"use client";

import styles from "./read.module.css";
import BlogList from "@/components/postList/PostList"; // Assuming the path is correct
import React, { useState, useEffect, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import useProgram from "../../hooks/user_program/load_program.js";

const ReadPage = () => {
  const [postAccount, setPosts] = useState([]);
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();
  const [transactionPending, setTransactionPending] = useState(false);
  const program = useProgram();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetching all posts from the blockchain
        const rawPosts = await program.account.postAccount.all();
        // Assuming postAccounts is an array of posts, update the state
        const formattedPosts = rawPosts.map(({ publicKey, account }) => ({
          id: publicKey.toString(), // Ensure id is a string
          authorAddress: account.authority.toString(), // Convert PublicKey to string
          createdAt: new Date(), // Current date or parse from your data if available
          title: account.title,
          subtitle: account.subtitle,
          body: account.content,
          slug: account.title.replace(/\s+/g, "-").toLowerCase(), // Simple slug from title
        }));

        setPosts(formattedPosts);

        console.log("Fetched posts:", formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [connection, publicKey, program, wallet]);

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.textContainer}>
          <h6 className={styles.title}>Featured Posts</h6>
          <p className={styles.desc}>
            The most interesting content collected by the community.
          </p>
          <BlogList posts={postAccount} />
        </div>
      </div>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        {/* Add content for the sidebar here */}
        <h6>Community Picks</h6>
      </div>
    </div>
  );
};

export default ReadPage;
