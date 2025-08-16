import React, { useState, useRef, useEffect } from "react";
import "@google/model-viewer";
import { FaEye } from "react-icons/fa";

const ViewInRoomModal = ({ productModelUrl, uploadedImage, onClose }) => {
  // Position in pixels relative to container (X, Y)
  const [pos, setPos] = useState({ x: 100, y: 50 });
  // Scale (for zooming forward/back)
  const [scale, setScale] = useState(1);
  // Rotation angle in degrees (around Y axis)
  const [rotation, setRotation] = useState(0);

  const dragRef = useRef(null);
  const dragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Right mouse drag for rotation
  const rotating = useRef(false);

  // Wheel zoom handler
  const onWheel = (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.0015;
    setScale((s) => {
      let newScale = s - e.deltaY * zoomSensitivity;
      return Math.min(Math.max(newScale, 0.3), 3); // Clamp scale between 0.3 and 3
    });
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    if (e.button === 2) {
      // Right click drag = rotate
      rotating.current = true;
    } else {
      dragging.current = true;
    }
  };
  const onMouseMove = (e) => {
    if (!dragging.current && !rotating.current) return;
    e.preventDefault();
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    if (dragging.current) {
      // Move X and Y
      setPos((p) => {
        let newX = p.x + dx;
        let newY = p.y + dy;
        // Optional: clamp within container bounds here
        return { x: newX, y: newY };
      });
    } else if (rotating.current) {
      // Rotate around Y axis (horizontal mouse move)
      setRotation((r) => r + dx * 0.5);
    }
  };

  const onMouseUp = (e) => {
    dragging.current = false;
    rotating.current = false;
  };

  // Disable context menu on right-click for the drag area
  const onContextMenu = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Inline styles for model overlay
  const modelStyle = {
    position: "absolute",
    left: pos.x,
    top: pos.y,
    width: 300 * scale,
    height: 300 * scale,
    cursor: dragging.current ? "grabbing" : "grab",
    userSelect: "none",
    transform: `rotateY(${rotation}deg)`,
    transformStyle: "preserve-3d",
    transition: "transform 0.1s linear",
    zIndex: 1000,
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 9999,
      }}
      onWheel={onWheel}
      onContextMenu={onContextMenu}
    >
      <div
        className="modal-dialog modal-lg"
        role="document"
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          className="btn-close position-absolute"
          style={{ top: 10, right: 10, zIndex: 1100 }}
          aria-label="Close"
          onClick={onClose}
        />

        <h5 style={{ marginBottom: 10 }}>View Your Room with Model</h5>

        {uploadedImage ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "600px",
              backgroundColor: "#eee",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Uploaded Room Image */}
            <img
              src={uploadedImage}
              alt="Room"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              draggable={false}
            />

            {/* Model Overlay with drag, zoom, rotate */}
            <div
              ref={dragRef}
              style={modelStyle}
              onMouseDown={onMouseDown}
              draggable={false}
              title="Drag with left mouse, rotate with right mouse, zoom with mouse wheel"
            >
              <model-viewer
                src={productModelUrl}
                alt="3D Model"
                camera-controls
                auto-rotate
                style={{ width: "100%", height: "100%", borderRadius: "12px" }}
              />
            </div>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const url = URL.createObjectURL(e.target.files[0]);
                  window.dispatchEvent(new CustomEvent("uploadedImageChange", { detail: url }));
                }
              }}
            />
            <p className="text-muted mt-2">Upload an image of your room</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewInRoomModal;
