import React from "react";

interface NewsProps {
  title: string;
  summary: string;
  imageUrl: string;
  readMoreUrl: string;
}

const NewsCard: React.FC<NewsProps> = ({
  title,
  summary,
  imageUrl,
  readMoreUrl,
}) => {
  const defaultImage = "/no-image.jpg"; // ✅ Ensure this image exists in the public folder

  const validImage = imageUrl?.trim() ? imageUrl : defaultImage;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-md bg-white">
      <img
        className="w-full h-48 object-cover"
        src={validImage}
        alt={title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = defaultImage;
        }}
      />
      <div className="px-6 py-4">
        <h2 className="font-bold text-lg mb-2">{title}</h2>
        <p className="text-gray-700 text-sm">{summary}</p>
        <a
          href={readMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
