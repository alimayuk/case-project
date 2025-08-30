export const fetchProducts = async ({
  query = "",
  sort = "",
  page = 1,
  per_page = 12
}) => {
  const res = await fetch(
    `http://localhost:8000/api/products?query=${query}&sort=${sort}&page=${page}&per_page=${per_page}`
  );

  if (!res.ok) throw new Error("Veri alınamadı");

  const data = await res.json();

  return {
    items: data.data || [],
    total: data.total || 0
  };
};
