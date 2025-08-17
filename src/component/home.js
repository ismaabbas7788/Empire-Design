// Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import '../Home.css'; // Update the path based on actual location

const Home = () => {
  const navigate = useNavigate();

  const [recentProducts, setRecentProducts] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [products, setProducts] = useState([]);


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/recent`)
      .then((res) => setRecentProducts(res.data))
      .catch((err) => console.error('Error fetching recent products:', err));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/top-sellers`)
      .then((res) => setTopSellers(res.data))
      .catch((err) => console.error('Error fetching top sellers:', err));
  }, []);


  

  return (
    <div>
      {/* Main Carousel */}
      <div className="carousel-container mt-4">
        <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/images/photo2.jpeg" className="d-block w-100" alt="Living Room" />
            </div>
            <div className="carousel-item">
              <img src="/images/photo11.jpg" className="d-block w-100" alt="Living Room" />
            </div>
            <div className="carousel-item">
              <img src="/images/photo3.jpeg" className="d-block w-100" alt="Outdoor Room" />
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Explore Furniture Collection */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Explore Our Furniture Collection</h2>
        <div className="row text-center justify-content-center">
          {[
            { id: 2, label: 'Shop Living Rooms', image: 'photo8.jpeg', title: 'Have A Seat', text: 'Sectionals, sofas, & More' },
            { id: 4, label: 'Shop Storage Items', image: 'photo6.jpeg', title: 'Storage Items', text: 'TV Stands, & more' },
            { id: 3, label: 'Shop Bedrooms', image: 'photo10.jpg', title: 'Best In Rest', text: 'Beds, Dressers, & More' },
            { id: 5, label: 'Shop Home Offices', image: 'photo12.jpeg', title: 'Office Life', text: 'Desks, Storage, & More' },
          ].map((item) => (
            <div className="col-md-3 col-sm-6 mb-4" key={item.id}>
              <div className="card border-0 custom-card">
                <div className="image-wrapper">
                  <img src={`/images/${item.image}`} alt={item.title} className="img-fluid" />
                </div>
                <div className="card-body">
                  <h5 className="card-title font-weight-bold">{item.title}</h5>
                  <p className="card-text">{item.text}</p>
                  <button onClick={() => navigate(`/category/${item.id}/products`)} className="btn btn-sm w-100 mt-auto custom-yellow-btn">
                    {item.label}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Sellers */}
      <div className="container mt-4 top-seller-section">
        <h4 className="text-center mb-4 fw-semibold">Top Seller Products</h4>
        <div className="row justify-content-center">
          {topSellers.map((product) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={product.id}>
              <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                <div className="card product-card h-100">
                  <div className="image-container">
                    <img src={`/images/${product.image}`} className="card-img-top" alt={product.name} />
                  </div>
                  <div className="card-body p-2 d-flex flex-column justify-content-between">
                    <h6 className="card-title mb-1 text-truncate">{product.name}</h6>
                    <p className="card-text small text-muted mb-2">Price: ${product.price}</p>
                    <div className="btn btn-sm w-100 mt-auto custom-yellow-btn">View</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div className="container mt-5">
        <h4 className="text-center mb-4 fw-semibold">Most Recent Products</h4>
        <div className="row justify-content-center">
          {recentProducts.slice(0, 4).map((product) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={product.id}>
              <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                <div className="card product-card h-100">
                  <div className="image-container">
                    <img src={`/images/${product.image}`} className="card-img-top" alt={product.name} />
                  </div>
                  <div className="card-body p-2 d-flex flex-column justify-content-between">
                    <h6 className="card-title mb-1 text-truncate">{product.name}</h6>
                    <p className="card-text small text-muted mb-2">Price: ${product.price}</p>
                    <div className="btn btn-sm w-100 mt-auto custom-yellow-btn">View</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Art of Comfortable Living */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="border-dotted small-div p-4">
              <h4 className="text-center">The Art of Comfortable Living</h4>
              <p className="text-center">"Where Style Meets Serenity, and Every Space Tells a Story."</p>
              <div className="text-center mt-4">
                <button className="btn btn-danger px-4 py-2" onClick={() => navigate('/all-products')}>
                  Explore All Items →
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border-dotted p-4">
              <h5 className="text-center">Design your Dreams</h5>
              <p className="text-center">Upload Room Image</p>
              <div className="d-flex justify-content-around">
                <div className="text-center">
  <div className="text-center">
  <input
    type="file"
    accept="image/*"
    className="form-control mb-2"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        localStorage.setItem('uploadedRoomImage', base64);
        navigate('/decorate-room');
      };
      reader.readAsDataURL(file);
    }}
  />
</div>

</div>
               
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="why-choose-us-section container mt-5 mb-5 py-4 px-3">
        <h2 className="text-center mb-4 fw-bold">Why Choose Us?</h2>
        <div className="row text-center">
          {[
            { icon: '✔️', title: 'Premium Quality', desc: 'Crafted with the finest materials for durability and style.' },
            { icon: '🚚', title: 'Free & Fast Delivery', desc: 'Enjoy free shipping on all orders with fast delivery.' },
            { icon: '🔒', title: 'Secure Payments', desc: 'Safe and encrypted payment gateways for worry-free shopping.' },
            { icon: '❤️', title: '1000+ Happy Customers', desc: 'Trusted by thousands of satisfied customers nationwide.' },
          ].map((item, index) => (
            <div className="col-md-3 col-sm-6 mb-4" key={index}>
              <div className="icon-box">
                <div className="icon">{item.icon}</div>
                <h5 className="mt-2">{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Highlight */}
      <div className="latest-blog-section container mt-5 mb-5 p-4">
        <div className="row align-items-center blog-highlight flex-md-row flex-column-reverse">
          <div className="col-md-6 d-flex flex-column justify-content-center p-3">
            <h3 className="fw-bold mb-3">See Our Latest Blog</h3>
            <h5 className="text-dark mb-2">“Top 5 Interior Design Trends of the Year”</h5>
            <p className="text-muted">
                   Step into the world of style and sophistication with our latest blog, where we explore the top interior design trends shaping modern living spaces. Whether you're planning a full home makeover or simply looking to refresh a single room, these trends offer the perfect blend of comfort, functionality, and visual appeal. From the calming embrace of earthy tones to the rise of biophilic design and multifunctional layouts, this year’s trends are all about creating spaces that feel both personal and purposeful. Discover how to stay ahead of the design curve and bring timeless elegance into your home with ideas that inspire and elevate.            </p>
            <Link to="/blog/top-5-interior-trends" className="btn custom-readmore-btn mt-2 align-self-start">
              Read More
            </Link>
          </div>
          <div className="col-md-6">
            <img src="/images/blog.jpg" alt="Featured Blog" className="img-fluid rounded blog-featured-img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
