import React, { useState, useEffect, useCallback, useMemo } from "react";
import debounce from "lodash/debounce";
import { ProductCard, SkeletonLoader, EmptyState, ErrorState } from ".";

const ProductGrid = ({ fetcher, initialQuery = "", pageSize = 12 }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const mapSortToApi = (sortValue) =>
    sortValue === "price-asc"
      ? "price"
      : sortValue === "price-desc"
      ? "-price"
      : "-created_at";

  const fetchProducts = useCallback(
    async (searchQuery, sortBy, pageNum) => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          query: searchQuery,
          sort: mapSortToApi(sortBy),
          page: pageNum,
          per_page: pageSize,
        };
        const result = await fetcher(params);
        setProducts(
          pageNum === 1 ? result.items : [...products, ...result.items]
        );
        setTotal(result.total);
        setHasMore(result.items.length === pageSize);
      } catch (err) {
        setError("Servis hatası.");
      } finally {
        setLoading(false);
      }
    },
    [fetcher, pageSize, products]
  );

  const debouncedSearch = useMemo(
    () => debounce((q, s, p) => fetchProducts(q, s, p), 300),
    [fetchProducts]
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setPage(1);
    debouncedSearch(val, sort, 1);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    setPage(1);
    fetchProducts(query, val, 1);
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchProducts(query, sort, next);
  };

  useEffect(() => {
    fetchProducts(initialQuery, sort, 1);
    return () => debouncedSearch.cancel();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Ara
          </label>
          <input
            id="search"
            type="text"
            placeholder="Ürün ara..."
            value={query}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="sort" className="sr-only">
            Sırala
          </label>
          <select
            id="sort"
            value={sort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">En Yeniler</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
          </select>
        </div>
      </div>

      {error ? (
        <ErrorState
          error={error}
          onRetry={() => fetchProducts(query, sort, 1)}
        />
      ) : loading && page === 1 ? (
        <SkeletonLoader count={pageSize} />
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Yükleniyor..." : "Daha Fazla Yükle"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
