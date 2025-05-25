import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineLike, AiOutlineEye } from "react-icons/ai"; // for icons
import { useNavigate } from "react-router-dom";

function formatDate(dateString) {
  if (!dateString) return "Unknown date";
  const d = new Date(dateString);
  return isNaN(d) ? "Invalid date" : d.toLocaleString();
}

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      setError("");

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (!token) {
        setError("User not logged in");
        return;
      }

      try {
        const res = await fetch("https://backend-blog-rmrt.onrender.com/posts/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setPosts(data);
          console.log("Fetched user posts:", data);
        } else if (res.status === 401) {
          setError("Unauthorized: Invalid or expired token");
        } else {
          setError("Failed to fetch your posts");
        }
      } catch (err) {
        setError("Error connecting to server");
      }
    };

    fetchUserPosts();
  }, []);

  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    try {
      const res = await fetch(`https://backend-blog-rmrt.onrender.com/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      alert("Error deleting post");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">My Blogs</h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {posts.length === 0 && !error ? (
        <p className="text-center text-gray-500">You haven't written any posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-100 hover:shadow-lg transition flex"
          >
            {/* Post Content */}
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-2">{post.content}</p>
              <div className="text-sm text-gray-500 mb-1">
                By <strong>{post.author}</strong> on {formatDate(post.date)}
              </div>

              {/* Likes and Views */}
              <div className="flex gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <AiOutlineLike /> {post.likes_count || 0} Likes
                </div>
                <div className="flex items-center gap-1">
                  <AiOutlineEye /> {(post.views || 0)/2} Views
                </div>
              </div>
            </div>

            {/* Edit and Delete Panel */}
            <div className="flex flex-col gap-2 items-center ml-4">
              <div
                className="w-10 h-10 bg-blue-600 rounded-full flex justify-center items-center cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleEdit(post.id)}
                title="Edit Post"
              >
                <FaEdit size={20} className="text-white" />
              </div>

              <div
                className="w-10 h-10 bg-red-600 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-700 transition"
                onClick={() => handleDelete(post.id)}
                title="Delete Post"
              >
                <FaTrash size={20} className="text-white" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
