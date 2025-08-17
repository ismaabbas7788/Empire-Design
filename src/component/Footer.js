import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { user } = response.data;
        setMessage("Login successful!");
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred during login.");
      }
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col">
            <h5>Helpful Links</h5>
            <ul>
              <li><a href="/aboutus">About Us</a></li>
              <li><a href="/contactus">Contact Us</a></li>
              <li><a href="/reviews">Reviews</a></li>
              <li><a href="/all-products">See All Products</a></li>
            </ul>
          </div>
          <div className="col">
            <h5>Contact Info</h5>
            <p>Oxford (UK): 1-3 Abbey Street, Eynsham, Oxford, OX29 4TB</p>
            <p>Walnut, CA (USA): 340 S Lemon Ave #3358, Walnut, California 91789</p>
          </div>
          <div className="col">
            <h5>Sign In Now</h5>
            {user ? (
              <p>
                Logged in as <strong>{user.email}</strong>. Please log out first to sign in with a different account.
              </p>
            ) : (
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">Sign In Now</button>
                {message && <p style={{ marginTop: "10px", color: "red" }}>{message}</p>}
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>
         Developed by: Isma Abbas and Areeba Zafar
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
