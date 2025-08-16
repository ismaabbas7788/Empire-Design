import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../SearchResults.css';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Get the search query param
  const query = new URLSearchParams(location.search).get('query') || '';

  // Fetch categories once on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Fetch subcategories whenever category changes
  useEffect(() => {
    if (!category) {
      setSubcategories([]);
      setSubcategory('');
      return;
    }

    axios.get(`http://localhost:5000/api/categories/${category}/subcategories`)
      .then(res => setSubcategories(res.data))
      .catch(err => console.error('Error fetching subcategories:', err));

    setSubcategory('');
  }, [category]);

  // Search API call whenever query, category or subcategory changes
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setSuggestions([]);
      return;
    }

    let url = `http://localhost:5000/api/search?search=${encodeURIComponent(query)}`;

    if (subcategory) {
      url += `&subcategory=${encodeURIComponent(subcategory)}`;
    } else if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    axios.get(url)
      .then(res => {
        console.log('Search response:', res.data); // DEBUG

        if (res.data.results && res.data.results.length > 0) {
          setProducts(res.data.results);
          setSuggestions([]);
        } else if (res.data.didYouMean && res.data.didYouMean.length > 0) {
          setProducts([]);
          setSuggestions(res.data.didYouMean);
        } else {
          setProducts([]);
          setSuggestions([]);
        }
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setProducts([]);
        setSuggestions([]);
      });
  }, [query, category, subcategory]);

  // Navigate to product detail page on click
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  // Highlight matched part of text
  const highlightText = (text, highlight) => {
    if (!highlight) return text;

    const escapedHighlight = highlight.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');

    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  // When user clicks a suggestion, update URL query param
  const handleSuggestionClick = (suggestion) => {
    navigate(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        Search Results for: <span className="text-primary">{query}</span>
      </h2>

      <div className="mb-4">
        <label htmlFor="categoryFilter" className="form-label">Filter by Category:</label>
        <select
          id="categoryFilter"
          className="form-select w-50"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {category && (
        <div className="mb-4">
          <label htmlFor="subcategoryFilter" className="form-label">Filter by Subcategory:</label>
          <select
            id="subcategoryFilter"
            className="form-select w-50"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">All Subcategories</option>
            {subcategories.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="alert alert-warning">
          <p>No results found. Did you mean:</p>
          <ul>
            {suggestions.map((suggestion, i) => (
              <li
                key={i}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row">
        {products.length === 0 && suggestions.length === 0 && (
          <p className="no-products">No products found.</p>
        )}

        {products.map(product => (
          <div
            className="col-md-4 mb-4"
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card h-100 shadow-sm">
              <img
                src={`/images/${product.image}`}
                alt={product.name}
                className="card-img-top"
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{highlightText(product.name, query)}</h5>
                <p
                  className="card-text"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                  }}
                >
                  {highlightText(product.description, query
)}
</p>
</div>
</div>
</div>
))}
</div>
</div>
);
};

export default SearchResults;