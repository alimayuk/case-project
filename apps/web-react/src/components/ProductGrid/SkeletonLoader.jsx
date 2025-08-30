import React from "react";

const SkeletonLoader = ({ count }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
        <div className="bg-gray-300 h-4 rounded mb-2"></div>
        <div className="bg-gray-300 h-4 rounded w-2/3 mb-4"></div>
        <div className="bg-gray-300 h-6 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
