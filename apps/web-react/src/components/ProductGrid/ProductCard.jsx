import React from "react";

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="bg-gray-200 h-48 flex items-center justify-center">
      <span className="text-gray-400">🖼️ Resim Yok</span>
    </div>
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-2">{product.sku}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-blue-600">
          {product.price.toFixed(2)} ₺
        </span>
        <span
          className={`text-sm px-2 py-1 rounded ${
            product.status === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.status === 1 ? "Stokta" : "Stokta Yok"}
        </span>
      </div>
    </div>
  </div>
);

export default ProductCard;
