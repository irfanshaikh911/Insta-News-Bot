import React, { useEffect, useState } from "react";
import Papa from "papaparse";

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publisher: string;
  image?: string;
}

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/news_feed.csv")
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setNews(results.data as NewsItem[]);
          },
        });
      })
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {news.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-md shadow-md overflow-hidden"
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{item.summary}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 mt-3 inline-block hover:underline"
            >
              Read More →
            </a>
            <div className="text-xs text-right mt-2 text-gray-400">
              — {item.publisher}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsSection;
