import React, { useState } from "react";
import "./SocialMediaPreview.css"; // For heart animation

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
  const [liked, setLiked] = useState(false);

  const defaultImage = "/no-image.jpg";
  const combinedHashtags = hashtags.map((tag) => `#${tag}`).join(" ");

  const handleLike = () => {
    if (platform === "instagram") {
      setLiked(true);
      setTimeout(() => setLiked(false), 600);
    }
  };

  const logos = {
    instagram: "/src/assets/instagram.png",
    facebook: "/src/assets/fb-logo.png",
    twitter: "/src/assets/twitter-logo.png",
    whatsapp: "/src/assets/wa-logo.png",
  };

  const names = {
    instagram: "InstaNews",
    facebook: "Facebook News",
    twitter: "NewsTweet",
    whatsapp: "InstaWhats",
  };

  const icons = {
    instagram: [
      "/src/assets/like.png",
      "/src/assets/comment.png",
      "/src/assets/send.png",
      "/src/assets/save.png",
    ],
    facebook: [
      "/src/assets/fb-like.png",
      "/src/assets/fb-comment.png",
      "/src/assets/fb-share.png",
    ],
    twitter: [
      "/src/assets/twitter-like.png",
      "/src/assets/twitter-comment.png",
      "/src/assets/twitter-retweet.png",
      "/src/assets/twitter-share.png",
    ],
    whatsapp: [
      "/src/assets/wa-chat.png",
      "/src/assets/wa-send.png",
      "/src/assets/wa-emoji.png",
      "/src/assets/wa-share.png",
    ],
  };

  const platformStyles = {
    instagram: {
      wrapper: "bg-gradient-to-tr from-pink-500 to-yellow-400",
      border: "border-0.1 border-pink-400",
      shadow: "shadow-pink-200",
      timestamp: "2h ago",
    },
    facebook: {
      wrapper: "bg-white",
      border: "border-4 border-blue-600",
      shadow: "shadow-blue-200",
      timestamp: "3h ago",
    },
    twitter: {
      wrapper: "bg-white",
      border: "border-4 border-cyan-500",
      shadow: "shadow-cyan-200",
      timestamp: "1h ago",
    },
    whatsapp: {
      wrapper: "bg-white",
      border: "border-4 border-green-500",
      shadow: "shadow-green-200",
      timestamp: "5m ago",
    },
  };

  const styles = platformStyles[platform];

  return (
    <div
      className={`relative w-full max-w-[360px] min-h-[500px] rounded-2xl p-2 transition-transform transform hover:scale-[1.02] ${styles.wrapper} ${styles.shadow} ${styles.border}`}
    >
      <div className="bg-white w-full h-full rounded-xl overflow-hidden p-3 text-sm flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <img
              src={logos[platform]}
              alt={`${platform} logo`}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <span className="font-bold text-sm block">{names[platform]}</span>
              <span className="text-xs text-gray-500">{styles.timestamp}</span>
            </div>
          </div>
          <span className="text-gray-500 text-lg">•••</span>
        </div>

        {/* Image */}
        <img
          src={image || defaultImage}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
          alt="news"
          className="w-full h-48 object-cover rounded-md mb-3"
        />

        {/* Action Icons */}
        <div className="flex justify-between items-center px-1 text-gray-600 mb-2 relative">
          <div className="flex gap-3">
            {platform === "instagram" ? (
              <img
                src="/src/assets/like.png"
                alt="like"
                onClick={handleLike}
                className="w-5 h-5 cursor-pointer relative"
              />
            ) : (
              icons[platform]
                .slice(0, -1)
                .map((icon, idx) => (
                  <img key={idx} src={icon} alt={`icon-${idx}`} className="w-5 h-5 cursor-pointer" />
                ))
            )}
          </div>
          <img
            src={icons[platform][icons[platform].length - 1]}
            alt="end-icon"
            className="w-5 h-5 cursor-pointer"
          />

          {liked && platform === "instagram" && (
            <div className="heart-animation absolute left-4 -top-3 text-4xl">❤️</div>
          )}
        </div>

        {/* Reactions */}
        {platform === "facebook" && (
          <p className="text-sm mb-1">👍 ❤️ 😆 😢 😡 · 234 reactions · 12 comments</p>
        )}
        {platform === "twitter" && (
          <p className="text-sm mb-1">❤️ 😆 🔁 💬 · 567 retweets</p>
        )}
        {platform === "whatsapp" && (
          <p className="text-sm mb-1">📲 Sent to 42 chats</p>
        )}
        {platform === "instagram" && (
          <p className="text-sm mb-1">122 likes</p>
        )}

        {/* Title & Summary */}
        <p className="font-bold mb-1">{title}</p>
        <p className="text-gray-700 flex-1">{summary.slice(0, 150)}...</p>

        {/* Publisher */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 font-semibold">
          <span>Publisher: {publisher}</span>
        </div>

        {/* Hashtags */}
        {(platform === "instagram" || platform === "twitter") && (
          <p className="text-xs mt-2 text-purple-700 font-semibold truncate">
            {combinedHashtags}
          </p>
        )}
      </div>
    </div>
  );
};

export default SocialMediaPreview;
