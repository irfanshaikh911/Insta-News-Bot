import React from "react";
import { Link } from "react-router-dom";

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  "All",
  "India",
  "World",
  "Movies",
  "Sports",
  "Technology",
  "Health",
];

const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center bg-white py-3 border-b border-gray-200 px-6">
      {/* Centered categories */}
      <div className="flex-1 flex justify-center gap-3 ">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              selectedCategory === category
                ? "bg-purple-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-purple-200"
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {/* Dashboard Button on right */}
      <Link
        to="/dashboard"
        className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition whitespace-nowrap ml-2"
      >
        📊 Dashboard
      </Link>
    </div>
  );
};

export default CategoryBar;
