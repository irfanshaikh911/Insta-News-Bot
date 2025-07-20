// App.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
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
  full_story: string;
}

const App = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [shuffledNews, setShuffledNews] = useState<NewsItem[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState<number>(9);

  const defaultImage = "/no-image.jpg";

  const shuffleArrayWithImagePriority = (array: NewsItem[]) => {
    const withImage = array.filter((item) => item.image?.trim());
    const withoutImage = array.filter((item) => !item.image?.trim());

    const shuffle = (arr: NewsItem[]) =>
      arr
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return [...shuffle(withImage), ...shuffle(withoutImage)];
  };

  useEffect(() => {
    fetch("/news_feed.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse<NewsItem>(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        const data = parsed.data;
        setNewsData(data);

        const shuffled = shuffleArrayWithImagePriority([...data]);
        setShuffledNews(shuffled);
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
      ? shuffledNews
      : newsData.filter((item) => item.category === filteredCategory);

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">

      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Category Selector */}
      <CategoryBar
        selectedCategory={filteredCategory}
        onSelectCategory={setFilteredCategory}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          {filteredCategory === "All" ? "Top News" : `${filteredCategory} News`}
        </h1>

        <div className="flex flex-wrap justify-center gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.slice(0, visibleCount).map((news, index) => (
              <Link
                to={`/news/${encodeURIComponent(news.title)}`}
                key={`${news.title}-${index}`}
                className="hover:scale-[1.01] transition-transform"
              >
                <NewsCard
                  title={news.title}
                  summary={news.summary}
                  imageUrl={news.image || defaultImage}
                  readMoreUrl={news.url}
                />
              </Link>
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
      </main>

      {/* Back to Top */}
      {filteredNews.length > 0 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full shadow-md z-50"
        >
          ↑ Back to Top
        </button>
      )}

      <Footer />
    </div>
  );

};

export default App;
