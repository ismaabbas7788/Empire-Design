import React, { useState, useEffect } from "react";

export const ShippingForm = ({ onSubmit, initialData, addressMessage }) => {
  const [address, setAddress] = useState({
    email: "",
    deliveryCountry: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setAddress(initialData);
    }
  }, [initialData]);

useEffect(() => {
  fetch("https://restcountries.com/v3.1/all?fields=name")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log("Fetched countries:", data);
      const names = data.map((c) => c.name.common).sort();
      setCountries(names);
    })
    .catch((err) => {
      console.error("Failed to fetch countries:", err);
    });
}, []);



  const validate = () => {
    const newErrors = {};
    const email = address.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const alphaRegex = /^[A-Za-z]+$/;
    const alphaStartRegex = /^[A-Za-z]{4}/;
    const addressRegex = /^[A-Za-z0-9\s]+$/;
    const containsLetterRegex = /[A-Za-z]/;
    const digitRegex = /^\d+$/;
    const cityRegex = /^[A-Za-z\s\-]+$/;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    } else if (!alphaStartRegex.test(email)) {
      newErrors.email = "First 4 characters of email must be letters";
    }

    if (!address.deliveryCountry) {
      newErrors.deliveryCountry = "Please select a country";
    }

    if (!address.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!alphaRegex.test(address.firstName.trim())) {
      newErrors.firstName = "First name must contain only letters";
    }

    if (!address.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!alphaRegex.test(address.lastName.trim())) {
      newErrors.lastName = "Last name must contain only letters";
    }

    const trimmedAddress = address.address.trim();
    if (!trimmedAddress) {
      newErrors.address = "Address is required";
    } else if (trimmedAddress.length < 5) {
      newErrors.address = "Address is too short";
    } else if (!addressRegex.test(trimmedAddress)) {
      newErrors.address = "Address must contain only letters, numbers, and spaces";
    } else if (!containsLetterRegex.test(trimmedAddress)) {
      newErrors.address = "Address must contain at least one letter";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
    } else if (!cityRegex.test(address.city)) {
      newErrors.city = "City must contain only letters, spaces, or hyphens";
    }

    if (!address.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (!digitRegex.test(address.postalCode)) {
      newErrors.postalCode = "Postal code must be numeric";
    }

    if (!address.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{11}$/.test(address.phone)) {
      newErrors.phone = "Phone number must be exactly 11 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(address);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="shipping-form" noValidate>
        <h5 style={{ color: "black" }}>Contact</h5>
        <input
          type="text"
          name="email"
          value={address.email}
          onChange={handleChange}
          placeholder="Email"
          className="full-width"
        />
        {errors.email && <div className="error">{errors.email}</div>}

        <h5 style={{ color: "black" }}>Delivery</h5>
        <select
          name="deliveryCountry"
          value={address.deliveryCountry}
          onChange={handleChange}
          className="full-width"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.deliveryCountry && <div className="error">{errors.deliveryCountry}</div>}

        <div className="row-flex">
          <input
            type="text"
            name="firstName"
            value={address.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="half-width"
          />
          {errors.firstName && <div className="error">{errors.firstName}</div>}

          <input
            type="text"
            name="lastName"
            value={address.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="half-width"
          />
          {errors.lastName && <div className="error">{errors.lastName}</div>}
        </div>

        <input
          type="text"
          name="address"
          value={address.address}
          onChange={handleChange}
          placeholder="Address"
          className="full-width"
        />
        {errors.address && <div className="error">{errors.address}</div>}

        <div className="row-flex">
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            placeholder="City"
            className="half-width"
          />
          {errors.city && <div className="error">{errors.city}</div>}

          <input
            type="text"
            name="postalCode"
            value={address.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="half-width"
          />
          {errors.postalCode && <div className="error">{errors.postalCode}</div>}
        </div>

        <input
          type="text"
          name="phone"
          value={address.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="full-width"
        />
        {errors.phone && <div className="error">{errors.phone}</div>}

        <button type="submit" className="button">Submit Address</button>

        {addressMessage.text && (
          <div
            className={`message ${addressMessage.type}`}
            style={{
              padding: "10px",
              borderRadius: "6px",
              marginTop: "10px",
              color: addressMessage.type === "success" ? "#155724" : "#721c24",
              backgroundColor: addressMessage.type === "success" ? "#d4edda" : "#f8d7da",
              border: `1px solid ${addressMessage.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
            }}
          >
            {addressMessage.text}
          </div>
        )}
      </form>

      <div className="shipping-method">
        <h5 style={{ color: "black" }}>Shipping Method</h5>
        <div className="shipping-method-block">
          <span>HOME DELIVERY</span>
          <span className="shipping-price">FREE</span>
        </div>
      </div>
    </>
  );
};

export default ShippingForm;
