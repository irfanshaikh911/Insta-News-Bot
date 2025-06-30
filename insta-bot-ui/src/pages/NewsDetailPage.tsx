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

      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <Link to="/" className="text-purple-700 underline mb-4 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Publisher:</span> {newsItem.publisher} | <span className="font-semibold">Category:</span> {newsItem.category}
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

        <div className="">
          <h2 className="text-xl font-bold mb-4">Post Now</h2>

          <SocialMediaPreview
            image={newsItem.image}
            title={newsItem.title}
            summary={newsItem.summary}
            hashtags={["Breaking", newsItem.category, "News"]}
          />

          <div className="mt-6 flex flex-col gap-3">
            <button className="bg-pink-600 text-white py-2 rounded">Instagram</button>
            <button className="bg-blue-600 text-white py-2 rounded">Facebook</button>
            <button className="bg-cyan-500 text-white py-2 rounded">Twitter</button>
            <button className="bg-green-600 text-white py-2 rounded">WhatsApp</button>
            <button className="mt-2 bg-purple-700 text-white py-2 rounded hover:bg-purple-800">Continue →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
