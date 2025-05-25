import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (query = "") => {
    setLoading(true);
    try {
      const response = await fetch(`https://backend-blog-rmrt.onrender.com/posts/?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPosts(search);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📰 Blog Posts</h1>

      {/* 🔍 Search Field */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search by title or content:
        </label>
        <input
          id="search"
          type="text"
          placeholder="Type to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* 🕓 Loading or Results */}
      {loading ? (
        <p className="text-gray-500">Loading posts...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-100 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-2">{post.content.slice(0, 100)}...</p>
            <p className="text-sm text-gray-500 mb-2">
              By <span className="font-semibold">{post.author}</span> on {new Date(post.date).toLocaleDateString("en-GB")}
            </p>

            <Link
              to={`/posts/${post.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              Read More
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No posts found.</p>
      )}
    </div>
  );
}
