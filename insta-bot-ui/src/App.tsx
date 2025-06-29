import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import NewsCard from "./components/NewsCard";
import Footer from "./components/Footer";
import CategoryBar from "./components/CategoryBar";



const sampleNews = [
  {
    title: "India launches new space mission to explore the Sun",
    summary:
      "The Indian Space Research Organisation (ISRO) has launched its Aditya-L1 mission to study solar activities and their effects on space weather.",
    imageUrl: "https://source.unsplash.com/600x400/?space,sun,rocket",
    readMoreUrl: "https://example.com/article-1",
  },
  {
    title: "AI Revolutionizing Healthcare in Rural Areas",
    summary:
      "Artificial Intelligence is bringing diagnostics and patient monitoring tools to rural clinics across India, improving healthcare access.",
    imageUrl: "https://source.unsplash.com/600x400/?ai,healthcare",
    readMoreUrl: "https://example.com/article-2",
  },
  {
    title: "Global Markets React to Tech Boom",
    summary:
      "Stock markets around the globe see positive momentum amid increasing investments in AI and cloud technology firms.",
    imageUrl: "https://source.unsplash.com/600x400/?stock,market,tech",
    readMoreUrl: "https://example.com/article-3",
  },
];

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 transition-all duration-300">
      {/* Sidebar inline instead of overlay */}
      {sidebarOpen && <Sidebar />}

      {/* Main content shifted if sidebar is open */}
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
            {sampleNews.map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
