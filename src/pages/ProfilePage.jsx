import React, { useEffect, useState } from "react";
import { FaEye, FaHeart } from "react-icons/fa";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://backend-blog-rmrt.onrender.com/posts/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserData({ name: user.name, email: user.email });

    fetchData();
  }, [token]);

  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  const totalLikes = posts.reduce((acc, post) => acc + (post.likes_count || 0), 0);
  const totalViews = posts.reduce((acc, post) => acc + (post.views || 0)/2, 0);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 space-y-6">
      {/* User Info */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">User Info</h2>
        <p className="text-gray-700 mb-2">
          <strong>Name:</strong> {userData.name}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {userData.email}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-blue-100 text-blue-800 rounded-xl p-6 shadow text-center">
          <p className="text-lg font-semibold">Blogs</p>
          <p className="text-5xl font-bold">{posts.length}</p>
        </div>
        <div className="bg-red-100 text-red-800 rounded-xl p-6 shadow text-center">
          <p className="text-lg font-semibold flex justify-center items-center gap-2">
            <FaHeart size={22} /> Total Likes
          </p>
          <p className="text-5xl font-bold">{totalLikes}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 rounded-xl p-6 shadow text-center">
          <p className="text-lg font-semibold flex justify-center items-center gap-2">
            <FaEye size={22} /> Total Views
          </p>
          <p className="text-5xl font-bold">{totalViews}</p>
        </div>
      </div>

      {/* Blog Cards */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Your Blogs</h3>
        {posts.length === 0 ? (
          <p className="text-gray-500">You haven't written any posts yet.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
                <div className="flex gap-6 text-gray-600 mt-2">
                  <div className="flex items-center gap-2">
                    <FaHeart className="text-red-600" size={22} />
                    <span className="text-base">{post.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye className="text-blue-600" size={22} />
                    <span className="text-base">{(post.views || 0)/2}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
