import React, { useState } from "react";
import axios from "axios";
import "../contactus.css";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    setStatusMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/contact", form);
      setStatusMessage("✅ Message sent successfully!");
      setForm({ name: "", email: "", message: "" }); // Reset form
    } catch (err) {
      setStatusMessage("❌ Failed to send message. Please try again.");
      console.error("Error submitting contact form:", err);
    }
  };

  return (
    <div className="contactus-container container">
      <div className="row align-items-center">
        {/* Left Section */}
        <div className="col-md-6">
          <div className="image-container">
            <img
              src="/images/aboutus.jpg"
              alt="Office"
              className="img-fluid rounded"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="col-md-6">
          <div className="contact-form">
            <h2 className="contact-title">Let’s talk</h2>
            <p className="contact-description">
              Our friendly customer service team always responds to inquiries
              within 24 hours.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="message"
                  className="form-control"
                  rows="4"
                  placeholder="Message..."
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Submit
              </button>
              {statusMessage && (
                <div className="mt-2 text-info">{statusMessage}</div>
              )}
            </form>

            <div className="social-links mt-3">
              <p>Get in touch</p>
              <a href="#" className="me-2">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="me-2">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
