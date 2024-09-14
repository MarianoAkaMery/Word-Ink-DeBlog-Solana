"use client";

import styles from "./read.module.css";
import PostList from "../app/read/components/postList";
import PostElement from "../app/read/components/PostElement";
import AccountElement from "../app/read/components/accountElement";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { HiSearch } from "react-icons/hi";
import CategoryList from "../app/read/components/CategoryList";
import useProgram from "../hooks/user_program/load_program.js";
import debounce from "lodash.debounce";
import Link from "next/link";

const CHUNK_SIZE = 10; // Number of posts to load at each scroll event

const ReadPage = () => {
  // State management
  const [postAccount, setPostAccount] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]); // Posts currently displayed on the screen
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE); // Control how many posts are displayed

  // Hooks for wallet and connection
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const program = useProgram();
  const observer = useRef();

  // Fetch all posts from the blockchain
  const fetchPosts = async () => {
    try {
      if (!program) return; // Ensure the program is ready

      const rawPosts = await program.account.postAccount.all();

      // Map raw data to formatted posts
      const formattedPosts = rawPosts.map(({ publicKey, account }) => ({
        id: publicKey.toString(),
        authorAddress: account.authority.toString(),
        username: account.username,
        imagePreview: account.imagePreview,
        category: account.category,
        createdAt: account.timestamp,
        title: account.title,
        subtitle: account.subtitle,
        body: account.content,
        upvote: account.upvote,
        downvote: account.downvote,
        slug: account.title.replace(/\s+/g, "-").toLowerCase(),
      }));

      // Sort posts by creation date
      const sortedPosts = formattedPosts.sort((a, b) => b.createdAt - a.createdAt);

      setPostAccount(sortedPosts);
      setDisplayedPosts(sortedPosts.slice(0, CHUNK_SIZE)); // Load the initial chunk of posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Effect to fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, [connection, publicKey, program]);

  // Infinite scroll: Load more posts when the last post element is visible
  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCount < postAccount.length) {
          setVisibleCount((prevCount) => prevCount + CHUNK_SIZE);
        }
      });
      if (node) observer.current.observe(node);
    },
    [visibleCount, postAccount.length]
  );

  // Update displayed posts when visible count changes
  useEffect(() => {
    setDisplayedPosts(postAccount.slice(0, visibleCount));
  }, [visibleCount, postAccount]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setDisplayedPosts([]); // Reset displayed posts on category change
    setVisibleCount(CHUNK_SIZE); // Reset visible count
  };

  // Handle search input change with debounce
  const debouncedSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleSearchChange = (event) => {
    debouncedSearchChange(event.target.value);
  };

  // Filter posts based on category and search query
  const filteredPosts = displayedPosts.filter(
    (post) =>
      (selectedCategory === "all" || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Memoize trending posts calculation to prevent frequent re-renders
  const trendingPosts = useMemo(() => {
    return postAccount
      .slice()
      .sort((a, b) => b.upvote - a.upvote)
      .slice(0, 5); // Top 5 trending posts by upvotes
  }, [postAccount]);

  // Memoize trending accounts calculation and limit to 5 accounts
  const trendingAccounts = useMemo(() => {
    const authorPostCount = postAccount.reduce((acc, post) => {
      if (!acc[post.authorAddress]) {
        acc[post.authorAddress] = {
          authorAddress: post.authorAddress,
          username: post.username,
          postCount: 0,
        };
      }
      acc[post.authorAddress].postCount += 1;
      return acc;
    }, {});

    // Sort authors by the number of posts and limit to top 5
    return Object.values(authorPostCount)
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5) // Display only the top 5 accounts
      .map((author, index) => ({
        id: index.toString(),
        authorAddress: author.authorAddress,
        username: author.username,
        category: "Author",
      }));
  }, [postAccount]);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.stickyContainer}>
          <div className={styles.searchContainer}>
            <HiSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search Article"
              onChange={handleSearchChange}
            />
          </div>
          <div className={styles.categoryListContainer}>
            <CategoryList onCategoryChange={handleCategoryChange} />
          </div>
        </div>
        <div className={styles.postList}>
          {filteredPosts.length > 0 ? (
            <PostList posts={filteredPosts} />
          ) : (
            <p>No posts found</p>
          )}
          <div ref={lastPostElementRef}></div> {/* Last element to trigger infinite scroll */}
        </div>
      </div>

      <div className={styles.rightContainer}>
        <div className={styles.section}>
          <h1>Trending Posts</h1>
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post) => <PostElement key={post.id} post={post} />)
          ) : (
            <p>No trending posts</p>
          )}
        </div>
        <div className={styles.section}>
          <h1>Trending Accounts</h1>
          {trendingAccounts.length > 0 ? (
            trendingAccounts.map((account) => (
              <AccountElement key={account.id} account={account} />
            ))
          ) : (
            <p>No trending accounts</p>
          )}
        </div>
        <div className={styles.links}>
          <Link href="/" className={styles.about}>
            Documentation
          </Link>
          <Link href="/" className={styles.about}>
            Terms of Service
          </Link>
          <Link href="/about" className={styles.about}>
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
