"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { HiOutlineClock, HiOutlineExternalLink } from "react-icons/hi";
import styles from "./singlepage.module.css";
import useProgram from "../../../hooks/user_program/load_program.js";

const SinglePage = ({ params }) => {
  const { slug } = params;
  const [postSingle, setSinglePosts] = useState(null);
  const [abbreviatedAddress, setAbbreviatedAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const program = useProgram();

  const updateAbbreviatedAddress = (authority) => {
    if (authority) {
      const addr = authority.toString();
      const abbreviated = `${addr.slice(0, 4)}...${addr.slice(-4)}`;
      setAbbreviatedAddress(abbreviated);
    }
  };

  useEffect(() => {
    const loadPost = async () => {
      try {
        const rawPosts = await program.account.postAccount.fetch(slug);
        setSinglePosts(rawPosts);
        updateAbbreviatedAddress(rawPosts.authority);
        if (rawPosts.content) {
          await handleGet(rawPosts.content);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    const handleGet = async (uri) => {
      const getUrl = `https://api.akord.com/files/${uri}`;
    
      try {
        const response = await fetch(getUrl, {
          method: 'GET',
          headers: {
            Accept: "application/json",
            "Api-Key": "6kkSOcoyyF68IJu69YSuJ54wTFwakC11aJpYoPoe",
            "Content-Type": "text/plain",
          }
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching from Akord:', errorData);
          setError("Failed to fetch content from Akord");
        } else {
          const responseData = await response.text(); // Use .text() to get HTML content as string
          setSinglePosts((prevPost) => ({ ...prevPost, content: responseData }));
        }
      } catch (error) {
        console.error('An error occurred while fetching from Akord:', error);
        setError("An error occurred while fetching content from Akord");
      }
    };

    if (program) {
      loadPost();
    }
  }, [program, slug]);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>{postSingle?.title}</div>
      <div className={styles.info}>
        <div className={styles.address}>
          <Link href={`https://solscan.io/account/${postSingle?.authority}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <span className={styles.fullAddress}>
              {postSingle?.authority ? postSingle.authority.toString() : "No Authority"}
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
      <div className={styles.textContainer} dangerouslySetInnerHTML={{ __html: postSingle?.content }} />

      <div className={styles.imgContainer}>
        <Image
          src="/placeholder.png"
          alt="Post Image"
          fill
          priority
          className={styles.img}
        />
      </div>
    </div>
  );
};

export default SinglePage;
