import React from 'react';
import type { Product } from '../../types';
import ProductCard from './ProductCard';
import EmptyState from '../ui/EmptyState';
import SkeletonLoader from '../ui/SkeletonLoader';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  columns?: 2 | 3 | 4;
  skeletonCount?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  error = null,
  onRetry,
  onClearFilters,
  columns = 4,
  skeletonCount = 8,
}) => {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (loading) return <SkeletonLoader count={skeletonCount} />;

  if (error) {
    return <EmptyState type="error" message={error} onAction={onRetry} actionLabel="Try Again" />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        type="search"
        message="No products match your search or filters."
        onAction={onClearFilters}
        actionLabel="Clear Filters"
      />
    );
  }

  return (
    <div className={`grid ${colClass} gap-4 md:gap-6`}>
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-in"
          style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
