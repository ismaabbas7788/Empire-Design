import React, { useState, useEffect } from 'react';
import '../forgetpass.css'; // Adjust this with your CSS file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const ForgetPass = () => {
  const [step, setStep] = useState(1); // Tracks the current step
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isResending, setIsResending] = useState(false);
  const [messageVisible, setMessageVisible] = useState(true);
  
  // Initialize useNavigate hook for redirecting
  const navigate = useNavigate();

  // Handle Email Submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      if (response.status === 200) {
        setMessage('A confirmation code has been sent to your email!');
        setStep(2); // Move to the next step
        showMessage(); // Show the message with auto-hide
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while processing your request.');
      showMessage();
    }
  };

  // Handle Confirmation Code Submission
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    if (!confirmationCode) {
      setErrors({ confirmationCode: 'Confirmation code is required' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-code', { email, confirmationCode });
      if (response.status === 200) {
        setMessage('Your account has been successfully verified!');
        setStep(3); // Move to the final step
        showMessage(); // Show the message with auto-hide
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid confirmation code.');
      showMessage();
    }
  };

  // Handle New Password Submission
  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setErrors({ password: 'Both password fields are required' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ password: 'Passwords do not match' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', { email, newPassword });
      if (response.status === 200) {
        setMessage('Your password has been successfully updated!');
        showMessage(); // Show the message with auto-hide
        setStep(1); // Optionally reset the form to the initial step
        
        // Redirect to login page after successful password reset
        setTimeout(() => {
          navigate('/login');  // Redirect to Login.js after 3 seconds
        }, 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reset the password.');
      showMessage();
    }
  };

  // Handle Resend Code
  const handleResendCode = async () => {
    setIsResending(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/resend-code', { email });
      if (response.status === 200) {
        setMessage('A new confirmation code has been sent to your email.');
        showMessage();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to resend confirmation code.');
      showMessage();
    } finally {
      setIsResending(false);
    }
  };

  // Show message and auto-dismiss after 5 seconds
  const showMessage = () => {
    setMessageVisible(true);
    setTimeout(() => {
      setMessageVisible(false);
    }, 5000); // Auto-hide after 5 seconds
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="login-container d-flex flex-column w-75 w-md-50">
        <div className="row w-80">
          {/* Left Image Section */}
          <div className="col-md-6 p-0 d-none d-md-block">
            <img
              src={step === 1 ? '/images/forget.jpg' : step === 2 ? '/images/confirm.jpg' : '/images/new.jpg'} // Different images based on step
              alt="Visual"
              className="img-fluid w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Right Section */}
          <div className="col-md-6 d-flex flex-column p-4" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <h3 className="text-center mb-4">Empire Design</h3>
            {step === 1 && (
              <>
                <h5 className="text-center mb-4">Forget Password</h5>
                <form className="w-100" onSubmit={handleEmailSubmit} style={{ maxWidth: '350px' }}>
                  <div className="form-group mb-4">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                  </div>
                  <button type="submit" className="btn btn-dark w-100 mb-3">
                    Send Confirmation Code
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <h5 className="text-center mb-4">Enter The Confirmation Code</h5>

                <form className="w-100" onSubmit={handleCodeSubmit} style={{ maxWidth: '350px' }}>
                  <div className="form-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Confirmation Code"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                    />
                    {errors.confirmationCode && <div className="text-danger mt-1">{errors.confirmationCode}</div>}
                  </div>

                  <button type="submit" className="btn btn-dark w-100 mb-3">
                    Recover Account
                  </button>
                </form>

                <div className="text-center">
                  <span>Didn’t receive the confirmation code? </span>
                  <button
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="btn btn-link p-0 m-0 text-primary"
                    style={{ textDecoration: 'underline', fontWeight: 'bold' }}
                  >
                    {isResending ? 'Resending...' : 'Resend Now'}
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h5 className="text-center mb-4">Reset Your Password</h5>

                <form className="w-100" onSubmit={handleNewPasswordSubmit} style={{ maxWidth: '350px' }}>
                  <div className="form-group mb-4">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                  </div>
                  <button type="submit" className="btn btn-dark w-100 mb-3">
                    Reset Password
                  </button>
                </form>
              </>
            )}

            {/* Confirmation Message */}
            {messageVisible && (
              <div className="alert alert-info mt-3" role="alert">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
