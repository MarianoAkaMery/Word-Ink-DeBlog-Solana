"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { HiOutlineClock, HiOutlineExternalLink } from "react-icons/hi";
import styles from "./singlepage.module.css";
import useProgram from "../../../hooks/user_program/load_program.js";

const SinglePage = ({ params }) => {
  const { slug } = params;
  const [postSingle, setSinglePosts] = useState([]);
  const [abbreviatedAddress, setAbbreviatedAddress] = useState('');

  const program = useProgram();

  useEffect(() => {

     // Function to create abbreviated address
  const updateAbbreviatedAddress = (authority) => {
    if (authority) {
      const addr = authority.toString();
      const abbreviated = `${addr.slice(0, 4)}...${addr.slice(-4)}`;
      setAbbreviatedAddress(abbreviated);
    }
  };
    const loadPost = async () => {
      try {
        const rawPosts = await program.account.postAccount.fetch(slug);
        setSinglePosts(rawPosts);
        updateAbbreviatedAddress(rawPosts.authority);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    loadPost();
  }, [program, slug]);

 
  return (
    <div className={styles.container}>
      <div className={styles.title}>{postSingle.title}</div>
      <div className={styles.info}>
      <div className={styles.address}>
  <Link href={`https://solscan.io/account/${postSingle.authority}?cluster=devnet`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
    <span className={styles.fullAddress}>
      {postSingle.authority ? postSingle.authority.toString() : "No Authority"}
    </span>
    <span className={styles.abbreviatedAddress}>
      {abbreviatedAddress}
    </span>
    <button className={styles.button}>
      <HiOutlineExternalLink />
    </button>
  </Link>
</div>

        <div className={styles.details}>
          <span className={styles.etaread}>
            <HiOutlineClock />6 min read
          </span>
          <span> - </span>
          <span className={styles.date}>{new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.imgContainer}>
        <Image
          src="/placeholder.png"
          alt="Post Image"
          fill
          priority
          className={styles.img}
        />
      </div>

      <div className={styles.textContainer}>{postSingle.content}</div>
    </div>
  );
};

export default SinglePage;