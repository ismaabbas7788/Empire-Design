import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import '../ReviewPage.css';

const WebsiteReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();  // To get current URL for redirect
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userName, setUserName] = useState('');
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setUserName(user.name || user.email);
    } else {
      setUserName('');  // Clear if not logged in
    }
    fetchWebsiteReviews();
  }, []);

  const fetchWebsiteReviews = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/website/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('❌', err));
  };

  const submitWebsiteReview = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
    // pass current page as redirect query param
    navigate('/login?redirect=/reviews');  
    return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/website/reviews`, {
        user_name: user.name || user.email,
        rating,
        review: reviewText,
      })
      .then(() => {
        setMessage('Thanks for your feedback!');
        setRating(0);
        setReviewText('');
        fetchWebsiteReviews();
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        console.error('❌', err);
        setMessage('Error submitting feedback.');
      });
  };

  const reviewsToShow = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h3 className="mb-4 text-center fw-bold text-primary">We value your feedback</h3>

              {/* Show logged-in username, read-only or empty if not logged in */}
              <input
                type="text"
                className="form-control mb-3"
                value={userName}
                readOnly
                placeholder="Please log in to submit review"
              />

              <div className="mb-3 d-flex align-items-center justify-content-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${rating >= star ? 'text-warning' : 'text-secondary'}`}
                    onClick={() => setRating(star)}
                    style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                  >
                    {rating >= star ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>

              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              <div className="d-grid">
                <button className="btn btn-primary btn-lg" onClick={submitWebsiteReview}>
                  Submit Feedback
                </button>
              </div>

              {message && (
                <div className="alert alert-info mt-3 text-center fw-semibold">{message}</div>
              )}
            </div>
          </div>

          <h4 className="text-secondary mb-3">Recent Reviews</h4>

          {reviews.length === 0 && <p>No reviews yet. Be the first!</p>}

          {reviewsToShow.map((rev, i) => (
            <div key={i} className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong className="text-dark">{rev.user_name}</strong>
                  <div>
                    {[...Array(rev.rating)].map((_, i) => (
                      <FaStar key={i} color="gold" />
                    ))}
                    {[...Array(5 - rev.rating)].map((_, i) => (
                      <FaRegStar key={i} color="#ccc" />
                    ))}
                  </div>
                </div>
                <p className="text-muted mb-0">{rev.review}</p>
              </div>
            </div>
          ))}

          {reviews.length > 3 && (
            <div className="text-center mb-5">
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteReviewPage;
