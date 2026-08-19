import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import RatingStars from '../components/ui/RatingStars';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';

const WishlistPage: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToCart = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    if (!item) return;
    addToCart(item.product);
    removeFromWishlist(productId);
    showToast(`${item.product.name} added to cart`, 'success');
  };

  const handleRemove = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    removeFromWishlist(productId);
    if (item) showToast(`${item.product.name} removed from wishlist`, 'info');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-4xl font-light text-stone-900 mb-8">My Wishlist</h1>
        <EmptyState type="wishlist" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-4xl font-light text-stone-900 mb-2">
        My Wishlist
      </h1>
      <p className="text-stone-500 text-sm mb-8 flex items-center gap-1.5">
        <Heart size={14} className="fill-rose-400 text-rose-400" />
        {items.length} saved item{items.length !== 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map(({ product, addedAt }) => {
          const inCart = isInCart(product.id);
          return (
            <article key={product.id} className="group bg-white rounded-xl border border-stone-100 hover:border-stone-200 hover:shadow-md transition-all overflow-hidden">
              <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                    -{product.discount}%
                  </span>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-stone-900 text-white text-xs px-3 py-1 rounded-full">Out of Stock</span>
                  </div>
                )}
              </Link>

              <div className="p-4">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-0.5">{product.brand}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-stone-900 text-sm line-clamp-1 hover:text-stone-600 transition-colors">{product.name}</h3>
                </Link>
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={11} />

                <div className="flex items-center gap-2 mt-2 mb-3">
                  <span className="font-semibold text-stone-900 text-sm">{formatPrice(product.price)}</span>
                  {product.discount > 0 && (
                    <span className="text-stone-400 text-xs line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                <p className="text-[10px] text-stone-400 mb-3">
                  Added {addedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product.id)}
                    disabled={product.stock === 0}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                      inCart
                        ? 'bg-stone-100 text-stone-700'
                        : 'bg-stone-900 text-white hover:bg-stone-800'
                    } disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed`}
                  >
                    <ShoppingBag size={13} />
                    {inCart ? 'In Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded-lg text-stone-400 hover:text-red-500 hover:border-red-200 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
};

export default WishlistPage;
