import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  {
    label: 'Shop', to: '/shop',
    children: [
      { to: '/shop', label: 'All Products' },
      { to: '/fashion', label: "Women's Fashion" },
      { to: '/fashion?gender=men', label: "Men's Fashion" },
      { to: '/beauty', label: 'Beauty & Skincare' },
      { to: '/accessories', label: 'Accessories' },
    ]
  },
  { to: '/fashion', label: 'Fashion' },
  { to: '/beauty', label: 'Beauty' },
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/offers', label: 'Offers' },
];

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopDropdown, setShopDropdown] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      {/* Promo bar */}
      <div className="bg-stone-900 text-white text-xs text-center py-2 px-4 font-sans tracking-widest uppercase">
        Free shipping on orders over ₹6,250 · <Link to="/offers" className="underline underline-offset-2">Shop Offers</Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group" aria-label="VELORA Home">
            <span className="font-serif text-2xl md:text-3xl font-light tracking-[0.3em] text-stone-900 group-hover:text-stone-600 transition-colors">
              VELORA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map(link => (
              link.children ? (
                <div key={link.label} className="relative group">
                  <button
                    className="flex items-center gap-1 text-sm font-sans font-medium tracking-wide text-stone-700 hover:text-stone-900 transition-colors py-2"
                    onMouseEnter={() => setShopDropdown(true)}
                    onMouseLeave={() => setShopDropdown(false)}
                    aria-haspopup="true"
                    aria-expanded={shopDropdown}
                  >
                    {link.label}
                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                  </button>
                  <div
                    className={`absolute top-full left-0 bg-white shadow-lg border border-stone-100 rounded-lg py-2 min-w-[180px] transition-all duration-200 ${shopDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                    onMouseEnter={() => setShopDropdown(true)}
                    onMouseLeave={() => setShopDropdown(false)}
                  >
                    {link.children.map(child => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to!}
                  end={link.exact}
                  className={({ isActive }) =>
                    `text-sm font-sans font-medium tracking-wide transition-colors ${isActive ? 'text-stone-900 border-b border-stone-900' : 'text-stone-600 hover:text-stone-900'}`
                  }
                >
                  {link.label}
                </NavLink>
              )
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-40 sm:w-56 border-b-2 border-stone-900 bg-transparent text-sm py-1 px-2 outline-none focus:border-stone-600 transition-colors font-sans"
                  aria-label="Search"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-stone-600 hover:text-stone-900" aria-label="Close search">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Open search"
              >
                <Search size={20} />
              </button>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors" aria-label={`Wishlist (${wishlistCount} items)`}>
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0 -right-0 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors" aria-label={`Cart (${totalItems} items)`}>
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0 -right-0 bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            <Link to="/login" className="hidden sm:flex p-2 text-stone-600 hover:text-stone-900 transition-colors" aria-label="Account">
              <User size={20} />
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 shadow-lg animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center border border-stone-200 rounded-lg overflow-hidden mb-2">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-sm py-2 px-3 outline-none font-sans"
                aria-label="Search"
              />
              <button type="submit" className="p-2 text-stone-600" aria-label="Search">
                <Search size={18} />
              </button>
            </form>

            {navLinks.map(link => (
              link.children ? (
                <div key={link.label}>
                  <div className="py-2 px-2 text-sm font-medium text-stone-900 tracking-wide border-b border-stone-50">{link.label}</div>
                  {link.children.map(child => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className="block pl-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to!}
                  end={link.exact}
                  className={({ isActive }) =>
                    `py-2 px-2 text-sm font-medium tracking-wide transition-colors ${isActive ? 'text-stone-900' : 'text-stone-600'}`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              )
            ))}
            <Link to="/login" className="flex items-center gap-2 py-2 px-2 text-sm text-stone-600 hover:text-stone-900" onClick={() => setMobileOpen(false)}>
              <User size={16} /> Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
