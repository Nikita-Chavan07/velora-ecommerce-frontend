import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (q: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity, onChange, min = 1, max = 99, size = 'md'
}) => {
  const btnClass = size === 'sm'
    ? 'w-7 h-7 text-xs'
    : 'w-9 h-9 text-sm';
  const numClass = size === 'sm' ? 'w-8 text-sm' : 'w-10 text-sm';

  return (
    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden inline-flex">
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className={`${btnClass} flex items-center justify-center text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        aria-label="Decrease quantity"
      >
        <Minus size={size === 'sm' ? 12 : 14} />
      </button>
      <span className={`${numClass} text-center font-medium text-stone-900 py-1 font-sans`} aria-live="polite">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={`${btnClass} flex items-center justify-center text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus size={size === 'sm' ? 12 : 14} />
      </button>
    </div>
  );
};

export default QuantitySelector;
