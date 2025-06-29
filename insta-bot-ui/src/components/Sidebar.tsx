import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-lg p-4 fixed top-0 left-0 z-10">
      <h2 className="text-xl font-bold mb-6">InstaBot Menu</h2>
      <ul className="space-y-4 text-gray-700">
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">Auto Like</a></li>
        <li><a href="#">Auto Comment</a></li>
        <li><a href="#">Analytics</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
