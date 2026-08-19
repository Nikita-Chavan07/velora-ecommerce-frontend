import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, RotateCcw, Shield, ChevronRight, ChevronLeft, ChevronDown, Star } from 'lucide-react';
import RatingStars from '../components/ui/RatingStars';
import QuantitySelector from '../components/ui/QuantitySelector';
import ProductGrid from '../components/product/ProductGrid';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { fetchProductById, fetchProducts } from '../services/api';
import { reviews as allReviews } from '../data/reviews';
import type { Product } from '../types';
import { formatPrice } from '../utils/currency';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'shipping'>('description');
  const [heartAnim, setHeartAnim] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([fetchProductById(id), fetchProducts()])
      .then(([prod, allProds]) => {
        if (!prod) { setError('Product not found.'); return; }
        setProduct(prod);
        setSelectedColor(prod.colors[0] ?? '');
        setSelectedSize(prod.sizes[0] ?? '');
        const rel = allProds
          .filter(p => p.id !== id && p.category === prod.category)
          .slice(0, 4);
        setRelated(rel);
      })
      .catch(() => setError('Unable to load product.'))
      .finally(() => setLoading(false));
  }, [id]);

  const wishlisted = product ? isInWishlist(product.id) : false;
  const reviews = allReviews.filter(r => r.productId === id);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor, selectedSize);
    showToast(`${product.name} added to cart!`, 'success');
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
    showToast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', wishlisted ? 'info' : 'success');
  };

  const prevImage = () => setSelectedImage(i => Math.max(0, i - 1));
  const nextImage = () => {
    if (!product) return;
    setSelectedImage(i => Math.min(product.images.length - 1, i + 1));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SkeletonLoader type="banner" />
          <div className="space-y-4"><SkeletonLoader type="text" count={8} /></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-stone-500 text-lg mb-4">{error || 'Product not found.'}</p>
        <Link to="/shop" className="text-stone-900 underline underline-offset-2">Back to Shop</Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-8" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-stone-700">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-stone-700">Shop</Link>
        <ChevronRight size={12} />
        <Link to={`/${product.category}`} className="hover:text-stone-700 capitalize">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="text-stone-700 truncate max-w-[150px]">{product.name}</span>
      </nav>

      {/* Main product section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative aspect-[4/5] bg-stone-50 rounded-2xl overflow-hidden group">
            <img
              src={product.images[selectedImage]}
              alt={`${product.name} – view ${selectedImage + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                -{product.discount}%
              </div>
            )}
            {product.images.length > 1 && (
              <>
                <button onClick={prevImage} disabled={selectedImage === 0} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30" aria-label="Previous image">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={nextImage} disabled={selectedImage === product.images.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30" aria-label="Next image">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-stone-900' : 'border-transparent hover:border-stone-300'}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-1">{product.brand}</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif text-3xl text-stone-900">{formatPrice(product.price)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-stone-400 line-through text-lg">{formatPrice(product.originalPrice)}</span>
                <span className="text-rose-500 text-sm font-medium bg-rose-50 px-2 py-0.5 rounded-full">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="text-stone-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Colors */}
          {product.colors.length > 0 && product.colors[0] !== 'Default' && (
            <div className="mb-5">
              <p className="text-xs font-medium text-stone-700 uppercase tracking-widest mb-2">
                Colour: <span className="normal-case font-normal text-stone-500">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      selectedColor === color
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
            <div className="mb-5">
              <p className="text-xs font-medium text-stone-700 uppercase tracking-widest mb-2">
                Size: <span className="normal-case font-normal text-stone-500">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm border transition-all ${
                      selectedSize === size
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="mb-5">
            {product.stock > 10 ? (
              <p className="text-sm text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> In Stock
              </p>
            ) : product.stock > 0 ? (
              <p className="text-sm text-amber-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Only {product.stock} left
              </p>
            ) : (
              <p className="text-sm text-stone-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-400 inline-block" /> Out of Stock
              </p>
            )}
          </div>

          {/* Quantity + Actions */}
          <div className="flex items-center gap-3 mb-4">
            <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                addedToCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              } disabled:bg-stone-300 disabled:cursor-not-allowed`}
            >
              <ShoppingBag size={16} />
              {addedToCart ? 'Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="flex gap-3 mb-8">
            <Link
              to="/checkout"
              onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium border border-stone-900 hover:bg-stone-50 transition-colors ${product.stock === 0 ? 'pointer-events-none opacity-40' : ''}`}
            >
              Buy Now
            </Link>
            <button
              onClick={handleWishlist}
              className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all ${
                wishlisted ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-stone-200 text-stone-500 hover:border-rose-300 hover:text-rose-500'
              }`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} className={`${wishlisted ? 'fill-current' : ''} ${heartAnim ? 'animate-heart-pop' : ''}`} />
            </button>
          </div>

          {/* Perks */}
          <div className="border-t border-stone-100 pt-6 space-y-3">
            {[
              { icon: <Truck size={16} />, text: 'Free delivery on orders over $75' },
              { icon: <RotateCcw size={16} />, text: 'Free 30-day returns' },
              { icon: <Shield size={16} />, text: 'Secure, encrypted checkout' },
            ].map(perk => (
              <div key={perk.text} className="flex items-center gap-3 text-sm text-stone-600">
                <span className="text-stone-500">{perk.icon}</span>
                {perk.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCT TABS ──────────────────────────── */}
      <div className="mt-16 border-t border-stone-100 pt-12">
        <div className="flex border-b border-stone-100 mb-8 gap-0 overflow-x-auto">
          {(['description', 'ingredients', 'shipping'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab === 'ingredients' && product.category === 'fashion' ? 'Material' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="max-w-2xl animate-fade-in">
          {activeTab === 'description' && (
            <div className="text-stone-600 text-sm leading-relaxed space-y-3">
              <p>{product.description}</p>
              {product.specifications && (
                <div className="mt-4 border border-stone-100 rounded-xl overflow-hidden">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex border-b border-stone-100 last:border-0">
                      <div className="w-40 bg-stone-50 px-4 py-2.5 text-xs font-medium text-stone-700">{k}</div>
                      <div className="flex-1 px-4 py-2.5 text-xs text-stone-600">{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="text-stone-600 text-sm leading-relaxed">
              {product.material ? (
                <p><strong className="text-stone-900">Material:</strong> {product.material}</p>
              ) : product.ingredients ? (
                <ul className="space-y-1.5">
                  {product.ingredients.map(ing => (
                    <li key={ing} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No ingredient information available.</p>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="text-stone-600 text-sm leading-relaxed space-y-4">
              <div>
                <h4 className="font-medium text-stone-900 mb-1">Delivery</h4>
                <ul className="space-y-1.5 text-stone-600">
                  <li>Standard Delivery (3–5 working days) – Free on orders over $75, otherwise $5.99</li>
                  <li>Express Delivery (1–2 working days) – $12.99</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-stone-900 mb-1">Returns</h4>
                <p>Free 30-day returns on all full-price items. Items must be unworn, unwashed, and in original packaging. Sale items are final sale.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── REVIEWS ───────────────────────────────── */}
      <div className="mt-16 border-t border-stone-100 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-light text-stone-900">
            Customer Reviews
            {reviews.length > 0 && <span className="text-stone-400 ml-2 text-xl">({reviews.length})</span>}
          </h2>
          <div className="flex items-center gap-2">
            <RatingStars rating={product.rating} showCount={false} size={16} />
            <span className="font-serif text-xl text-stone-900">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {reviews.map(review => (
              <article key={review.id} className="border border-stone-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-stone-900 text-sm">{review.author}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={11} className={s <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'} />
                        ))}
                      </div>
                      {review.verified && <span className="text-[10px] text-emerald-600 font-medium">Verified Purchase</span>}
                    </div>
                  </div>
                  <time className="ml-auto text-xs text-stone-400">{new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                </div>
                <h4 className="font-medium text-stone-900 text-sm mb-1">{review.title}</h4>
                <p className="text-stone-600 text-sm leading-relaxed">{review.text}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-stone-100 rounded-xl p-8 text-center">
            <p className="text-stone-400 text-sm">No reviews yet. Be the first to review this product.</p>
          </div>
        )}
      </div>

      {/* ── RELATED PRODUCTS ──────────────────────── */}
      {related.length > 0 && (
        <div className="mt-16 border-t border-stone-100 pt-12">
          <h2 className="font-serif text-3xl font-light text-stone-900 mb-8">You May Also Like</h2>
          <ProductGrid products={related} columns={4} skeletonCount={4} />
        </div>
      )}
    </main>
  );
};

export default ProductDetailPage;
