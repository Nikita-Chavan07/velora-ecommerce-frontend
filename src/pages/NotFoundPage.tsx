import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md">
        <p className="font-serif text-[120px] sm:text-[160px] font-light text-stone-100 leading-none select-none">
          404
        </p>
        <h1 className="font-serif text-3xl font-light text-stone-900 -mt-4 mb-3">Page Not Found</h1>
        <p className="text-stone-500 text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist. It may have been moved, deleted, or you may have mistyped the URL.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Home size={16} /> Go Home
          </Link>
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-stone-200 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
          >
            <Search size={16} /> Browse Shop
          </Link>
        </div>
        <button
          onClick={() => window.history.back()}
          className="mt-4 flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 mx-auto transition-colors"
        >
          <ArrowLeft size={14} /> Go Back
        </button>
      </div>
    </main>
  );
};

export default NotFoundPage;
