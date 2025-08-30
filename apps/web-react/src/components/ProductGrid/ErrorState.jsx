import React from "react";

const ErrorState = ({ error, onRetry }) => (
  <div className="text-center py-12">
    <div className="text-red-400 text-6xl mb-4">⚠️</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Bir hata oluştu
    </h3>
    <p className="text-gray-500 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
    >
      Tekrar Dene
    </button>
  </div>
);

export default ErrorState;
