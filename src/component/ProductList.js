import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../productlist.css';
import { useCart } from './CartContext';
import { FaCheckCircle } from 'react-icons/fa';

const ProductList = () => {
  const { subcategoryId, categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [addedProductId, setAddedProductId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const { addToCart } = useCart();

  const fetchProducts = () => {
    let apiUrl = '';
    if (subcategoryId) {
      apiUrl = `${process.env.REACT_APP_API_URL}/categories/subcategories/${subcategoryId}/products`;
    } else if (categoryId) {
      apiUrl = `${process.env.REACT_APP_API_URL}/categories/${categoryId}/products`;
    } else {
      apiUrl = `${process.env.REACT_APP_API_URL}/categories/all-products`;
    }

    const params = new URLSearchParams();
    params.append('page', page);
    if (sortBy) params.append('sortBy', sortBy);
    if (inStockOnly) params.append('inStock', 'true');
    if (priceRange.min) params.append('minPrice', priceRange.min);
    if (priceRange.max) params.append('maxPrice', priceRange.max);

    axios
      .get(`${apiUrl}?${params.toString()}`)
      .then((response) => {
        setProducts(response.data);
        setHasMore(response.data.length === 10);
      })
      .catch((error) => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchProducts();
  }, [subcategoryId, categoryId, page, sortBy, inStockOnly, priceRange]);

  const handleAddToCart = (product) => {
    if (product.stock_quantity === 0) return;
    addToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 4000);
  };

  return (
    <div className="container my-5">
      <div className="text-center my-4 compact-banner">
        <h3 className="fw-bold">Find Your Perfect Furniture</h3>
        <p className="text-muted">Quality, comfort, and style — all in one place.</p>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
             <option value="name_asc">Name: A to Z</option>
  <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          />
        </div>
        <div className="col-md-3 mb-2 d-flex align-items-center">
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
          />
          <label className="form-check-label">In Stock Only</label>
        </div>
      </div>

      {/* Products */}
      <div className="row justify-content-center g-4">
        {products.map((product) => (
          <div className="col-12 col-md-6" key={product.id}>
            <div className="product-card d-flex align-items-center p-3 h-100">
              <Link
                to={`/product/${product.id}`}
                className="text-decoration-none text-dark d-flex w-100"
              >
                <div className="product-image-container me-3">
                  {product.image ? (
                    <img
                      src={`/images/${product.image}`}
                      className={`img-fluid product-image ${product.stock_quantity === 0 ? 'out-of-stock-img' : ''}`}
                      alt={product.name}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="product-details flex-grow-1">
                  <h5 className="product-name mb-2">{product.name}</h5>
                  <p className="product-description mb-2">{product.description.slice(0, 80)}...</p>
                  <p className="product-price fw-bold">$ {product.price.toLocaleString()}</p>

                  <div className="d-flex align-items-center gap-2">
                    {product.stock_quantity === 0 ? (
                      <span className="badge bg-danger mt-2">Out of Stock</span>
                    ) : (
                      <button
                        className="btn btn-dark mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>
                    )}

                    {addedProductId === product.id && (
                      <div className="text-success d-flex align-items-center mt-2" style={{ fontSize: '0.9rem' }}>
                        <FaCheckCircle className="me-1" />
                        Item added to cart!
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center my-4 gap-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="align-self-center">Page {page}</span>
        <button
          className="btn btn-outline-primary"
          onClick={() => hasMore && setPage((p) => p + 1)}
          disabled={!hasMore}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
