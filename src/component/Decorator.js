// Decorator.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import RoomCanvas from "./RoomCanvas";

const Decorator = () => {
  const [roomImage, setRoomImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [placedItems, setPlacedItems] = useState([]);

  useEffect(() => {
    const img = localStorage.getItem("uploadedRoomImage");
    if (img) setRoomImage(img);
    axios.get("http://localhost:5000/api/categories").then((res) => setCategories(res.data));
    axios.get("http://localhost:5000/api/subcategories").then((res) => setSubcategories(res.data));
    axios.get("http://localhost:5000/api/products").then((res) => setProducts(res.data));
  }, []);

  const filteredSubcategories = selectedCategoryId
    ? subcategories.filter(
        (sub) =>
          sub.category_name ===
          categories.find((cat) => cat.id === parseInt(selectedCategoryId))?.name
      )
    : [];

  const filteredProducts = selectedCategoryId
    ? products.filter(
        (p) =>
          p.category_id === parseInt(selectedCategoryId) &&
          (!selectedSubcategoryId || p.subcategory_id === parseInt(selectedSubcategoryId))
      )
    : [];

  const handleAddModelToScene = useCallback((product) => {
    if (!product.model_url) return;
    const id = `${product.id}-${Date.now()}`;
    const newItem = {
      id,
      name: product.name,
      modelUrl: product.model_url,
      position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 100 },
      scale: 1,
      rotation: 0,
    };
    setPlacedItems((prev) => [...prev, newItem]);
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-8">
          <RoomCanvas
            roomImage={roomImage}
            placedItems={placedItems}
            onItemRemove={(id) => {
              setPlacedItems((prev) => prev.filter((item) => item.id !== id));
            }}
          />
        </div>
        <div className="col-md-4">
          <h5 className="mb-3">🛋️ Add Furniture to Room</h5>
          <select
            className="form-select mb-2"
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setSelectedSubcategoryId("");
            }}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {filteredSubcategories.length > 0 && (
            <select
              className="form-select mb-3"
              value={selectedSubcategoryId}
              onChange={(e) => setSelectedSubcategoryId(e.target.value)}
            >
              <option value="">-- All Subcategories --</option>
              {filteredSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subcategory_name}
                </option>
              ))}
            </select>
          )}

          <div className="overflow-auto border p-2 rounded" style={{ maxHeight: "500px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4%" }}>
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAddModelToScene(item)}
                  style={{
                    width: "48%",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    padding: "8px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={`http://localhost:5000/images/${item.image}`}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "contain",
                      borderRadius: "4px",
                    }}
                  />
                  <p style={{ fontSize: "14px", marginTop: "8px", fontWeight: "500" }}>
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decorator;
