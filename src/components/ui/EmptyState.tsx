import React from 'react';
import { PackageX, SearchX, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  type?: 'search' | 'cart' | 'wishlist' | 'products' | 'error';
  message?: string;
  onAction?: () => void;
  actionLabel?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type = 'products', message, onAction, actionLabel }) => {
  const config = {
    search: {
      icon: <SearchX size={48} className="text-stone-300" />,
      title: 'No products found',
      description: message || 'Try adjusting your search or filters.',
      action: onAction ? { label: actionLabel || 'Clear filters', onClick: onAction } : undefined,
      linkTo: undefined,
    },
    cart: {
      icon: <ShoppingBag size={48} className="text-stone-300" />,
      title: 'Your cart is empty',
      description: 'Looks like you haven\'t added anything yet.',
      action: undefined,
      linkTo: { to: '/shop', label: 'Start Shopping' },
    },
    wishlist: {
      icon: <Heart size={48} className="text-stone-300" />,
      title: 'Your wishlist is empty',
      description: 'Save your favourite pieces here.',
      action: undefined,
      linkTo: { to: '/shop', label: 'Browse Products' },
    },
    products: {
      icon: <PackageX size={48} className="text-stone-300" />,
      title: 'No products found',
      description: message || 'We couldn\'t find any products in this category.',
      action: undefined,
      linkTo: { to: '/shop', label: 'View All Products' },
    },
    error: {
      icon: <PackageX size={48} className="text-red-300" />,
      title: 'Unable to load products',
      description: message || 'Something went wrong. Please try again.',
      action: onAction ? { label: actionLabel || 'Try Again', onClick: onAction } : undefined,
      linkTo: undefined,
    },
  };

  const c = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6 animate-fade-in">{c.icon}</div>
      <h3 className="font-serif text-2xl font-light text-stone-800 mb-2">{c.title}</h3>
      <p className="text-stone-500 text-sm max-w-sm mb-8">{c.description}</p>
      {c.action && (
        <button
          onClick={c.action.onClick}
          className="px-6 py-2.5 border border-stone-900 text-stone-900 text-sm font-medium hover:bg-stone-900 hover:text-white transition-colors rounded-lg"
        >
          {c.action.label}
        </button>
      )}
      {c.linkTo && (
        <Link
          to={c.linkTo.to}
          className="px-8 py-3 bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors rounded-lg"
        >
          {c.linkTo.label}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
