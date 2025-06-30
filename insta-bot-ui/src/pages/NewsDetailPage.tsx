// src/pages/NewsDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Papa from "papaparse";
import Navbar from "../components/Navbar";
import SocialMediaPreview from "../components/SocialMediaPreview";

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
  const [platform, setPlatform] = useState<"instagram" | "facebook" | "twitter" | "whatsapp">("instagram");

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

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!newsItem) return <p className="text-center mt-10 text-red-500">Article not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10 items-start">
        {/* Left: Main Content */}
        <div className="flex-1">
          <Link to="/" className="text-purple-700 underline mb-4 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-extrabold mb-4 drop-shadow">
            {newsItem.title}
          </h1>
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
        </div>

        {/* Right: Social Preview */}
        <div className="flex flex-col py-14 items-center w-full md:w-[370px] mt-20 md:mt-0">
          <h2 className="text-xl text-pink-500 font-bold mb-4">
            Preview on {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </h2>

          <SocialMediaPreview
            platform={platform}
            image={newsItem.image}
            title={newsItem.title}
            summary={newsItem.summary}
            hashtags={["Breaking", newsItem.category, "News"]}
            publisher={newsItem.publisher}
          />

          {/* Platform Switch Buttons */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {["instagram", "facebook", "twitter", "whatsapp"].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p as any)}
                className={`px-3 py-2 rounded text-white font-medium ${
                  platform === p
                    ? "bg-purple-700"
                    : "bg-gray-500 hover:bg-gray-600"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <button className="mt-4 w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800">
            Post Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
