import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalPost, setOriginalPost] = useState({ title: "", content: "" }); // new state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError("");
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        if (!token) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const res = await fetch(`https://backend-blog-rmrt.onrender.com/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setContent(data.content);
          setOriginalPost({ title: data.title, content: data.content }); // save original post
        } else if (res.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (res.status === 404) {
          setError("Post not found.");
        } else {
          setError("Failed to load the post.");
        }
      } catch (err) {
        setError("Error fetching post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    setError("");
    // Check if changes exist
    if (title === originalPost.title && content === originalPost.content) {
      setError("No changes detected to update.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    setUpdating(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      if (!token) {
        setError("User not logged in");
        setUpdating(false);
        return;
      }

      const res = await fetch(`https://backend-blog-rmrt.onrender.com/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        // Redirect to My Blogs page after successful update
        alert("Post has been updated."); 
        navigate("/myposts");
      } else if (res.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (res.status === 403) {
        setError("You are not allowed to update this post.");
      } else if (res.status === 404) {
        setError("Post not found.");
      } else {
        setError("Failed to update the post.");
      }
    } catch (err) {
      setError("Error updating post.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Blog Post</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          {error && (
            <p className="text-center text-red-600 mb-4" role="alert">
              {error}
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-6"
          >
            <div>
              <label className="block mb-2 font-semibold" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold" htmlFor="content">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={updating}
                className={`px-6 py-2 rounded-md text-white ${
                  updating ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } transition`}
              >
                {updating ? "Updating..." : "Update"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
