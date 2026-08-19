import React, { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import { fetchProducts } from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import type { Product } from '../types';

const OffersPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(all => {
        const sorted = [...all].sort((a, b) => b.discount - a.discount);
        setProducts(sorted.filter(p => p.discount >= 20));
      })
      .catch(() => setError('Unable to load offers.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="bg-stone-900 text-white text-center py-16 sm:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-900 to-stone-900" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Tag size={20} className="text-rose-400" />
            <span className="text-xs tracking-[0.4em] uppercase text-stone-300">Limited Time</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-7xl font-light mb-3">Up to 40% Off</h1>
          <p className="text-stone-300 text-sm">Curated sale on premium fashion, beauty, and accessories.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-stone-500">{products.length} sale items</p>
        </div>
        <ProductGrid products={products} loading={loading} error={error} onRetry={() => window.location.reload()} />
      </div>
    </div>
  );
};

export default OffersPage;
