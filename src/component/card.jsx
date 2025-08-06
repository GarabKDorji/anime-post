import React , {useState}from 'react';
import './Card.css'; // Optional: for styling
import { Link } from 'react-router-dom'
import { supabase } from '../client'

const Card = ({ id, title, content, img, time, upVote, name }) => {
  const [votes, setVotes] = useState(upVote)
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const fetchComments = async () => {
  const { data, error } = await supabase
    .from("anime_comments")
    .select("*")
    .eq("post_id", id);

  if (error) {
    console.error("Error fetching comments:", error.message);
  } else {
    setComments(data);
  }
};
  const handleToggleComments = () => {
    if (!showComments) fetchComments(); // only fetch when opening
    setShowComments(prev => !prev);
  };

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from("anime_posts")
      .update({ up_votes: votes + 1 })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Upvote failed:", error.message)
    } else {
      setVotes(votes + 1)
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-body">
          <Link to={`/post/${id}`} className="card-link">
            <h2 className="card-title">{title}</h2>
            <p className="card-content">Click to read more...</p>
          </Link>
          <div className="card-footer">
            <p className="card-author">Posted by: {name}</p>
            <p className="card-time">{new Date(time).toLocaleString()}</p>
            <p className="card-upvote" onClick={handleUpvote} style={{ cursor: "pointer" }}>
              👍 {votes}
            </p>


             <Link to={`/edit/${id}`} className="edit-button">
              Edit
            </Link>
            
            <button onClick={handleToggleComments} className="comment-toggle-btn">
            {showComments ? "Hide Comments ▲" : "Show Comments ▼"}
          </button>

          {showComments && (
            <div className="comments-section">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          )}
          </div>
        </div>

      </div>

     
    </>
   
  );
};

export default Card;
