import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Fireworks from "fireworks-js";

import "../CelebrationPage.css";

const CelebrationPage = () => {
  const { width, height } = useWindowSize();

  useEffect(() => {
    const container = document.getElementById("fireworks-container");
    const fireworks = new Fireworks(container, {
      speed: 3,
      acceleration: 1.1,
      friction: 0.95,
      gravity: 1.2,
      particles: 250,
    });
    fireworks.start();

    return () => fireworks.stop();
  }, []);

  return (
    <div className="celebration-container">
      <Confetti width={width} height={height} numberOfPieces={180} recycle={false} />
      <div id="fireworks-container" className="fireworks-container"></div>

      <div className="celebration-content">
        <h1 className="celebration-title">Order Successfully Placed</h1>
        <p className="celebration-subtitle">We sincerely appreciate your business.</p>

        <div className="celebration-buttons">
          <Link to="/track-order" className="track-order-btn">
            Track Your Order
          </Link>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CelebrationPage;
