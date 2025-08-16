import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './component/home';
import ScrollToTop from './component/ScrollToTop';

import Login from './component/Login';
import Forgetpass from './component/Forgetpass';
import Contactus from './component/Contactus';
import Register from './component/Register';
import Aboutus from './component/Aboutus';
import Header from './component/Header';
import Footer from './component/Footer';
import ProductList from './component/ProductList';
import ProductDetail from './component/ProductDetail';
import CartSlider from './component/CartSlider';
import Checkout from './component/Checkout';
import CelebrationPage from './component/CelebrationPage';
import CartPage from './component/CartPage';
import TrackOrder from './component/TrackOrder';
import Account from './component/Account';
import EditProfile from './component/EditProfile';
import ChangePassword from './component/ChangePassword';
import WebsiteReviewPage from './component/WebsiteReviewPage';
import OrderHistory from './component/OrderHistory';
import SearchResults from './component/SearchResults';
import BlogPage from './component/BlogPage';
import { CartProvider } from './component/CartContext';


// Admin components
import Dashboard from './component/Dashboard';
import ProductManagement from './component/ProductManagement';
import CategoryManagement from './component/CategoryManagement';
import SubcategoriesManagement from './component/SubcategoriesManagement';
import UserManagement from './component/UserManagement';
import OrderManagement from './component/OrderManagement';
import AnalyticsPage from "./component/AnalyticsPage";
import AdminContactMessages from "./component/AdminContactMessages";

//AR
import Decorator from "./component/Decorator";

const AppWrapper = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  return (
    <>
      {/* Wrap Header and Routes inside CartProvider */}
      {!isDashboard ? (
        <CartProvider>
          <Header />
          <main>
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/contactus" element={<Contactus />} />
              <Route path="/forgetpass" element={<Forgetpass />} />
              <Route path="/category/:categoryId/products" element={<ProductList />} />
              <Route path="/subcategory/:subcategoryId/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/all-products" element={<ProductList />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/celebration" element={<CelebrationPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/account" element={<Account />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/reviews" element={<WebsiteReviewPage />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/blog/top-5-interior-trends" element={<BlogPage />} />
              <Route path="/decorate-room" element={<Decorator />} />
            </Routes>
          </main>
          <Footer />
          <CartSlider isOpen={isCartOpen} onClose={toggleCart} />
        </CartProvider>
      ) : (
        // Admin Routes (no Header/Footer/Cart)
        <main>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="products" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="subcategories" element={<SubcategoriesManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="messages" element={<AdminContactMessages />} />

            </Route>
          </Routes>
        </main>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppWrapper />
    </Router>
  );
}

export default App;
