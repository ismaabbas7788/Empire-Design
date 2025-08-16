import React, { useState } from 'react';
import '../register.css';

export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    const alphaRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const alphaStartRegex = /^[A-Za-z]{4}/;

    const email = formData.email.trim();
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const phone = formData.phone.trim();
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (!firstName) {
      newErrors.firstName = 'First Name is required';
    } else if (!alphaRegex.test(firstName)) {
      newErrors.firstName = 'First Name must contain only letters';
    }

    if (!lastName) {
      newErrors.lastName = 'Last Name is required';
    } else if (!alphaRegex.test(lastName)) {
      newErrors.lastName = 'Last Name must contain only letters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address';
    } else if (!alphaStartRegex.test(email)) {
      newErrors.email = 'First 4 characters of email must be letters';
    }

    if (!phone) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^\d{11}$/.test(phone)) {
      newErrors.phone = 'Phone Number must be exactly 11 digits';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setShowSuccess(true);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
          });
          setErrors({});
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Server error, please try again later');
      }

      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center">
      {showSuccess && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3 w-50">
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            🎉 Registration successful! Welcome aboard.
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => setShowSuccess(false)}
            ></button>
          </div>
        </div>
      )}

      <div className="login-container row shadow bg-white rounded overflow-hidden">
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/images/register.jpg"
            alt="Register"
            className="img-fluid h-100 w-100"
          />
        </div>

        <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
          <h3 className="mb-1">Empire Design</h3>
          <p className="mb-4 text-muted">Create your account below.</p>

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="row mb-3">
              <div className="col-6">
                <input
                  type="text"
                  autoComplete="off"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
              </div>
              <div className="col-6">
                <input
                  type="text"
                  autoComplete="off"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <input
                  type="email"
                  autoComplete="new-email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="col-6">
                <input
                  type="text"
                  autoComplete="off"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-6">
                <input
                  type="password"
                  autoComplete="new-password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
              <div className="col-6">
                <input
                  type="password"
                  autoComplete="new-password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-3 text-center">
            Already have an account? <a href="/login">Login here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
