import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // <-- import this

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();  // <-- initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      setError("You must be logged in to create a post.");
      setLoading(false);
      return;
    }

    const postData = {
      title,
      content,
      author: user.name,
      author_email: user.email,
    };

    try {
      const res = await fetch("https://backend-blog-rmrt.onrender.com/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        // Redirect to /myposts after successful post creation
        navigate("/myposts");
      } else if (res.status === 401) {
        setError("Unauthorized: Please log in again.");
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to create post");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Create New Post</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setError("");
              setTitle(e.target.value);
            }}
            required
            className="w-full border rounded px-3 py-2"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Content</label>
          <textarea
            value={content}
            onChange={(e) => {
              setError("");
              setContent(e.target.value);
            }}
            required
            className="w-full border rounded px-3 py-2"
            rows={6}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
