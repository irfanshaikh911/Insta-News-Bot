// src/components/SocialMediaPreview.tsx
import React from "react";

interface Props {
  platform: "instagram" | "facebook" | "twitter" | "whatsapp";
  image: string;
  title: string;
  summary: string;
  hashtags?: string[];
  publisher: string;
}

const SocialMediaPreview: React.FC<Props> = ({
  platform,
  image,
  title,
  summary,
  hashtags = [],
  publisher,
}) => {
  const defaultImage = "/no-image.jpg";
  const combinedHashtags = hashtags.map((tag) => `#${tag}`).join(" ");

  const renderHeader = () => {
    const logos: Record<string, string> = {
      instagram: "/assets/our-logo.jpg",
      facebook: "/assets/fb-logo.png",
      twitter: "/assets/twitter-logo.png",
      whatsapp: "/assets/wa-logo.png",
    };

    const names: Record<string, string> = {
      instagram: "InstaNews",
      facebook: "Facebook News",
      twitter: "NewsTweet",
      whatsapp: "InstaWhats",
    };

    return (
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img
            src={logos[platform]}
            alt="Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-bold text-sm">{names[platform]}</span>
        </div>
        <span className="text-gray-500">•••</span>
      </div>
    );
  };

  const renderActions = () => {
    const icons: Record<string, string[]> = {
      instagram: ["/assets/like.png", "/assets/comment.png", "/assets/send.png", "/assets/save.png"],
      facebook: ["/assets/fb-like.png", "/assets/fb-comment.png", "/assets/fb-share.png"],
      twitter: [
        "/assets/twitter-comment.png",
        "/assets/twitter-retweet.png",
        "/assets/twitter-like.png",
        "/assets/twitter-share.png",
      ],
      whatsapp: [
        "/assets/wa-chat.png",
        "/assets/wa-send.png",
        "/assets/wa-emoji.png",
        "/assets/wa-share.png",
      ],
    };

    const platformIcons = icons[platform];

    return (
      <div className="flex justify-between items-center px-1 text-gray-600 mb-2">
        <div className="flex gap-3">
          {platformIcons.slice(0, -1).map((icon, idx) => (
            <img key={idx} src={icon} alt={`icon-${idx}`} className="w-5 h-5 cursor-pointer" />
          ))}
        </div>
        <img
          src={platformIcons[platformIcons.length - 1]}
          alt="end-icon"
          className="w-5 h-5 cursor-pointer"
        />
      </div>
    );
  };

  return (
    <div
      className={`relative w-[340px] h-[490px] rounded-lg shadow-xl p-2 ${
        platform === "instagram"
          ? "bg-gradient-to-tr from-pink-500 to-yellow-400"
          : "bg-white border"
      }`}
    >
      <div className="bg-white w-full h-full rounded-md overflow-hidden p-3 text-sm">
        {/* Header */}
        {renderHeader()}

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

        {/* Actions */}
        {renderActions()}

        {/* Likes (Instagram only) */}
        {platform === "instagram" && (
          <p className="text-sm font-semibold mb-1">122 likes</p>
        )}

        {/* Content */}
        <p className="font-bold">{title}</p>
        <p className="mt-1">{summary.slice(0, 150)}...</p>

        {/* Publisher */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 font-semibold">
          <span>Publisher: {publisher}</span>
        </div>

        {/* Hashtags (for Instagram & Twitter) */}
        {(platform === "instagram" || platform === "twitter") && (
          <p className="text-xs mt-2 text-purple-700 font-semibold">
            {combinedHashtags}
          </p>
        )}
      </div>
    </div>
  );
};

export default SocialMediaPreview;
