import React from "react";

const categories = [
    'India',
    'World',
    'Movies',
    'Sport',
    'Data',
    'Health',
    'Opinion',
    'Science',
    'Business'
];

const CategoryBar: React.FC = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md text-black px-6 py-2 overflow-x-auto whitespace-nowrap border-t border-b border-gray-300">
      <div className="flex space-x-6 justify-center">
        {categories.map((category, index) => (
          <button
            key={index}
            className="text-lg font-medium hover:underline focus:outline-none"
          >
            {category}
          </button>
          
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
