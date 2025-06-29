import React from "react";

interface CategoryBarProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const categories = [
  "India",
  "World",
  "Movies",
  "Sport",
  "Data",
  "Health",
  "Opinion",
  "Science",
  "Business",
];

const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelect,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md text-black px-6 py-2 overflow-x-auto whitespace-nowrap border-t border-b border-gray-300">
      <div className="flex space-x-6 justify-center min-w-max">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onSelect(category)}
            className={`text-base font-medium transition-colors ${
              selectedCategory === category
                ? "text-purple-700 border-b-2 border-purple-700"
                : "hover:text-purple-500"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
