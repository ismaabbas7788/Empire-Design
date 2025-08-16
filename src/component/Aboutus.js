import React from "react";
import "../aboutus.css";

function Aboutus() {
  return (
    <div className="aboutus-section container my-5">
    <div className="row align-items-center">
      <div className="col-md-6">
        <img
          src="/images/aboutus.jpg"
          alt="About Us"
          className="img-fluid rounded"
        />
      </div>
      <div className="col-md-6">
        <h3 className="aboutus-title">About Us</h3>
        <p className="aboutus-text">
          Welcome to Empire Design, where innovation meets elegance in
          furniture shopping. We are dedicated to transforming the way you
          design your living spaces by combining high-quality furniture with
          state-of-the-art technology. With our unique Augmented Reality (AR)
          feature, you can visualize and virtually place furniture in your
          home, ensuring every piece complements your space perfectly.
        </p>
        <p className="aboutus-text">
          We curate a diverse collection of furniture that reflects timeless
          beauty and modern trends, catering to every style and budget. Our
          mission is to make your shopping experience seamless, interactive,
          and personalized, helping you turn your house into a home you'll
          cherish.
        </p>
        <button className="btn btn-dark explore-btn">Explore</button>
        </div>
      </div>

      {/* New Section */}
      <div className="who-we-are my-5 text-center">
        <h2 className="who-title">Who We Are</h2>
        <p className="who-description">
          At Empire Design, we are a passionate team of innovators, designers,
          and tech enthusiasts dedicated to reimagining the furniture shopping
          experience. Born from the desire to make furnishing your home simpler
          and more enjoyable, we’ve built a platform that merges creativity with
          cutting-edge technology.
        </p>
        <div className="row mt-4 custom-width mx-auto">
  <div className="col-md-4">
    <div className="icon-box">
      <div className="gray-line"></div>
      <img src="/images/icon1.jpg" alt="Innovative Design" className="icon-img" />
      <h5>Innovative Design</h5>
      <p style={{ fontSize: "12px" }}>
        Our designs are a perfect blend of functionality and aesthetics, crafted to inspire and elevate your living spaces. We aim to bring innovation into every piece, making your home truly unique.
      </p>
      <div className="gray-line"></div>
    </div>
  </div>
  <div className="col-md-4">
    <div className="icon-box">
      <div className="gray-line"></div>
      <img src="/images/icon2.jpg" alt="Personalized Shopping Experience" className="icon-img" />
      <h5>Personalized Shopping Experience</h5>
      <p style={{ fontSize: "12px" }}>
        With our AR technology, you can visualize furniture in your room before you buy, ensuring a personalized fit for your home and style preferences.
      </p>
      <div className="gray-line"></div>
    </div>
  </div>
  <div className="col-md-4">
    <div className="icon-box">
      <div className="gray-line"></div>
      <img src="/images/icon3.jpg" alt="Sustainable Choices" className="icon-img" />
      <h5>Sustainable Choices</h5>
      <p style={{ fontSize: "12px" }}>
      We prioritize sustainability by offering furniture made from eco-friendly materials, helping you create a beautiful space while caring for the planet, and ensuring long-term environmental benefits.
</p>
      <div className="gray-line"></div>
    </div>
  </div>
</div>


      </div>
    </div>
  );
}

export default Aboutus;
