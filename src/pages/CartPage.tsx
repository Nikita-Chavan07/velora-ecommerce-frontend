import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import QuantitySelector from '../components/ui/QuantitySelector';
import EmptyState from '../components/ui/EmptyState';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, subtotal, discount, shipping, tax, total } = useCart();
  const { addToWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleMoveToWishlist = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      addToWishlist(item.product);
      removeFromCart(productId);
      showToast('Moved to wishlist', 'info');
    }
  };

  const handleRemove = (productId: string, name: string) => {
    removeFromCart(productId);
    showToast(`${name} removed from cart`, 'info');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-4xl font-light text-stone-900 mb-8">Shopping Cart</h1>
        <EmptyState type="cart" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-4xl font-light text-stone-900 mb-8">
        Shopping Cart <span className="text-stone-400 text-2xl ml-2">({items.length})</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <article
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
              className="flex gap-4 bg-white border border-stone-100 rounded-xl p-4 hover:border-stone-200 transition-colors"
            >
              <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-28 sm:w-28 sm:h-32 object-cover rounded-lg"
                />
              </Link>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">{item.product.brand}</p>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-sans font-medium text-stone-900 text-sm hover:text-stone-600 transition-colors line-clamp-1">
                          {item.product.name}
                        </h3>
                      </Link>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-stone-900 text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-stone-400">{formatPrice(item.product.price)} each</p>
                      )}
                    </div>
                  </div>

                  {/* Variant */}
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {item.selectedColor && item.selectedColor !== 'Default' && (
                      <span className="text-xs text-stone-500 bg-stone-50 px-2 py-0.5 rounded">
                        {item.selectedColor}
                      </span>
                    )}
                    {item.selectedSize && item.selectedSize !== 'One Size' && (
                      <span className="text-xs text-stone-500 bg-stone-50 px-2 py-0.5 rounded">
                        {item.selectedSize}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={q => updateQuantity(item.product.id, q)}
                    max={item.product.stock}
                    size="sm"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveToWishlist(item.product.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                      aria-label="Move to wishlist"
                      title="Save for later"
                    >
                      <Heart size={15} />
                    </button>
                    <button
                      onClick={() => handleRemove(item.product.id, item.product.name)}
                      className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                      aria-label="Remove from cart"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

          <Link to="/shop" className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors mt-2">
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-stone-100 rounded-xl p-6 sticky top-24">
            <h2 className="font-serif text-xl text-stone-900 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1"><Tag size={13} /> Savings</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-stone-100 pt-3 flex justify-between font-semibold text-stone-900 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800">
                Add {formatPrice(6250 - subtotal)} more for free shipping
              </div>
            )}

            <Link
              to="/checkout"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
              <ShoppingBag size={12} />
              Secure, encrypted checkout
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
