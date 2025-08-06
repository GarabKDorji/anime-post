import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import './Edit.css'

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: '',
    content: '',
    img_url: '',
    name: '',
    img_file: null,
  });
  const handleDelete = async () => {
  const confirm = window.confirm("Are you sure you want to delete this post?");
  if (!confirm) return;

  const { error } = await supabase
    .from("anime_posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete failed:", error.message);
  } else {
    // Optional: remove the card from UI by refreshing or lifting state
    window.location = '/'; // or use navigate or callback
  }
};


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('anime_posts')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching post:', error.message);
      } else {
        setPost({
          title: data.title,
          content: data.content,
          img_url: data.img || '',
          name: data.name,
          img_file: null, 
        });
      }

      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setPost((prev) => ({ ...prev, img_file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageToStore = post.img_url;

    // Upload new image if a file was selected
    if (post.img_file) {
      const filePath = `public/${Date.now()}_${post.img_file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, post.img_file);

      if (uploadError) {
        alert('Image upload failed.');
        console.log(uploadError)
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      imageToStore = publicUrl;
    }

    const { error } = await supabase
      .from('anime_posts')
      .update({
        title: post.title,
        content: post.content,
        img: imageToStore,
        name: post.name,
      })
      .eq('id', id);

    if (error) {
      alert('Failed to update post.');
      console.error(error.message);
    } else {
      alert('Post updated successfully!');
      navigate(`/post/${id}`); 
    }
  };

  if (loading) return <p>Loading post...</p>;

  return (
    <div className="edit-post">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={post.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Content (minimum 100 words)"
          value={post.content}
          onChange={handleChange}
          rows={8}
          required
        />

        <input
          type="url"
          name="img_url"
          placeholder="Image URL (optional)"
          value={post.img_url}
          onChange={handleChange}
          disabled={post.img_file !== null}
        />

        <input
          type="file"
          name="img_file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={post.img_url !== ''}
        />

        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={post.name}
          onChange={handleChange}
          required
        />
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;
