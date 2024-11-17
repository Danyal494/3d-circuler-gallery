import { useEffect, useState } from "react";

export default function useDragging() {
  const [isDragging, setIsDragging] = useState(false);
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const handleMouseDown = () => {
      setIsDragging(true);
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        setEventData(event); // Store event data for use
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setEventData(null); // Reset event data
    };

    // Touch event handlers
    const handleTouchStart = () => {
      setIsDragging(true);
    };

    const handleTouchMove = (event) => {
      if (isDragging) {
        setEventData(event.touches[0]); // For touch, store touch event data
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setEventData(null);
    };

    // Add mouse and touch event listeners
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return { isDragging, eventData };
}