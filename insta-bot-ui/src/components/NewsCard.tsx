// src/components/NewsCard.tsx
import React from "react";

interface NewsCardProps {
  title: string;
  summary: string;
  imageUrl: string;
  readMoreUrl: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, summary, imageUrl, readMoreUrl }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col w-full sm:w-80 md:w-96 transition-transform hover:scale-105">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{title}</h2>
        <p className="text-sm text-gray-600 line-clamp-3">{summary}</p>
        <a
          href={readMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 text-sm w-fit"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
