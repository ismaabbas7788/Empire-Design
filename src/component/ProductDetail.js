import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import '@google/model-viewer';
import '../pagedetail.css';
import {
  FaCheckCircle,
  FaPlus,
  FaMinus,
  FaStar,
  FaRegStar,
  FaEye
} from 'react-icons/fa';

const StarRating = ({ rating, size = 16 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={size} className="star filled" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStar key={i} size={size} className="star filled" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} className="star" />);
    }
  }
  return <div className="stars">{stars}</div>;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { addToCart } = useCart();

  const user = JSON.parse(localStorage.getItem('user'));

  const imagePreviewRef = useRef();

  // Drag & resize state for 3D model overlay
  const [overlayPos, setOverlayPos] = useState({ x: 50, y: 10 }); // % from top-left of container
  const [overlaySize, setOverlaySize] = useState({ width: 80, height: 300 }); // width % and height px

  // Refs for drag handling
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('❌', err));
    fetchReviews();
  }, [id]);

  const fetchReviews = () => {
    axios.get(`http://localhost:5000/api/products/${id}/reviews`)
      .then(res => {
        const sortedReviews = [...res.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setReviews(sortedReviews);
      })
      .catch(err => console.error('❌', err));
  };

  const handleIncreaseQty = () => setQuantity(q => q + 1);
  const handleDecreaseQty = () => setQuantity(q => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (product.stock_quantity === 0) return;
    addToCart({ ...product, quantity });
    setMessage(`${quantity} item${quantity > 1 ? 's' : ''} added to cart!`);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleSubmitReview = () => {
    setMessage('');
    if (!user || !user.email) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }

    const trimmedComment = reviewText.trim();

    if (rating === 0 && trimmedComment === '') {
      setMessage('Please give a rating to submit your review.');
      return;
    }

    axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
      user_name: user.username || user.email,
      rating: +rating,
      review: trimmedComment,
      user_email: user.email
    })
    .then(() => {
      fetchReviews();
      setRating(0);
      setReviewText('');
      setMessage('Review submitted successfully!');
      setTimeout(() => setMessage(''), 5000);
    })
    .catch(err => {
      console.error('❌', err);
      setMessage('Failed to submit review.');
    });
  };

 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  setUploadedImage(url);
};

  const closeModal = () => {
    setShowRoomModal(false);
    setUploadedImage(null);
    // Reset overlay position and size on close if you want:
    setOverlayPos({ x: 50, y: 10 });
    setOverlaySize({ width: 80, height: 300 });
  };

  // Drag handlers
  const onDragStart = (e) => {
    dragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  const onDragMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setOverlayPos(pos => {
      // Calculate new position in percent relative to container width/height
      // We'll clamp between 0 and 100 for x and y.
      const container = dragRef.current?.parentElement;
      if (!container) return pos;
      const rect = container.getBoundingClientRect();
      let newX = pos.x + (dx / rect.width) * 100;
      let newY = pos.y + (dy / rect.height) * 100;

      newX = Math.min(100, newX);
      newY = Math.min(100, newY);

      return { x: newX, y: newY };
    });
    e.preventDefault();
  };

  const onDragEnd = (e) => {
    dragging.current = false;
    e.preventDefault();
  };

  // Resize handlers (vertical resize handle at bottom right corner)
  const onResizeStart = (e) => {
    resizing.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
    e.preventDefault();
  };

  const onResizeMove = (e) => {
    if (!resizing.current) return;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setOverlaySize(size => {
      let newHeight = size.height + dy;
      // Minimum and maximum height constraints
      newHeight = Math.max(100, Math.min(600, newHeight));
      return { ...size, height: newHeight };
    });
    e.preventDefault();
  };

  const onResizeEnd = (e) => {
    resizing.current = false;
    e.preventDefault();
  };

  useEffect(() => {
    // Attach global mouse move and up handlers when dragging or resizing
    const onMouseMove = (e) => {
      if (dragging.current) onDragMove(e);
      if (resizing.current) onResizeMove(e);
    };
    const onMouseUp = (e) => {
      if (dragging.current) onDragEnd(e);
      if (resizing.current) onResizeEnd(e);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (!product) return <div className="container mt-5">Loading…</div>;

  const avg = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="container mt-5 product-detail-wrapper">
      {/* Product Info */}
      <div className="row">
        <div className="col-md-6">
          <model-viewer
            src={product.model_url}
            alt={product.name}
            auto-rotate
            camera-controls
            style={{
              width: '85%',
              height: '350px',
              backgroundColor: '#f4f4f4',
              borderRadius: '12px',
              opacity: isOutOfStock ? 0.6 : 1,
              filter: isOutOfStock ? 'grayscale(70%)' : 'none'
            }}
          />
          {/* View in Your Room Button */}
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowRoomModal(true)}
          >
            <FaEye style={{ marginRight: '5px' }} />
            View in Your Room
          </button>
        </div>

        <div className="col-md-6">
          <h1>{product.name}</h1>
          <h4 className="text-muted">${product.price.toLocaleString()}</h4>
          <p className="mt-4">{product.description}</p>

          <div className="average-rating mb-3">
            <strong>Average Rating:</strong>
            <StarRating rating={avg} size={20} />
            <span className="avg-number">({avg.toFixed(1)})</span>
          </div>

          {isOutOfStock ? (
            <div className="alert alert-danger">This product is currently out of stock.</div>
          ) : (
            <>
              <div className="d-flex align-items-center">
                <button className="btn btn-outline-secondary" onClick={handleDecreaseQty}>
                  <FaMinus />
                </button>
                <input
                  type="text"
                  className="form-control text-center mx-2"
                  value={quantity}
                  readOnly
                  style={{ maxWidth: '60px' }}
                />
                <button className="btn btn-outline-secondary" onClick={handleIncreaseQty}>
                  <FaPlus />
                </button>
              </div>
              <button
                className="btn btn-success mt-3"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              {message && <p className="text-success mt-2">{message}</p>}
            </>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5">
        <h3>Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        <div>
          {(showAllReviews ? reviews : reviews.slice(0, 3)).map((r, i) => (
            <div key={i} className="review-card">
              <strong>{r.user_name}</strong>
              <StarRating rating={r.rating} size={14} />
              <p>{r.review}</p>
            </div>
          ))}
        </div>
        {reviews.length > 3 && (
          <button
            className="btn btn-link"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? 'Show less' : 'Show all'}
          </button>
        )}

        {/* Submit Review */}
        <div className="mt-4">
          <h5>Submit Your Review</h5>
          <div className="d-flex align-items-center mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                style={{ cursor: 'pointer', color: star <= rating ? '#ffc107' : '#e4e5e9', fontSize: '24px' }}
                onClick={() => setRating(star)}
                onKeyDown={(e) => { if (e.key === 'Enter') setRating(star); }}
                role="button"
                tabIndex={0}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <FaStar />
              </span>
            ))}
          </div>
          <textarea
            className="form-control"
            rows="3"
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Write your review here..."
          />
          <button
            className="btn btn-primary mt-2"
            onClick={handleSubmitReview}
          >
            Submit Review
          </button>
          {message && <p className="text-danger mt-2">{message}</p>}
        </div>
      </div>

      {/* Modal for 'View in Your Room' */}
     {showRoomModal && (
  <div className="room-modal-overlay">
    <div className="room-modal">
      {/* Close Button */}
      <button className="close-button btn btn-danger" onClick={closeModal}>
        Close
      </button>

      {/* Uploaded Room Image */}
      <div className="room-preview" ref={imagePreviewRef}>
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded room"
            className="uploaded-room-img"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              objectFit: 'contain',
            }}
          />
        )}

        {/* 3D model overlay */}
        <div
          ref={dragRef}
          onMouseDown={onDragStart}
          style={{
            position: 'absolute',
            top: `${overlayPos.y}%`,
            left: `${overlayPos.x}%`,
            width: `${overlaySize.width}%`,
            height: `${overlaySize.height}px`,
            cursor: 'move',
            zIndex: 10,
          }}
        >
          <model-viewer
            src={product.model_url}
            alt={product.name}
            camera-controls
            interaction-prompt="none"
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'auto',
              backgroundColor: 'transparent',
            }}
          ></model-viewer>

          

          {/* Resize Handle */}
          <div
            ref={resizeRef}
            onMouseDown={onResizeStart}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '15px',
              height: '15px',
              backgroundColor: '#ccc',
              cursor: 'nwse-resize',
              zIndex: 11,
            }}
          />
        </div>
      </div>

      {/* Upload new room image */}
      <div className="mt-3">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ProductDetail;


