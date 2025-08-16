import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../UploadImage.css";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showFurnitureModal, setShowFurnitureModal] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [furnitureInstances, setFurnitureInstances] = useState([]);
  const canvasRef = useRef(null);
  const backgroundImg = useRef(null);

  // Example furniture items (replace with real database/products later)
  const furnitureItems = [
    { name: "Chair", src: "/furniture/chair.JPG" },
    { name: "Sofa", src: "/furniture/sofa.png" },
    { name: "Table", src: "/furniture/table.png" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setPreview(url);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData);
      alert("Image uploaded successfully!");
      setShowFullScreen(true);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    }
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 2;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (backgroundImg.current) {
      const img = backgroundImg.current;
      const scale = Math.min(width / img.width, height / img.height);
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Draw all placed furniture
      furnitureInstances.forEach(({ image, pos }) => {
        ctx.drawImage(image, pos.x, pos.y, 100, 100);
      });
    }
  };

  const handleCanvasClick = (e) => {
    if (!selectedFurniture) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const furnitureImage = new Image();
    furnitureImage.src = selectedFurniture.src;
    furnitureImage.onload = () => {
      const newFurniture = { image: furnitureImage, pos: { x, y } };
      setFurnitureInstances((prev) => [...prev, newFurniture]);
      setSelectedFurniture(null); // Deselect after placing
    };
  };

  useEffect(() => {
    if (showFullScreen && preview) {
      const img = new Image();
      img.src = preview;
      img.onload = () => {
        backgroundImg.current = img;
        renderCanvas();
      };
    }
  }, [showFullScreen, preview]);

  useEffect(() => {
    if (showFullScreen) {
      renderCanvas();
    }
  }, [furnitureInstances]);

  return (
    <div>
      {!showFullScreen ? (
        <div className="container mt-5">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Upload Your Room Image</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {preview && (
                <div className="mb-3 text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
              )}
              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Upload Image
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <button
            className="add-furniture-btn"
            onClick={() => setShowFurnitureModal(true)}
          >
            + Add Furniture
          </button>

          {/* Modal to select furniture */}
          {showFurnitureModal && (
            <div className="furniture-modal">
              <div className="modal-content">
                <h4>Select Furniture</h4>
                <div className="furniture-list">
                  {furnitureItems.map((item, idx) => (
                    <img
                      key={idx}
                      src={item.src}
                      alt={item.name}
                      title={item.name}
                      className="furniture-option"
                      onClick={() => {
                        setSelectedFurniture(item);
                        setShowFurnitureModal(false);
                      }}
                    />
                  ))}
                </div>
                <button
                  className="close-modal-btn"
                  onClick={() => setShowFurnitureModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="fullscreen-canvas"
            onClick={handleCanvasClick}
          />
        </>
      )}
    </div>
  );
};

export default UploadImage;
