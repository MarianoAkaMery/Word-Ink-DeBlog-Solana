import React from "react";
import styles from "./postCard.module.css";
import Link from "next/link";
import { HiOutlineClock } from "react-icons/hi";

/*The PostCard component is responsible for rendering the individual 
card for each blog post. It encapsulates the styling and structure specific 
to a single post. This separation of concerns makes your code modular
 and easier to maintain.*/

interface Post {
  id: string; //unneccessary
  authorAddress: string;
  img: string;
  createdAt: Date;
  title: string;
  subtitle: string;
  body: string;
  slug: string;
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  
  return (
    <div className={styles.container}>
      <div className={styles.upper}>
        <div className={styles.details}>
          <span className={styles.address}>
            {post.authorAddress.slice(0, 4)}...{post.authorAddress.slice(-4)}
            {/* {post.authorAddress.slice(0, 4)}...{post.authorAddress.slice(-4)} */}
          </span>
          <span className={styles.date}>
            {/* {post.createdAt?.toString().slice(4, 16)} */}
          </span>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
      </div>
      {/* <div className={styles.top}>
        {post.img && (
          <div className={styles.imgContainer}>
            <Image
              src={post.img}
              alt="Post Image"
              layout="fill"
              objectFit="cover"
              className={styles.img}
            />
          </div>
        )}
      </div> */}
      <p className={styles.desc}>{post.subtitle}</p>
      <div className={styles.bottom}>
        <span className={styles.etaread}>
          <HiOutlineClock />6 min read
        </span>
        <Link href={`/read/${post.id}`}>
          <span className={styles.link}>READ MORE</span>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
