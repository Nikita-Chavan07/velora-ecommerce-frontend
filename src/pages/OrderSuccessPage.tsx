import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { formatPrice } from '../utils/currency';

const OrderSuccessPage: React.FC = () => {
  const { currentOrder } = useOrder();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!currentOrder) {
      navigate('/', { replace: true });
      return;
    }
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, [currentOrder, navigate]);

  if (!currentOrder) return null;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      {/* Success animation */}
      <div className={`transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-emerald-500" strokeWidth={1.5} />
        </div>
      </div>

      <div className={`transition-all duration-700 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-stone-900 mb-2">
          Order Placed!
        </h1>
        <p className="text-stone-500 text-sm mb-8">
          Thank you, {currentOrder.shippingInfo.fullName.split(' ')[0]}! Your order has been confirmed.
        </p>

        {/* Order ID */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 mb-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-stone-900">Order Details</h2>
            <span className="text-xs text-stone-500 bg-white border border-stone-200 px-2.5 py-1 rounded-full font-medium">
              {currentOrder.id}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5 text-center">
            <div className="bg-white rounded-lg p-3 border border-stone-100">
              <Package size={18} className="mx-auto mb-1 text-stone-600" />
              <p className="text-[10px] text-stone-400 uppercase tracking-wide">Items</p>
              <p className="text-sm font-medium text-stone-900">{currentOrder.items.length}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-stone-100">
              <Truck size={18} className="mx-auto mb-1 text-stone-600" />
              <p className="text-[10px] text-stone-400 uppercase tracking-wide">Delivery</p>
              <p className="text-sm font-medium text-stone-900 capitalize">{currentOrder.deliveryMethod}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-stone-100">
              <Calendar size={18} className="mx-auto mb-1 text-stone-600" />
              <p className="text-[10px] text-stone-400 uppercase tracking-wide">Est. Arrival</p>
              <p className="text-xs font-medium text-stone-900">{currentOrder.estimatedDelivery}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2.5 mb-4">
            {currentOrder.items.map(item => (
              <div key={item.product.id} className="flex items-center gap-3">
                <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-900 line-clamp-1">{item.product.name}</p>
                  <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold text-stone-900">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-stone-100 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span><span>{formatPrice(currentOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Shipping</span>
              <span>{currentOrder.shipping === 0 ? 'Free' : formatPrice(currentOrder.shipping)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>GST</span><span>{formatPrice(currentOrder.tax)}</span>
            </div>
            <div className="flex justify-between font-semibold text-stone-900 border-t border-stone-100 pt-2">
              <span>Total Paid</span><span>{formatPrice(currentOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping to */}
        <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 mb-8 text-left">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-2">Delivering to</p>
          <p className="text-sm text-stone-900">{currentOrder.shippingInfo.fullName}</p>
          <p className="text-sm text-stone-600">{currentOrder.shippingInfo.address}</p>
          <p className="text-sm text-stone-600">{currentOrder.shippingInfo.city}, {currentOrder.shippingInfo.zipCode}</p>
          <p className="text-sm text-stone-600">{currentOrder.shippingInfo.country}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-3.5 border border-stone-200 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
          >
            Back to Home <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessPage;
