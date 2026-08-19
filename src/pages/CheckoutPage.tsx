import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, Truck, Zap, ChevronRight, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import type { ShippingInfo, Order } from '../types';
import { formatPrice } from '../utils/currency';

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', sub: '3–5 working days', price: 499, icon: <Truck size={18} /> },
  { id: 'express', label: 'Express Delivery', sub: '1–2 working days', price: 1079, icon: <Zap size={18} /> },
];

const PAYMENT_OPTIONS = [
  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} /> },
  { id: 'upi', label: 'UPI', icon: <Smartphone size={18} /> },
  { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={18} /> },
];

const initShipping: ShippingInfo = {
  fullName: '', email: '', phone: '',
  address: '', city: '', state: '',
  country: 'United Kingdom', zipCode: '',
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, discount, tax, clearCart } = useCart();
  const { setCurrentOrder } = useOrder();
  const { showToast } = useToast();

  const [shipping, setShipping] = useState<ShippingInfo>(initShipping);
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});
  const [placing, setPlacing] = useState(false);

  const deliveryFee = delivery === 'express' ? 1079 : subtotal > 6250 ? 0 : 499;
  const total = subtotal + deliveryFee + tax;

  const validate = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {};
    if (!shipping.fullName.trim()) newErrors.fullName = 'Required';
    if (!shipping.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required';
    if (!shipping.phone.trim()) newErrors.phone = 'Required';
    if (!shipping.address.trim()) newErrors.address = 'Required';
    if (!shipping.city.trim()) newErrors.city = 'Required';
    if (!shipping.zipCode.trim()) newErrors.zipCode = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (items.length === 0) {
      showToast('Your cart is empty.', 'error');
      return;
    }

    setPlacing(true);

    // Simulate payment processing
    await new Promise(res => setTimeout(res, 1500));

    const order: Order = {
      id: `VEL-${Date.now().toString(36).toUpperCase()}`,
      items: [...items],
      subtotal,
      discount,
      shipping: deliveryFee,
      tax,
      total,
      shippingInfo: shipping,
      paymentMethod: payment,
      deliveryMethod: delivery,
      estimatedDelivery: delivery === 'express'
        ? new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
        : new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
      createdAt: new Date(),
    };

    setCurrentOrder(order);
    clearCart();
    navigate('/order-success');
  };

  const Field: React.FC<{
    label: string; name: keyof ShippingInfo; type?: string;
    placeholder?: string; half?: boolean; required?: boolean;
  }> = ({ label, name, type = 'text', placeholder, half = false, required = true }) => (
    <div className={half ? 'sm:col-span-1' : 'sm:col-span-2'}>
      <label htmlFor={name} className="block text-xs font-medium text-stone-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={name}
        type={type}
        value={shipping[name]}
        onChange={e => setShipping(prev => ({ ...prev, [name]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${
          errors[name] ? 'border-red-400 focus:border-red-500' : 'border-stone-200 focus:border-stone-400'
        }`}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        aria-required={required}
      />
      {errors[name] && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  if (items.length === 0 && !placing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-4xl font-light text-stone-900 mb-4">Checkout</h1>
        <p className="text-stone-500 mb-6">Your cart is empty.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-4xl font-light text-stone-900 mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} noValidate>
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Info */}
            <section className="bg-white border border-stone-100 rounded-xl p-6">
              <h2 className="font-serif text-xl text-stone-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center">1</span>
                Shipping Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" name="fullName" placeholder="Jane Smith" />
                <Field label="Email Address" name="email" type="email" placeholder="jane@example.com" />
                <Field label="Phone Number" name="phone" type="tel" placeholder="+44 7700 900000" half />
                <div className="sm:col-span-1" />
                <Field label="Address" name="address" placeholder="123 High Street" />
                <Field label="City" name="city" placeholder="London" half />
                <Field label="County / State" name="state" placeholder="Greater London" half />
                <Field label="Country" name="country" placeholder="United Kingdom" half />
                <Field label="ZIP / Postcode" name="zipCode" placeholder="SW1A 1AA" half />
              </div>
            </section>

            {/* Delivery Method */}
            <section className="bg-white border border-stone-100 rounded-xl p-6">
              <h2 className="font-serif text-xl text-stone-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center">2</span>
                Delivery Method
              </h2>
              <div className="space-y-3">
                {DELIVERY_OPTIONS.map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      delivery === opt.id ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:border-stone-200'
                    }`}
                  >
                    <input type="radio" name="delivery" value={opt.id} checked={delivery === opt.id} onChange={e => setDelivery(e.target.value)} className="sr-only" />
                    <span className={delivery === opt.id ? 'text-stone-900' : 'text-stone-400'}>{opt.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-900">{opt.label}</p>
                      <p className="text-xs text-stone-500">{opt.sub}</p>
                    </div>
                    <span className="text-sm font-semibold text-stone-900">
                      {opt.id === 'standard' && subtotal > 6250 ? 'Free' : formatPrice(opt.price)}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white border border-stone-100 rounded-xl p-6">
              <h2 className="font-serif text-xl text-stone-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center">3</span>
                Payment Method
              </h2>
              <div className="space-y-3">
                {PAYMENT_OPTIONS.map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      payment === opt.id ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:border-stone-200'
                    }`}
                  >
                    <input type="radio" name="payment" value={opt.id} checked={payment === opt.id} onChange={e => setPayment(e.target.value)} className="sr-only" />
                    <span className={payment === opt.id ? 'text-stone-900' : 'text-stone-400'}>{opt.icon}</span>
                    <span className="text-sm font-medium text-stone-900">{opt.label}</span>
                  </label>
                ))}
              </div>

              {payment === 'card' && (
                <div className="mt-5 space-y-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <p className="text-xs text-stone-500 flex items-center gap-1.5">
                    <Lock size={12} /> This is a demo – no real payment will be processed.
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Cardholder Name</label>
                    <input value={cardDetails.name} onChange={e => setCardDetails(p => ({...p, name: e.target.value}))} placeholder="Jane Smith" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Card Number</label>
                    <input value={cardDetails.number} onChange={e => setCardDetails(p => ({...p, number: e.target.value.replace(/\D/g,'').slice(0,16)}))} placeholder="4242 4242 4242 4242" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400" maxLength={16} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Expiry</label>
                      <input value={cardDetails.expiry} onChange={e => setCardDetails(p => ({...p, expiry: e.target.value}))} placeholder="MM/YY" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400" maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">CVV</label>
                      <input value={cardDetails.cvv} onChange={e => setCardDetails(p => ({...p, cvv: e.target.value.replace(/\D/g,'').slice(0,3)}))} placeholder="123" type="password" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-stone-400" maxLength={3} />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-stone-100 rounded-xl p-6 sticky top-24">
              <h2 className="font-serif text-xl text-stone-900 mb-5">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-14 object-cover rounded-lg" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-stone-600 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-stone-400">{[item.selectedColor, item.selectedSize].filter(Boolean).join(' · ')}</p>
                    </div>
                    <span className="text-xs font-semibold text-stone-900 flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Savings</span><span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>GST (18%)</span><span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-stone-100 pt-2.5 flex justify-between font-semibold text-stone-900 text-base">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {placing ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Place Order <ChevronRight size={16} /></>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stone-400">
                <Lock size={11} /> SSL secured · No real payment processed
              </div>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
};

export default CheckoutPage;
