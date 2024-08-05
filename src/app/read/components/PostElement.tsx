import React from "react";
import styles from "./postElement.module.css";
import Link from "next/link";

interface Post {
  id: string;
  authorAddress: string;
  category: string;
  title: string;
}

const PostElement: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <Link href={`/read/${post.id}`} passHref>
      <div className={styles.container}>
        <div className={styles.details}>
          <span className={styles.author}>
            {post.authorAddress.slice(0, 4)}...{post.authorAddress.slice(-4)}
          </span>
          <span className={styles.category}>{post.category}</span>
        </div>
        <h2 className={styles.title}>{post.title}</h2>
      </div>
    </Link>
  );
};

export default PostElement;
