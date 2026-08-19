import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar, { MobileFilterDrawer } from '../components/product/FilterSidebar';
import type { Product, FilterState } from '../types';
import { fetchProducts } from '../services/api';

const DEFAULT_FILTERS: FilterState = {
  category: [],
  gender: [],
  priceMin: 0,
  priceMax: 50000,
  rating: 0,
  availability: '',
  sortBy: 'featured',
  search: '',
};

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'discount', label: 'Biggest Discount' },
];

interface ShopPageProps {
  defaultCategory?: string;
  defaultGender?: string;
  pageTitle?: string;
  heroImage?: string;
}

const ShopPage: React.FC<ShopPageProps> = ({
  defaultCategory,
  defaultGender,
  pageTitle = 'All Products',
  heroImage,
}) => {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: defaultCategory ? [defaultCategory] : [],
    gender: defaultGender ? [defaultGender] : [],
    search: searchParams.get('search') ?? '',
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    fetchProducts()
      .then(setAllProducts)
      .catch(() => setError('Unable to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  // Sync search param changes
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setFilters(prev => ({ ...prev, search: q }));
    const cat = searchParams.get('category');
    if (cat) setFilters(prev => ({ ...prev, category: [cat] }));
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (filters.category.length > 0) {
      result = result.filter(p => filters.category.includes(p.category));
    }

    // Gender filter
    if (filters.gender.length > 0) {
      result = result.filter(p => filters.gender.includes(p.gender));
    }

    // Price filter
    result = result.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter(p => p.rating >= filters.rating);
    }

    // Availability filter
    if (filters.availability === 'instock') result = result.filter(p => p.stock > 0);
    if (filters.availability === 'outofstock') result = result.filter(p => p.stock === 0);

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'discount': result.sort((a, b) => b.discount - a.discount); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [allProducts, filters]);

  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
    setVisibleCount(12);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      category: defaultCategory ? [defaultCategory] : [],
      gender: defaultGender ? [defaultGender] : [],
    });
    setVisibleCount(12);
  }, [defaultCategory, defaultGender]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div>
      {/* Hero */}
      <div className="relative h-48 sm:h-64 overflow-hidden bg-stone-900">
        {heroImage && (
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-50" aria-hidden="true" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-light">{pageTitle}</h1>
          {filters.search && (
            <p className="mt-2 text-stone-300 text-sm">Results for "{filters.search}"</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-700 hover:border-stone-400 transition-colors"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <p className="text-sm text-stone-500">
              {loading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={e => handleFilterChange({ sortBy: e.target.value })}
              className="appearance-none border border-stone-200 rounded-lg pl-3 pr-8 py-2 text-sm text-stone-700 bg-white focus:outline-none focus:border-stone-400 cursor-pointer"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            productCount={filteredProducts.length}
          />

          {/* Mobile filter drawer */}
          <MobileFilterDrawer
            isOpen={mobileFiltersOpen}
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            onMobileClose={() => setMobileFiltersOpen(false)}
            productCount={filteredProducts.length}
          />

          {/* Products */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={visibleProducts}
              loading={loading}
              error={error}
              onRetry={() => {
                setLoading(true);
                setError(null);
                fetchProducts()
                  .then(setAllProducts)
                  .catch(() => setError('Unable to load products.'))
                  .finally(() => setLoading(false));
              }}
              onClearFilters={handleClearFilters}
            />

            {/* Load More */}
            {!loading && !error && hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="px-10 py-3 border border-stone-900 text-stone-900 text-sm font-medium hover:bg-stone-900 hover:text-white transition-colors rounded-lg"
                >
                  Load More ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
