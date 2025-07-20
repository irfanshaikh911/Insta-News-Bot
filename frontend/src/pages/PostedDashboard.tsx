import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface PostedNews {
  title: string;
  summary: string;
  image: string;
  url: string;
  platform: string;
  timestamp: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<PostedNews[]>([]);
  const [filtered, setFiltered] = useState<PostedNews[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  useEffect(() => {
    fetch("https://insta-news-bot-1.onrender.com/")
      .then((res) => res.json())
      .then((data) => {
        const reversed = data.reverse();
        setPosts(reversed);
        setFiltered(reversed);
      });
  }, []);

  const handleFilter = (platform: string) => {
    setPlatformFilter(platform);
    if (platform === "all") setFiltered(posts);
    else setFiltered(posts.filter((p) => p.platform === platform));
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Delete this post log?")) return;
    await fetch(`https://insta-news-bot-1.onrender.com/posted/${index}`, { method: "DELETE" });
    window.location.reload();
  };

  const handleEdit = async (index: number) => {
    const newTitle = prompt("Edit title:", posts[index].title);
    if (!newTitle) return;
    await fetch(`https://insta-news-bot-1.onrender.com/posted/${index}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">📊 Posted News Dashboard</h1>
        <Link
          to="/"
          className="text-sm px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="mb-6 space-x-2">
        {["all", "instagram", "facebook", "twitter", "whatsapp"].map((platform) => (
          <button
            key={platform}
            onClick={() => handleFilter(platform)}
            className={`px-4 py-1 rounded text-sm font-semibold ${
              platformFilter === platform
                ? "bg-purple-700 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post, index) => (
            <div key={index} className="bg-white shadow-md rounded p-4 border relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h2 className="text-lg font-bold mb-1">{post.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(post.timestamp).toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-gray-800 line-clamp-3">{post.summary}</p>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline mt-2 inline-block text-sm"
              >
                Read Original
              </a>
              <span
                className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${
                  post.status === "Posted"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {post.status === "Posted" ? "✅ Posted" : "❌ Failed"}
              </span>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(posts.length - 1 - index)}
                  className="px-3 py-1 text-xs bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(posts.length - 1 - index)}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;