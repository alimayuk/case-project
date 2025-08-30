import './App.css';
import { ProductGrid } from './components/ProductGrid';
import { fetchProducts } from './services/productService';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Ürün Listesi</h1>
      <ProductGrid fetcher={fetchProducts} />
    </div>
  );
}

export default App;
