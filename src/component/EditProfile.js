import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      axios
        .post(`${process.env.REACT_APP_API_URL}/profile/user`, { userId: parsedUser.id })
        .then((response) => {
          setUser({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phone: response.data.phone,
          });
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  const validate = () => {
    const newErrors = {};

    // Name: at least 3 letters, no digits
    const nameRegex = /^[A-Za-z]{3,}$/;

    if (!nameRegex.test(user.firstName)) {
      newErrors.firstName = 'First name must be at least 3 alphabetic characters and contain no numbers.';
    }

    if (!nameRegex.test(user.lastName)) {
      newErrors.lastName = 'Last name must be at least 3 alphabetic characters and contain no numbers.';
    }

    // Email: at least 3 letters, may contain digits, must contain '@'
    const emailRegex = /^[a-zA-Z]{3}[a-zA-Z0-9]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(user.email)) {
      newErrors.email = 'Email must start with at least 3 letters and include "@" and a domain.';
    }

    // Phone: must be exactly 11 digits
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(user.phone)) {
      newErrors.phone = 'Mobile number must be exactly 11 digits and contain only numbers.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear field-specific error
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));

    axios
      .post(`${process.env.REACT_APP_API_URL}/profile/update-details`, {
        userId: storedUser.id,
        ...user,
      })
      .then(() => {
        navigate('/account');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setErrors({ general: 'An error occurred while updating the profile. Please try again later.' });
      });
  };

  return (
    <div className="container mt-4">
      <h3 style={{ marginBottom: '50px' }}>Edit Profile</h3>
      <form onSubmit={handleSubmit} noValidate>

        {/* First Name */}
        <div className="mb-3">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label>Mobile Number</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        {/* General Error */}
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

<div className="text-end">
  <button
    type="submit"
    className="btn"
    style={{ backgroundColor: 'black', color: 'white' }}
  >
    Update Profile
  </button>
</div>

      </form>
    </div>
  );
};

export default EditProfile;
