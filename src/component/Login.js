import React, { useState, useEffect } from 'react';
import '../Login.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default to user
  const [errors, setErrors] = useState({});
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate(redirect, { replace: true });
    }
  }, [navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoginMessage('');

    if (!email || !password) {
      setErrors({ message: 'Email and password are required' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role,
      });

      if (response.status === 200) {
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('user-logged-in'));

        setLoginMessage('Login successful!');
        if (user.role === 'admin') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate(redirect, { replace: true });
        }
      }
    } catch (error) {
      setLoginMessage(error.response?.data?.message || 'An error occurred during login.');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        profileImage: decoded.picture,
      });

      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.dispatchEvent(new Event('user-logged-in'));
        navigate(redirect, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setLoginMessage('Google login failed.');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="login-container d-flex flex-column w-75 w-md-50">
        <div className="row w-80">
          <div className="col-md-6 p-0 d-none d-md-block" style={{ height: '500px' }}>
            <img
              src="/images/login.jpg"
              alt="Login Visual"
              className="img-fluid w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className="col-md-6 d-flex flex-column align-items-center justify-content-center p-4">
            <h3 className="left-align mb-4">Empire Design</h3>
            <h6 className="left-align">Sign In To Empire Design</h6>

            <div className="button-container d-flex flex-column align-items-center w-100 mb-3">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setLoginMessage('Google Sign-in failed.')}
              />
            </div>

            <div className="mb-3 w-100 text-center">
              <hr className="w-25 d-inline" />
              <span style={{ fontWeight: 'bold', color: 'grey' }}>OR</span>
              <hr className="w-25 d-inline" />
            </div>

            <form className="w-100" onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <select
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Login as User</option>
                  <option value="admin">Login as Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-dark w-100 mb-3">
                Sign In
              </button>
            </form>

            {loginMessage && <div className="alert alert-info mt-3">{loginMessage}</div>}
            {errors.message && <div className="alert alert-danger mt-3">{errors.message}</div>}

            <div className="w-100 text-end">
              <Link to="/forgetpass">Forgot Password?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
