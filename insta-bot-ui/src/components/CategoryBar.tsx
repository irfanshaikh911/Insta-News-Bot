import React from "react";

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = ["All", "India", "World", "Movies", "Sports", "Technology", "Health"];

const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex justify-center gap-4 bg-white py-3 border-b border-gray-200">
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
  );
};

export default CategoryBar;
