import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import NewsCard from "./components/NewsCard";
import Footer from "./components/Footer";
import CategoryBar from "./components/CategoryBar";
import Papa from "papaparse";

interface NewsItem {
  title: string;
  summary: string;
  image: string;
  url: string;
  publisher: string;
}

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/news_feed.csv")
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedNews = results.data as NewsItem[];

            // Set fallback image and sort news with missing image at the bottom
            const withImages = parsedNews
              .filter((item) => item.image && item.image.trim() !== "")
              .map((item) => ({
                ...item,
                image: item.image,
              }));

            const withoutImages = parsedNews
              .filter((item) => !item.image || item.image.trim() === "")
              .map((item) => ({
                ...item,
                image: "/no-image.jpg", // fallback image
              }));

            setNews([...withImages, ...withoutImages]);
          },
        });
      })
      .catch((err) => console.error("Failed to fetch news:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 transition-all duration-300">
      {sidebarOpen && <Sidebar />}

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : ""
        }`}
      >
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <CategoryBar />

        <main className="px-6 py-10">
          <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Top News
          </h1>

          <div className="flex flex-wrap justify-center gap-8">
            {news.length > 0 ? (
              news.map((item, index) => (
                <NewsCard
                  key={index}
                  title={item.title}
                  summary={item.summary}
                  imageUrl={item.image}
                  readMoreUrl={item.url}
                />
              ))
            ) : (
              <p className="text-gray-500">Loading news...</p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
