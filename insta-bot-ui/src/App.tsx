import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import NewsCard from "./components/NewsCard";
import Footer from "./components/Footer";
import CategoryBar from "./components/CategoryBar";
import Papa from "papaparse";

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publisher: string;
  image: string;
  category: string;
}

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState<number>(9); // Show 9 initially

  const defaultImage = "/no-image.png"; // Ensure this image exists in /public

  useEffect(() => {
    fetch("/news_feed.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse<NewsItem>(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        setNewsData(parsed.data);
      })
      .catch((err) => {
        console.error("Error loading news data:", err);
      });
  }, []);

  useEffect(() => {
    setVisibleCount(9); // Reset count when category changes
  }, [filteredCategory]);

  const filteredNews =
    filteredCategory === "All"
      ? newsData
      : newsData.filter((item) => item.category === filteredCategory);

  return (
    <div className="flex min-h-screen bg-gray-100 transition-all duration-300">
      {/* Sidebar */}
      {sidebarOpen && <Sidebar />}

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : ""
        }`}
      >
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <CategoryBar
          selectedCategory={filteredCategory}
          onSelectCategory={setFilteredCategory}
        />

        <main className="px-6 py-10">
          <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
            {filteredCategory === "All" ? "Top News" : `${filteredCategory} News`}
          </h1>

          <div className="flex flex-wrap justify-center gap-8">
            {filteredNews.length > 0 ? (
              filteredNews.slice(0, visibleCount).map((news, index) => (
                <NewsCard
                  key={index}
                  title={news.title}
                  summary={news.summary}
                  imageUrl={news.image || defaultImage}
                  readMoreUrl={news.url}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">No news available.</p>
            )}
          </div>

          {visibleCount < filteredNews.length && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md"
              >
                Show More
              </button>
            </div>
          )}
          {filteredNews.length > 0 && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-6 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full shadow-md z-50"
            >
              ↑ Back to Top
            </button>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
