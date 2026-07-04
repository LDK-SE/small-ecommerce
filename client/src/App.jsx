import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';
import BackToTop from './components/BackToTop.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { ToastViewport } from './components/Toast.tsx';
import { useAuth } from './context/AuthContext.jsx';
import { init as initAnalytics, stopAutoFlush } from './services/analytics.js';

const Home = lazy(() => import('./pages/Home.jsx'));
const Products = lazy(() => import('./pages/Products.jsx'));
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminProducts = lazy(() => import('./pages/AdminProducts.jsx'));
const AdminOrders = lazy(() => import('./pages/AdminOrders.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const PolicyPage = lazy(() => import('./pages/PolicyPage.jsx'));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-body">
        <svg className="h-5 w-5 animate-spin text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        正在加载...
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  useEffect(() => {
    initAnalytics();
    return () => stopAutoFlush();
  }, []);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          跳转到主内容
        </a>
        <OfflineBanner />
        <Header />
        <ToastViewport />
        <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />
              <Route path="/policies/:topic" element={<PolicyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </ErrorBoundary>
  );
}
