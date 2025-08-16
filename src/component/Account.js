import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../account.css';
import { useNavigate } from 'react-router-dom';

export const Account  = () => {
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      axios
        .post(`${process.env.REACT_APP_API_URL}/profile/user`, { userId: parsedUser.id })
        .then((res) => setUser(res.data))
        .catch((err) => console.error('Error fetching user data:', err));
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && user) {
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('userId', user.id);

      axios
        .post(`${process.env.REACT_APP_API_URL}/profile/update-profile`, formData)
        .then((res) => {
          setUser((u) => ({ ...u, profileImage: res.data.profileImage }));
        })
        .catch((err) => console.error('Error updating profile image', err));
    }
  };

  const handleRemoveImage = () => {
    if (!user) return;
    axios
      .post(`${process.env.REACT_APP_API_URL}/profile/remove-profile`, { userId: user.id })
      .then(() => {
        setUser((u) => ({ ...u, profileImage: null }));
      })
      .catch((err) => console.error('Error removing profile image', err));
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-photo-container">
          <img
            src={
              user.profileImage
                ? `http://localhost:5000/uploads/${user.profileImage}`
                : '/images/default-profile.jpg'
            }
            alt="Profile"
            className="profile-photo"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/default-profile.jpg';
            }}
            onClick={() => fileInputRef.current.click()}
          />

          {/* edit icon */}
          <span className="edit-icon" onClick={() => fileInputRef.current.click()}>
            <i className="fas fa-pencil-alt"></i>
          </span>

          {/* remove icon, only if user.profileImage exists */}
          {user.profileImage && (
            <span className="remove-icon" onClick={handleRemoveImage}>
              <i className="fas fa-trash-alt"></i>
            </span>
          )}

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <h3 className="mt-3">
          {user.firstName} {user.lastName}
        </h3>
        <p>{user.email}</p>
      </div>

      {/* User Info */}
      <div className="info-card">
        <h4>Account Details</h4>
        <p>
          <strong>Full Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Mobile Number:</strong> {user.phone}
        </p>
      </div>
    </div>
  );
};

export default Account ;
