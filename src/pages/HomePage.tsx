import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, RotateCcw, Shield } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import type { Product } from '../types';
import { fetchProducts } from '../services/api';

const categories = [
  {
    label: "Women's Fashion",
    to: '/fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    color: 'from-stone-900/60',
  },
  {
    label: "Men's Fashion",
    to: '/fashion?gender=men',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80',
    color: 'from-stone-800/60',
  },
  {
    label: 'Makeup',
    to: '/shop?category=makeup',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
    color: 'from-rose-900/60',
  },
  {
    label: 'Skincare',
    to: '/beauty',
    image: 'https://images.unsplash.com/photo-1556228578-567ba127dbc1?w=600&q=80',
    color: 'from-stone-700/60',
  },
  {
    label: 'Accessories',
    to: '/shop?category=accessories',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    color: 'from-amber-900/60',
  },
  {
    label: 'New Arrivals',
    to: '/new-arrivals',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    color: 'from-stone-900/60',
  },
];

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('Unable to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.filter(p => p.isFeatured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <main>
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" aria-label="Hero">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/70 via-stone-900/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-xl">
            <p className="text-stone-300 text-xs tracking-[0.3em] uppercase mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
              New Season Collection
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-tight mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              Style That<br />
              <em>Defines You</em>
            </h1>
            <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-8 max-w-md animate-fade-in" style={{ animationDelay: '300ms' }}>
              Discover fashion, beauty and everyday essentials curated for you.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Link
                to="/fashion"
                className="px-8 py-3.5 bg-white text-stone-900 text-sm font-medium hover:bg-stone-100 transition-colors rounded-lg inline-flex items-center gap-2"
              >
                Shop Fashion <ArrowRight size={16} />
              </Link>
              <Link
                to="/beauty"
                className="px-8 py-3.5 border border-white text-white text-sm font-medium hover:bg-white/10 transition-colors rounded-lg"
              >
                Explore Beauty
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50">
          <div className="w-px h-12 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 w-full h-1/2 bg-white/50 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────── */}
      <section className="bg-stone-50 border-y border-stone-100 py-5" aria-label="Service highlights">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {[
              { icon: <Truck size={20} />, label: 'Free Shipping', sub: 'On orders over $75' },
              { icon: <RotateCcw size={20} />, label: 'Free Returns', sub: '30-day return policy' },
              { icon: <Shield size={20} />, label: 'Secure Payment', sub: 'SSL encrypted checkout' },
              { icon: <Sparkles size={20} />, label: 'Premium Quality', sub: 'Curated products' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 py-2">
                <div className="text-stone-700">{item.icon}</div>
                <p className="text-xs font-medium text-stone-900 font-sans">{item.label}</p>
                <p className="text-[11px] text-stone-500 hidden sm:block">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16" aria-labelledby="cat-heading">
        <div className="text-center mb-10">
          <p className="text-xs text-stone-400 tracking-[0.3em] uppercase mb-2">Explore</p>
          <h2 id="cat-heading" className="font-serif text-4xl font-light text-stone-900">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="group relative rounded-xl overflow-hidden aspect-[3/4] block"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`} />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs sm:text-sm font-medium font-sans leading-tight">
                  {cat.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10" aria-labelledby="featured-heading">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs text-stone-400 tracking-[0.3em] uppercase mb-2">Curated For You</p>
            <h2 id="featured-heading" className="font-serif text-4xl font-light text-stone-900">Featured Products</h2>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={featured} loading={loading} error={error} onRetry={() => window.location.reload()} />
        <div className="mt-6 text-center sm:hidden">
          <Link to="/shop" className="text-sm text-stone-700 hover:text-stone-900 underline underline-offset-2">
            View All Products
          </Link>
        </div>
      </section>

      {/* ── PROMO BANNER ──────────────────────────────── */}
      <section className="my-10" aria-label="Special offer">
        <div className="relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1600&q=80"
            alt="Special Offer"
            className="w-full h-72 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/50 flex flex-col items-center justify-center text-center px-4">
            <p className="text-stone-200 text-xs tracking-[0.4em] uppercase mb-3">Limited Time</p>
            <h2 className="font-serif text-5xl sm:text-6xl text-white font-light mb-3">Up to 40% Off</h2>
            <p className="text-stone-200 text-sm mb-6">Select fashion and beauty essentials</p>
            <Link
              to="/offers"
              className="px-8 py-3 bg-white text-stone-900 text-sm font-medium hover:bg-stone-100 transition-colors rounded-lg"
            >
              Shop the Sale
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ──────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10" aria-labelledby="new-heading">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs text-stone-400 tracking-[0.3em] uppercase mb-2">Just In</p>
              <h2 id="new-heading" className="font-serif text-4xl font-light text-stone-900">New Arrivals</h2>
            </div>
            <Link to="/new-arrivals" className="hidden sm:flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors">
              See All <ArrowRight size={16} />
            </Link>
          </div>
          <ProductGrid products={newArrivals} loading={loading} columns={4} skeletonCount={4} />
        </section>
      )}

      {/* ── EDITORIAL / LOOKBOOK ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16" aria-label="Lookbook">
        <div className="text-center mb-10">
          <p className="text-xs text-stone-400 tracking-[0.3em] uppercase mb-2">Inspiration</p>
          <h2 className="font-serif text-4xl font-light text-stone-900">The VELORA Edit</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative rounded-2xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
              alt="Fashion editorial"
              className="w-full h-80 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end p-6">
              <div>
                <p className="text-stone-300 text-xs tracking-widest uppercase mb-1">The Edit</p>
                <h3 className="font-serif text-2xl text-white font-light mb-3">Autumn / Winter 2026</h3>
                <Link to="/new-arrivals" className="text-white text-sm font-medium underline underline-offset-4 hover:text-stone-200">
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden group flex-1">
              <img
                src="https://images.unsplash.com/photo-1556228578-567ba127dbc1?w=600&q=80"
                alt="Skincare edit"
                className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end p-4">
                <div>
                  <h3 className="font-serif text-lg text-white font-light">Skincare Rituals</h3>
                  <Link to="/beauty" className="text-stone-200 text-xs hover:text-white">Discover →</Link>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden group flex-1">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80"
                alt="Jewellery"
                className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end p-4">
                <div>
                  <h3 className="font-serif text-lg text-white font-light">Fine Accessories</h3>
                  <Link to="/shop?category=accessories" className="text-stone-200 text-xs hover:text-white">Discover →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────── */}
      <section className="bg-stone-900 py-16" aria-label="Newsletter signup">
        <div className="max-w-xl mx-auto px-4 text-center">
          <Sparkles size={28} className="text-stone-400 mx-auto mb-4" />
          <h2 className="font-serif text-4xl font-light text-white mb-3">Join the VELORA Community</h2>
          <p className="text-stone-400 text-sm mb-8">
            Be the first to know about new arrivals, exclusive offers, and beauty tips.
          </p>
          {subscribed ? (
            <div className="bg-stone-800 rounded-xl px-6 py-4 text-stone-300 text-sm">
              Thank you for subscribing! Welcome to VELORA.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg bg-stone-800 text-white placeholder-stone-500 border border-stone-700 focus:border-stone-500 outline-none text-sm"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-stone-900 font-medium text-sm rounded-lg hover:bg-stone-100 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="mt-4 text-stone-600 text-xs">No spam, ever. Unsubscribe at any time.</p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
