import React from 'react';
import PostCard from '../postcard/postCard';

// Define the type of the posts prop
/*
The PostList component, on the other hand, is responsible for rendering 
a list of blog posts. It uses the PostCard component to render each individual post. 
This separation allows you to reuse the PostCard component in other parts of your 
application if needed.
*/
interface Post {
  id:string, //unneccessary
  authorAddress: string;
  img: string;
  createdAt: Date;
  title: string;
  subtitle: string;
  body: string;
  slug: string;
}


const PostList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <div>
      {/* Render each post as a PostCard */}
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </div>
  );
};

export default PostList;
