import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, HeartOff } from 'lucide-react'; // ✅ Icon import
import { EyeIcon } from '@heroicons/react/24/solid';

const BASE_URL = 'https://backend-blog-rmrt.onrender.com';

function formatDate(dateString) {
  if (!dateString) return "Unknown date";
  const d = new Date(dateString);
  return isNaN(d) ? "Invalid date" : d.toLocaleString();
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);

    const fetchPost = async () => {
      try {
        const res = await fetch(`${BASE_URL}/posts/${id}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data);
        setComments(data.comments?.reverse() || []);
        setLikes(data.likes_count || 0);

        if (loggedInUser && Array.isArray(data.liked_users)) {
          setLikedByUser(data.liked_users.includes(loggedInUser.email));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!res.ok) throw new Error('Failed to post comment');
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      alert(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return alert('Please log in to delete comments.');

    try {
      const res = await fetch(`${BASE_URL}/posts/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete comment');
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) return alert('Please log in to like posts.');

    setLikeLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/posts/${id}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to toggle like');
      const data = await res.json();
      setLikes(data.likes_count);
      setLikedByUser(data.liked);
    } catch (err) {
      alert(err.message);
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) return <div className="p-6 max-w-4xl mx-auto text-gray-500">Loading post...</div>;
  if (error) return <div className="p-6 max-w-4xl mx-auto text-red-500">{error}</div>;
  if (!post) return <div className="p-6 max-w-4xl mx-auto text-red-500">Post not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="mb-4 text-sm text-blue-600 hover:underline">
        ← Go Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-4">{post.title || 'Untitled'}</h1>

      <p className="text-sm text-gray-600 mb-1">
        <strong>Author:</strong> {post.author || 'Unknown'} ({post.author_email || 'N/A'})
      </p>
      <p className="text-sm text-gray-500 mb-4">Posted on: {formatDate(post.date)}</p>

      <div className="text-sm text-gray-500 mb-4 flex gap-4">
        <div className="flex items-center gap-1">
          <EyeIcon className="h-4 w-4 text-gray-500" />
          <span>{post.views ?? 0} views</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4 text-gray-500" />
          <span>{likes} likes</span>
        </div>
      </div>

      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{post.content || 'No content available.'}</p>

      <button
        onClick={handleLikeToggle}
        disabled={likeLoading}
        className={`mb-6 px-4 py-2 rounded flex items-center gap-2 ${
          likedByUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        {likedByUser ? <Heart fill="white" size={18} /> : <HeartOff size={18} />}
        {likedByUser ? 'Liked' : 'Like'} 
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Comments</h2>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-2"
              rows="3"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={commentLoading}
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {commentLoading ? 'Posting...' : 'Add Comment'}
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mb-4">Log in to write a comment.</p>
        )}

        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="mb-3 border-b border-gray-300 pb-2">
              <p className="text-sm text-gray-600 mb-1 flex justify-between items-center">
                <span>
                  <span className="font-bold">{comment.author_name || 'Anonymous'}</span> commented on {formatDate(comment.date)}
                </span>
                {user?.email === comment.author_email && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Delete
                  </button>
                )}
              </p>
              <p>{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
