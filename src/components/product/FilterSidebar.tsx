import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { FilterState } from '../../types';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  onClear: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  productCount?: number;
}

const CATEGORIES = [
  { value: 'fashion', label: 'Fashion' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'skincare', label: 'Skincare' },
  { value: 'makeup', label: 'Makeup' },
  { value: 'accessories', label: 'Accessories' },
];

const GENDERS = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'unisex', label: 'Unisex' },
];

const RATINGS = [
  { value: 4, label: '4 Stars & Above' },
  { value: 3, label: '3 Stars & Above' },
  { value: 0, label: 'All Ratings' },
];

const AVAILABILITY = [
  { value: '', label: 'All' },
  { value: 'instock', label: 'In Stock' },
  { value: 'outofstock', label: 'Out of Stock' },
];

const FilterContent: React.FC<FilterSidebarProps> = ({ filters, onChange, onClear, productCount, onMobileClose }) => {
  const toggleArrayFilter = (key: 'category' | 'gender', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ [key]: updated });
  };

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.gender.length > 0 ||
    filters.rating > 0 ||
    filters.availability !== '' ||
    filters.priceMin > 0 ||
    filters.priceMax < 500;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-stone-700" />
          <h2 className="font-sans font-semibold text-stone-900 text-sm tracking-wide uppercase">Filters</h2>
          {productCount !== undefined && (
            <span className="text-xs text-stone-400">({productCount})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          )}
          {onMobileClose && (
            <button onClick={onMobileClose} className="p-1 text-stone-600 hover:text-stone-900" aria-label="Close filters">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* Category */}
        <section>
          <h3 className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-3">Category</h3>
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.category.includes(cat.value)}
                  onChange={() => toggleArrayFilter('category', cat.value)}
                  className="w-4 h-4 rounded border-stone-300 accent-stone-900"
                />
                <span className="text-sm text-stone-700 group-hover:text-stone-900 transition-colors">{cat.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Gender */}
        <section>
          <h3 className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-3">For</h3>
          <div className="space-y-2">
            {GENDERS.map(g => (
              <label key={g.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.gender.includes(g.value)}
                  onChange={() => toggleArrayFilter('gender', g.value)}
                  className="w-4 h-4 rounded border-stone-300 accent-stone-900"
                />
                <span className="text-sm text-stone-700 group-hover:text-stone-900 transition-colors">{g.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Price Range */}
        <section>
          <h3 className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-3">Price Range</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-stone-500 mb-1 block">Min (₹)</label>
                <input
                  type="number"
                  min={0}
                  max={filters.priceMax}
                  value={filters.priceMin}
                  onChange={e => onChange({ priceMin: Number(e.target.value) })}
                  className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-stone-400"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-stone-500 mb-1 block">Max (₹)</label>
                <input
                  type="number"
                  min={filters.priceMin}
                  max={50000}
                  value={filters.priceMax}
                  onChange={e => onChange({ priceMax: Number(e.target.value) })}
                  className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-stone-400"
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              value={filters.priceMax}
              onChange={e => onChange({ priceMax: Number(e.target.value) })}
              className="w-full accent-stone-900"
              aria-label="Maximum price"
            />
            <div className="flex justify-between text-xs text-stone-400">
              <span>₹0</span>
              <span>₹50,000+</span>
            </div>
          </div>
        </section>

        {/* Rating */}
        <section>
          <h3 className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-3">Rating</h3>
          <div className="space-y-2">
            {RATINGS.map(r => (
              <label key={r.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === r.value}
                  onChange={() => onChange({ rating: r.value })}
                  className="accent-stone-900"
                />
                <span className="text-sm text-stone-700 group-hover:text-stone-900 transition-colors">
                  {r.value > 0 ? `${r.value}★ & above` : 'All Ratings'}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Availability */}
        <section>
          <h3 className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-3">Availability</h3>
          <div className="space-y-2">
            {AVAILABILITY.map(a => (
              <label key={a.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === a.value}
                  onChange={() => onChange({ availability: a.value })}
                  className="accent-stone-900"
                />
                <span className="text-sm text-stone-700 group-hover:text-stone-900 transition-colors">{a.label}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const MobileFilterDrawer: React.FC<FilterSidebarProps & { isOpen: boolean }> = ({
  isOpen, onMobileClose, ...props
}) => {
  if (!isOpen) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white z-50 shadow-2xl p-6 overflow-y-auto animate-slide-in lg:hidden">
        <FilterContent {...props} onMobileClose={onMobileClose} />
      </div>
    </>
  );
};

const FilterSidebar: React.FC<FilterSidebarProps> = (props) => {
  return (
    <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
      <div className="sticky top-24">
        <FilterContent {...props} />
      </div>
    </div>
  );
};

export default FilterSidebar;
