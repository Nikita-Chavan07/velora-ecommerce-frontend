import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { OrderProvider } from './context/OrderContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const FashionPage = lazy(() => import('./pages/FashionPage'));
const BeautyPage = lazy(() => import('./pages/BeautyPage'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" aria-label="Loading" />
  </div>
);

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <Header />
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage pageTitle="All Products" />} />
            <Route path="/fashion" element={<FashionPage />} />
            <Route path="/beauty" element={<BeautyPage />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <ToastProvider>
              <ScrollToTop />
              <AppContent />
            </ToastProvider>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
