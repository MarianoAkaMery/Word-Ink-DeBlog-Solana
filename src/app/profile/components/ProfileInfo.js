"use client";

import ProfileHeader from "./ProfileHeader";
import styles from "../[slug]/profile.module.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useProgram from "../../../hooks/user_program/load_program";
import PostList from "@/app/read/components/postList";
import { HiSearch } from "react-icons/hi";

const PAGE_SIZE = 2;

const ProfileInfo = ({ profileInfo, abbreviatedAddress }) => {
  const { publicKey } = useWallet();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPostsCount, setTotalPostsCount] = useState(0); // Counter for total posts
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const canEdit = profileInfo && publicKey && profileInfo.authority === publicKey.toString();
  const { connection } = useConnection();
  const program = useProgram();
  const observer = useRef();

  const fetchPosts = async (page) => {
    try {
      const allPosts = await program.account.postAccount.all();
      const userPosts = allPosts.filter(({ account }) => account.authority.toString() === profileInfo.authority);

      // Extract and format posts
      const formattedPosts = userPosts.map(({ publicKey, account }) => ({
        id: publicKey.toString(),
        authorAddress: account.authority.toString(),
        imagePreview: account.image_preview,
        category: account.category,
        createdAt: account.timestamp,
        title: account.title,
        subtitle: account.subtitle,
        body: account.content,
        upvote: account.upvote,
        downvote: account.downvote,
        slug: account.title.replace(/\s+/g, "-").toLowerCase(),
      }));

      // Remove duplicates based on post ID
      const uniquePosts = Array.from(new Map(formattedPosts.map(post => [post.id, post])).values());

      // Update total posts count and handle pagination
      setTotalPosts(uniquePosts.length);
      const offset = (page - 1) * PAGE_SIZE;
      const paginatedPosts = uniquePosts.slice(offset, offset + PAGE_SIZE);

      // Append new posts and update state
      setPosts(prevPosts => {
        const prevPostIds = new Set(prevPosts.map(post => post.id));
        const newPosts = paginatedPosts.filter(post => !prevPostIds.has(post.id));
        return [...prevPosts, ...newPosts];
      });

      setTotalPostsCount(uniquePosts.length);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Fetch posts whenever profileInfo, currentPage, or program changes
  useEffect(() => {
    if (profileInfo?.authority) {
      fetchPosts(currentPage);
    }
  }, [profileInfo?.authority, currentPage, program]);

  // Filter posts based on search query
  useEffect(() => {
    let filtered = posts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPage * PAGE_SIZE < totalPosts) {
          setCurrentPage(prevPage => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [currentPage, totalPosts]
  );

  return (
    <div>
      <ProfileHeader profileInfo={profileInfo} abbreviatedAddress={abbreviatedAddress} canEdit={canEdit} />
      <div className={styles.ownposts}>
        <p className={styles.articlesInfo}>
          {canEdit ? "Your articles" : "Published articles"}
          <span className={styles.totalPostsCount}>
            {` (${totalPostsCount} ${totalPostsCount === 1 ? "article" : "articles"})`}
          </span>
        </p>
        <div className={styles.searchContainer}>
          <HiSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search Article"
            value={searchQuery}
            onChange={handleSearchChange} // Handle search input change
          />
        </div>
        <PostList posts={filteredPosts} />
        <div ref={lastPostElementRef} className={styles.pagination}></div>
      </div>
    </div>
  );
};

export default ProfileInfo;
