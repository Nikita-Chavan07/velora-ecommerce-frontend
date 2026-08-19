import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import type { Product } from '../types';

const NewArrivalsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(all => setProducts(all.filter(p => p.isNew)))
      .catch(() => setError('Unable to load new arrivals.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="relative h-56 sm:h-72 overflow-hidden bg-stone-900">
        <img
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1600&q=80"
          alt=""
          className="w-full h-full object-cover opacity-40"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-xs tracking-[0.4em] uppercase text-stone-300 mb-2">Just In</p>
          <h1 className="font-serif text-5xl font-light">New Arrivals</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <ProductGrid products={products} loading={loading} error={error} onRetry={() => window.location.reload()} />
      </div>
    </div>
  );
};

export default NewArrivalsPage;
