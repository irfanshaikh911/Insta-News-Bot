// src/components/SocialMediaPreview.tsx
import React from "react";

interface Props {
  image: string;
  title: string;
  summary: string;
  hashtags?: string[];
}

const SocialMediaPreview: React.FC<Props> = ({ image, title, summary, hashtags = [] }) => {
  const defaultImage = "/no-image.jpg";
  const combinedHashtags = hashtags.map((tag) => `#${tag}`).join(" ");

  return (
    <div className="relative w-[320px] h-[520px] bg-gradient-to-tr from-pink-500 to-yellow-400 p-2 rounded-lg shadow-xl">
      <div className="bg-white w-full h-full rounded-md overflow-hidden p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-gray-300 w-8 h-8 rounded-full" />
            <span className="font-bold text-sm">InstaBot</span>
          </div>
          <span className="text-gray-500">...</span>
        </div>

        {/* Image */}
        <img
          src={image || defaultImage}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
          alt="news"
          className="w-full h-48 object-cover rounded mb-3"
        />

        {/* Likes + Buttons */}
        <div className="flex justify-between items-center px-1 text-lg text-gray-600 mb-1">
          <div className="flex gap-3">
            <span>♡</span>
            <span>💬</span>
            <span>📤</span>
          </div>
          <span>🔖</span>
        </div>

        <p className="text-sm font-semibold mb-1">122 likes</p>

        {/* Content */}
        <p className="text-sm">
          <span className="font-bold mr-1">InstaBot</span>
          {summary.slice(0, 80)}...
        </p>

        <p className="text-xs mt-2 text-purple-700 font-semibold">
          {combinedHashtags}
        </p>
      </div>
    </div>
  );
};

export default SocialMediaPreview;
