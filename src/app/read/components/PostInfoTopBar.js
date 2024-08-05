import React from 'react';
import Link from "next/link";
import { HiOutlineClock, HiOutlineExternalLink } from "react-icons/hi";
import styles from "../[slug]/singlepage.module.css"

const PostInfoTopBar = ({ postSingle, abbreviatedAddress, readingTime }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toDateString().slice(4, 16); // Format as "Mon DD YYYY"
  };


  return (
    <div className={styles.top}>
      <div className={styles.title}>{postSingle?.title}</div>
      <div className={styles.subtitle}>{postSingle?.subtitle}</div>
      <div className={styles.info}>
        <div className={styles.highlight}>
          <Link href={`/profile/${postSingle?.authority}`}
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

      </div>
      <div className={styles.bottom}> 
      <span className={styles.highlight}>
        {postSingle?.timestamp ? formatDate(postSingle.timestamp) : ''}
      </span>
      <span className={styles.highlight}>
        <HiOutlineClock />
        {readingTime} min{readingTime > 1 ? 's' : ''}
      </span>
    </div>

    </div>
  );
};

export default PostInfoTopBar;
