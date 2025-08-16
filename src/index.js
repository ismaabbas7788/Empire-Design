import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Bootstrap

// ✅ Import GoogleOAuthProvider
import { GoogleOAuthProvider } from '@react-oauth/google';

// ✅ Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "968449252995-33009b1tkplrhq6211sgtingtc02o3c1.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Optional: Performance monitoring
reportWebVitals();
