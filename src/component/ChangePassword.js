import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'danger'

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      setMessageType('danger');
      setMessage('Password must be at least 6 characters, include at least 1 number and 1 special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType('danger');
      setMessage('New password and confirmation do not match.');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));

    try {
      const response = await axios.post('http://localhost:5000/api/profile/change-password', {
        userId: storedUser.id,
        oldPassword,
        newPassword,
      });

      setMessageType('success');
      setMessage('Password changed successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/account');
      }, 1500);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessageType('danger');
      setMessage(error.response?.data?.error || 'Failed to change password. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Change Password</h3>

      <form onSubmit={handleSubmit}>
        {message && (
          <div className={`alert alert-${messageType}`} role="alert">
            {message}
          </div>
        )}

        <div className="form-group mb-3">
          <label>Old Password</label>
          <input
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <small>
            <Link to="/forgetpass">Forgot password?</Link>
          </small>
        </div>

        <div className="form-group mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="text-end">
          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: 'black', color: 'white' }}
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
