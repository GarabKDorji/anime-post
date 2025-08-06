// src/pages/PostDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../client';
import './Detail.css'


const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('anime_posts')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching post:", error.message);
      } else {
        setPost(data);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <p className="loading">Loading...</p>;

  return (
    <div className="post-detail">
      <h1 className="post-title">{post.title}</h1>

      {post.img && <img src={post.img} alt={post.title} className="post-image" />}

      <p className="post-content">{post.content}</p>

      <div className="post-meta">
        <span className="post-author">Posted by: {post.name}</span>
        <span className="post-upvote">👍 {post.up_votes}</span>
        <span>{new Date(post.created_at).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PostDetail;
