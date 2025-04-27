import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getDiscussion,
  getComments,
  addComment,
} from "../services/discussionService";
import { FaArrowLeft } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import "./DiscussionDetailsPage.css";

export default function DiscussionDetailsPage() {
  const { postId } = useParams();
  const { user } = useAuth();

  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPost = await getDiscussion(postId);
      const fetchedComments = await getComments(postId);
      setPost(fetchedPost);
      setComments(fetchedComments);
    };
    fetchData();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await addComment(postId, commentText, user.displayName || user.email);
    setCommentText("");

    const updatedComments = await getComments(postId);
    setComments(updatedComments);
  };

  return (
    <MainLayout>
      <div className="discussion-details">
        {post && (
          <div className="post-section">
            <FaArrowLeft
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer", marginRight: "0.5rem" }}
            />
            <h2>{post.title}</h2>
            <p className="author">
              By {post.createdBy} — {post.createdAt?.toDate().toLocaleString()}
            </p>
            <p className="content">{post.content}</p>
          </div>
        )}

        <div className="comments-section">
          <h3>Comments</h3>
          {comments.map((c) => (
            <div className="comment-card" key={c.id}>
              <p className="comment-text">{c.text}</p>
              <div className="comment-meta">
                <span>{c.createdBy}</span>
                <span>{c.createdAt?.toDate().toLocaleString()}</span>
              </div>
            </div>
          ))}

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              placeholder="Write a comment..."
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Post Comment</button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
