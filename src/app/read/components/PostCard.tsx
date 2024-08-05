import React from "react";
import styles from "./postCard.module.css";
import Link from "next/link";
import { HiArrowDown, HiArrowUp } from "react-icons/hi";
import Image from "next/image";

interface Post {
  id: string;
  authorAddress: string;
  imagePreview: string;
  category: string;
  createdAt: number; // Unix timestamp
  title: string;
  subtitle: string;
  body: string;
  upvote: number;
  downvote: number;
  slug: string;
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toDateString().slice(4, 16); // Format as "Mon DD YYYY"
  };

  return (
    <Link href={`/read/${post.id}`} passHref>
      <div className={styles.container}>
        <div className={styles.body}>
          <div className={styles.details}>
            <div className={styles.top}>
              <span className={styles.highlight}> {post.authorAddress.slice(0, 4)}...{post.authorAddress.slice(-4)}   </span>
              <span className={styles.highlight}>{post.category}</span>
            </div>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.desc}>{post.subtitle}</p>
          </div>
          <div className={styles.bottom}>
            <span className={styles.date}>
              {post.createdAt ? formatDate(post.createdAt) : ''}
            </span>
            <div>
              <HiArrowUp /> {post.upvote}
            </div>
            <div>
              <HiArrowDown /> {post.downvote}
            </div>
          </div>
        </div>

    {/**   <div className={styles.imgContainer}>
          {post.imagePreview && (
            <div >
              <Image
                src={post.imagePreview}
                alt="Post Image"
                layout="fill"
                className={styles.img}
              />
            </div>
          )}
        </div>
*/}  
      </div>

    </Link>
  );
};

export default PostCard;
