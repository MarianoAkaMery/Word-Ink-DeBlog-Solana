"use client";
import styles from "./read.module.css";
import PostList from "../app/read/components/postList";
import PostElement from "../app/read/components/PostElement";
import AccountElement from "../app/read/components/accountElement";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { HiSearch } from "react-icons/hi";
import CategoryList from "../app/read/components/CategoryList";
import useProgram from "../hooks/user_program/load_program.js";
import debounce from 'lodash.debounce';

const PAGE_SIZE = 2;

const ReadPage = () => {
  const [postAccount, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [trendingAccounts, setTrendingAccounts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();
  const program = useProgram();
  const observer = useRef();

  const fetchPosts = async (page) => {
    try {
      const rawPosts = await program.account.postAccount.all();
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

      const uniquePosts = Array.from(new Map(formattedPosts.map(post => [post.id, post])).values());
      uniquePosts.sort((a, b) => b.createdAt - a.createdAt);
      setTotalPosts(uniquePosts.length);

      const offset = (page - 1) * PAGE_SIZE;
      const paginatedPosts = uniquePosts.slice(offset, offset + PAGE_SIZE);

      setPosts((prevPosts) => {
        const prevPostIds = new Set(prevPosts.map(post => post.id));
        const newPosts = paginatedPosts.filter(post => !prevPostIds.has(post.id));
        return [...prevPosts, ...newPosts];
      });

      const sortedByUpvotes = [...uniquePosts].sort((a, b) => b.upvote - a.upvote);
      setTrendingPosts(sortedByUpvotes.slice(0, 5));

      const authorPostCount = uniquePosts.reduce((acc, post) => {
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

      const sortedAuthors = Object.values(authorPostCount).sort((a, b) => b.postCount - a.postCount);
      setTrendingAccounts(sortedAuthors.map((author, index) => ({
        id: index.toString(),
        authorAddress: author.authorAddress,
        username: author.username,
        category: "Author",
      })));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [connection, publicKey, program, wallet, currentPage]);

  useEffect(() => {
    let filtered = postAccount;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (post) => post.category === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, postAccount, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPosts([]);
    setCurrentPage(1);
  };

  const debouncedSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleSearchChange = (event) => {
    debouncedSearchChange(event.target.value);
  };

  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPage * PAGE_SIZE < totalPosts) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [currentPage, totalPosts]
  );

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
        </div>
        <div className={styles.pagination}>
          <div ref={lastPostElementRef}></div>
        </div>
      </div>

      <div className={styles.rightContainer}>
        <div className={styles.section}>
          <h1>Trending Posts</h1>
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post) => (
              <PostElement key={post.id} post={post} />
            ))
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
      </div>
    </div>
  );
};

export default ReadPage;
