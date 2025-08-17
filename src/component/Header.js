import React, { useState, useEffect } from "react";
import "../Header.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "./CartContext";
import CartSlider from "./CartSlider";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ NEW
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      axios
        .post(`${process.env.REACT_APP_API_URL}/profile/user`, {
          userId: parsedUser.id,
        })
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(console.error);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
    const handleStorageChange = () => loadUserFromStorage();
    const handleUserLoggedIn = () => loadUserFromStorage();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-logged-in", handleUserLoggedIn);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-logged-in", handleUserLoggedIn);
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories`)
      .then((res) => {
        const categoriesData = res.data;
        const subcategoryPromises = categoriesData.map((category) =>
          axios
            .get(
              `${process.env.REACT_APP_API_URL}/categories/${category.id}/subcategories`
            )
            .then((subRes) => {
              category.subcategories = subRes.data;
              return category;
            })
            .catch(() => category)
        );
        Promise.all(subcategoryPromises).then(setCategories);
      })
      .catch(console.error);
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header bg-white border-bottom">
      <div className="container header-top">
        {/* Logo */}
        <Link to="/" className="logo-wrapper">
          <img src="/images/photo1.jpeg" alt="Empire Logo" className="logo" />
        </Link>

        {/* Tagline hidden on small screens */}
        <h1 className="site-title">Discover the Best in Home Decor</h1>

        {/* Search + Icons */}
        <div className="right-section">
          <div className="input-group search-bar">
            <input
              type="text"
              className="form-control"
              placeholder="Search for furniture..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            />
            <span
              className="input-group-text"
              onClick={handleSearchSubmit}
              style={{ cursor: "pointer" }}
            >
              <i className="fas fa-search"></i>
            </span>
          </div>

          {user ? (
            <div className="dropdown">
              <button
                className="btn bg-transparent border-0 p-0 d-flex align-items-center"
                id="accountDropdown"
                data-bs-toggle="dropdown"
              >
                <img
                  src={
                    user?.profileImage
                      ? `https://empire-design-backend.vercel.app/uploads/${user.profileImage}`
                      : "/images/default-profile.jpg"
                  }
                  alt="Profile"
                  className="rounded-circle profile-img"
                />
                <span className="profile-name d-none d-md-inline">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "User"}
                </span>
                <i className="fas fa-chevron-down ms-2 text-dark"></i>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="accountDropdown"
              >
                <li>
                  <Link className="dropdown-item" to="/account">
                    Account Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/edit-profile">
                    Edit Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/change-password">
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/track-order">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/order-history">
                    Order History
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="text-dark text-decoration-none">
                Login
              </Link>
              <Link to="/register" className="text-dark text-decoration-none">
                Register
              </Link>
            </div>
          )}

          {/* Cart */}
          <div
            className="position-relative cart-icon"
            style={{ cursor: "pointer" }}
            onClick={toggleCart}
          >
            <i className="fas fa-shopping-cart fs-5 text-dark"></i>
            {cartItems.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItems.length}
              </span>
            )}
          </div>

          {/* Hamburger Menu for mobile */}
          <button
            className="hamburger d-lg-none"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className={`nav-wrapper ${mobileMenuOpen ? "open" : ""}`}>
        <ul className="nav flex-column flex-lg-row justify-content-center">
          {categories.map((category, index) => (
            <li className="nav-item dropdown" key={index}>
              <button
                className="nav-link dropdown-toggle text-dark bg-transparent border-0"
                type="button"
                onClick={() => navigate(`/category/${category.id}/products`)}
              >
                {category.name}
              </button>
              <ul className="dropdown-menu">
                {category.subcategories?.map((sub, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      className="dropdown-item"
                      to={`/subcategory/${sub.id}/products`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li className="nav-item">
            <Link to="/aboutus" className="nav-link text-dark">
              About Us
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contactus" className="nav-link text-dark">
              Contact Us
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/reviews" className="nav-link text-dark">
              Reviews
            </Link>
          </li>
        </ul>
      </nav>

      <CartSlider isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  );
};

export default Header;
