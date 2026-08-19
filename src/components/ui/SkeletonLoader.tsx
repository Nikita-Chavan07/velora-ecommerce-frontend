import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  type?: 'product' | 'text' | 'banner';
}

const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-stone-100">
    <div className="skeleton-shimmer aspect-[3/4] w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton-shimmer h-3 w-2/3 rounded-full" />
      <div className="skeleton-shimmer h-4 w-full rounded-full" />
      <div className="skeleton-shimmer h-3 w-1/2 rounded-full" />
      <div className="flex items-center gap-2 mt-2">
        <div className="skeleton-shimmer h-5 w-16 rounded-full" />
        <div className="skeleton-shimmer h-4 w-12 rounded-full" />
      </div>
    </div>
  </div>
);

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 8, type = 'product' }) => {
  if (type === 'banner') {
    return <div className="skeleton-shimmer h-96 md:h-[500px] w-full rounded-2xl" />;
  }

  if (type === 'text') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-4 rounded-full" style={{ width: `${60 + Math.random() * 40}%` }} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
