import React from "react";

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 text-6xl mb-4">🛍️</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Ürün bulunamadı
    </h3>
    <p className="text-gray-500">
      Arama kriterlerinize uygun ürün bulunamadı. Farklı kelimelerle tekrar deneyin.
    </p>
  </div>
);

export default EmptyState;
