import React from 'react';
import PostCard from './PostCard';
import styles from './postList.module.css'

// Define the type of the posts prop
interface Post {
  id: string;
  authorAddress: string;
  imagePreview: string;
  createdAt: number; // Unix timestamp
  category:string;
  title: string;
  subtitle: string;
  body: string;
  upvote: number;
  downvote: number;
  slug: string;
}

const PostList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <div className={styles.container}>
      {/* Render each post as a PostCard */}
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </div>
  );
};

export default PostList;
