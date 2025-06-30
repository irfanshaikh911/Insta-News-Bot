import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Papa from "papaparse";
import Navbar from "../components/Navbar";

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publisher: string;
  image: string;
  category: string;
  full_story: string;
}

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const decodedTitle = decodeURIComponent(id || "");
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const defaultImage = "/no-image.jpg";

  useEffect(() => {
    fetch("/news_feed.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse<NewsItem>(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        const item = parsed.data.find((item) => item.title === decodedTitle);
        if (item) setNewsItem(item);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading article...</p>;
  }

  if (!newsItem) {
    return <p className="text-center mt-10 text-red-500">Article not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link to="/" className="text-purple-700 underline mb-4 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-semibold">Publisher:</span> {newsItem.publisher} |{" "}
          <span className="font-semibold">Category:</span> {newsItem.category}
        </p>

        <img
          src={newsItem.image?.trim() || defaultImage}
          alt={newsItem.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
          className="w-full h-auto object-contain rounded mb-6 max-h-[500px]"
        />

        <p className="text-lg whitespace-pre-line mb-6">
          {newsItem.full_story || "Full story not available."}
        </p>

        <a
          href={newsItem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
        >
          Read Original Article →
        </a>

        {/* POST NOW SECTION */}
        <div className="mt-10 flex flex-col md:flex-row justify-between gap-10">
          {/* LEFT: PREVIEW */}
          <div className="flex-1 max-w-xl">
            {selectedPlatform && newsItem && (
              <div className="bg-white shadow-md rounded-lg overflow-hidden border max-w-sm mx-auto">
                {/* Platform Header */}
                {selectedPlatform === "Instagram" && (
                  <div className="px-4 py-2 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full" />
                      <span className="font-semibold text-sm">insta_user</span>
                    </div>
                    <div className="text-gray-500 text-xl">⋯</div>
                  </div>
                )}

                {selectedPlatform === "Facebook" && (
                  <div className="bg-blue-600 px-4 py-2 text-white font-semibold">
                    Facebook Post Preview
                  </div>
                )}

                {selectedPlatform === "Twitter" && (
                  <div className="bg-blue-400 px-4 py-2 text-white font-semibold">
                    Twitter Post Preview
                  </div>
                )}

                {selectedPlatform === "WhatsApp" && (
                  <div className="bg-green-500 px-4 py-2 text-white font-semibold">
                    WhatsApp Post Preview
                  </div>
                )}

                {/* Image */}
                <img
                  src={newsItem.image || defaultImage}
                  alt="preview"
                  className="w-full h-[360px] object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultImage;
                  }}
                />

                {/* Caption */}
                <div className="p-4">
                  <p className="text-sm mb-2">
                    <span className="font-bold">@instabot </span>
                    {newsItem.title.slice(0, 150)}...
                  </p>

                  {selectedPlatform === "Twitter" && (
                    <p className="text-xs text-gray-500">
                      #{newsItem.category.replace(/\s+/g, "")}
                    </p>
                  )}

                  {selectedPlatform === "WhatsApp" && (
                    <div className="text-xs text-green-600 mt-2">
                      📢 Forwarded Message
                      <p className="text-sm text-black">{newsItem.title}</p>
                    </div>
                  )}

                  <a
                    href={newsItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs underline mt-2 block"
                  >
                    Original Source →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: BUTTONS */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold mb-2">📤 Post Now</h3>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white"
              onClick={() => setSelectedPlatform("Instagram")}
            >
              📷 Instagram
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white"
              onClick={() => setSelectedPlatform("Facebook")}
            >
              📘 Facebook
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded bg-blue-400 text-white"
              onClick={() => setSelectedPlatform("Twitter")}
            >
              🐦 Twitter
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white"
              onClick={() => setSelectedPlatform("WhatsApp")}
            >
              📲 WhatsApp
            </button>

            {selectedPlatform && (
              <button
                onClick={() =>
                  alert(`✅ Post prepared for ${selectedPlatform}`)
                }
                className="mt-4 bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded shadow"
              >
                Continue →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
