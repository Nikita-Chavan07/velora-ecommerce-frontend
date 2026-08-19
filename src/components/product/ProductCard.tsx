import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '../../types';
import RatingStars from '../ui/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const wishlisted = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
    showToast(
      wishlisted ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`,
      wishlisted ? 'info' : 'success'
    );
  };

  return (
    <article
      className="group relative bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-stone-200 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="bg-stone-900 text-white text-[10px] font-medium px-2 py-0.5 rounded tracking-wide">NEW</span>
        )}
        {product.discount > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-medium px-2 py-0.5 rounded tracking-wide">-{product.discount}%</span>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <span className="bg-amber-500 text-white text-[10px] font-medium px-2 py-0.5 rounded tracking-wide">LOW STOCK</span>
        )}
        {product.stock === 0 && (
          <span className="bg-stone-400 text-white text-[10px] font-medium px-2 py-0.5 rounded tracking-wide">SOLD OUT</span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${
          wishlisted ? 'bg-rose-500 text-white' : 'bg-white text-stone-500 hover:text-rose-500'
        } ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 md:opacity-0'}`}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          size={15}
          className={`${wishlisted ? 'fill-current' : ''} ${heartAnim ? 'animate-heart-pop' : ''}`}
        />
      </button>

      {/* Product image */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden" tabIndex={-1}>
        <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden">
          {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Hover second image */}
          {product.images[1] && product.images[1] !== product.images[0] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </div>
      </Link>

      {/* Quick add overlay */}
      <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-stone-900/90 backdrop-blur-sm text-white text-xs font-medium py-2.5 hover:bg-stone-900 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={14} />
          {product.stock === 0 ? 'Out of Stock' : inCart ? 'Added to Cart' : 'Quick Add'}
        </button>
      </div>

      {/* Product info */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="p-3 sm:p-4 pb-10 group-hover:pb-4 transition-all duration-300">
          <p className="text-[10px] sm:text-xs text-stone-400 uppercase tracking-widest font-sans mb-1">{product.brand}</p>
          <h3 className="font-sans text-sm font-medium text-stone-900 line-clamp-1 mb-1.5 group-hover:text-stone-700 transition-colors">
            {product.name}
          </h3>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={12} />
          <div className="flex items-center gap-2 mt-2">
            <span className="font-sans font-semibold text-stone-900 text-sm">{formatPrice(product.price)}</span>
            {product.discount > 0 && (
              <span className="text-stone-400 text-xs line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* View Details link (always visible on mobile) */}
      <Link
        to={`/product/${product.id}`}
        className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-[10px] text-stone-500 hover:text-stone-900"
        aria-label={`View details for ${product.name}`}
      >
        <Eye size={12} /> Details
      </Link>
    </article>
  );
};

export default ProductCard;
