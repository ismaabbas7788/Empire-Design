import React, { useRef, useEffect, useState } from "react";
import "@google/model-viewer";

const DraggableModel = ({ item, onDelete }) => {
  const [position, setPosition] = useState(item.position || { x: 100, y: 100 });
  const [scale, setScale] = useState(item.scale || 1);
  const [rotation, setRotation] = useState(item.rotation || 0);
  const [showHandle, setShowHandle] = useState(false);

  const ref = useRef(null);
  const dragging = useRef(false);
  const rotating = useRef(false);
  const resizing = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const hideTimer = useRef(null);

  const resetHideTimer = () => {
    clearTimeout(hideTimer.current);
    setShowHandle(true);
    hideTimer.current = setTimeout(() => {
      if (!dragging.current && !rotating.current && !resizing.current) {
        setShowHandle(false);
      }
    }, 800);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      dragging.current = false;
      rotating.current = false;
      if (resizing.current) {
        resizing.current = false;
      }
      resetHideTimer();
    };

    const handleMouseMove = (e) => {
      if (dragging.current) {
        e.preventDefault();
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        lastMouse.current = { x: e.clientX, y: e.clientY };
        setPosition((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy
        }));
        resetHideTimer();
      } else if (rotating.current) {
        e.preventDefault();
        const dx = e.clientX - lastMouse.current.x;
        lastMouse.current = { x: e.clientX, y: e.clientY };
        // only rotate if horizontal movement exceeds 3px to avoid jitter
        if (Math.abs(dx) > 3) {
          setRotation((prev) => prev + dx * 0.1); // gentler rotation
        }
        resetHideTimer();
      } else if (resizing.current) {
        e.preventDefault();
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        lastMouse.current = { x: e.clientX, y: e.clientY };
        const delta = (dx + dy) * 0.003;
        setScale((prev) => Math.max(0.2, Math.min(3, prev + delta)));
        resetHideTimer();
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(hideTimer.current);
    };
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    // if clicking the resize handle (it will have data-handle)
    if (e.target.dataset.handle === "br") {
      resizing.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      setShowHandle(true);
      return;
    }

    lastMouse.current = { x: e.clientX, y: e.clientY };
    if (e.button === 2) {
      rotating.current = true;
    } else {
      dragging.current = true;
    }
    setShowHandle(true);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    let delta = e.deltaY * -0.0015;
    setScale((prev) => Math.max(0.2, Math.min(3, prev + delta)));
    setShowHandle(true);
    resetHideTimer();
  };

  const handleMouseEnter = () => {
    setShowHandle(true);
    resetHideTimer();
  };
  const handleMouseLeave = () => {
    if (!dragging.current && !rotating.current && !resizing.current) {
      hideTimer.current = setTimeout(() => setShowHandle(false), 500);
    }
  };

  // single bottom-right handle style
  const handleStyle = {
    position: "absolute",
    width: "12px",
    height: "12px",
    background: "#fff",
    border: "2px solid #007bff",
    boxSizing: "border-box",
    borderRadius: "2px",
    pointerEvents: "all",
    zIndex: 1100,
    transform: "translate(50%, 50%)",
    cursor: "nwse-resize"
  };

  const deleteBtnStyle = {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "rgba(220, 53, 69, 0.9)", // red-ish
    color: "#fff",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    cursor: "pointer",
    zIndex: 1200,
    padding: 0,
    lineHeight: 1
  };

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: `${300 * scale}px`,
        height: `${300 * scale}px`,
        transform: `rotateY(${rotation}deg)`,
        zIndex: 1000,
        cursor: dragging.current ? "grabbing" : "grab",
        userSelect: "none"
      }}
    >
      {showHandle && (
        <>
          <div data-handle="br" style={{ ...handleStyle, bottom: 0, right: 0 }} />
          {onDelete && (
            <button
              aria-label="Remove item"
              style={deleteBtnStyle}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
            >
              ×
            </button>
          )}
        </>
      )}
      <model-viewer
        src={item.modelUrl}
        alt={item.name}
        camera-controls
        disable-zoom
        disable-pan
        disable-tap
        interaction-prompt="none"
        style={{
          width: "100%",
          height: "100%",
          background: "transparent"
        }}
      />
    </div>
  );
};

const RoomCanvas = ({ roomImage, placedItems, onItemRemove }) => {
  return (
    <div
      className="position-relative"
      style={{
        width: "100%",
        height: "600px",
        overflow: "hidden",
        borderRadius: "12px",
        backgroundColor: "#f0f0f0"
      }}
    >
      {roomImage ? (
        <img
          src={roomImage}
          alt="Room"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
          draggable={false}
        />
      ) : (
        <div className="text-center pt-5">Upload a room image first</div>
      )}

      {placedItems.map((item) => (
        <DraggableModel key={item.id} item={item} onDelete={onItemRemove} />
      ))}
    </div>
  );
};

export default RoomCanvas;
