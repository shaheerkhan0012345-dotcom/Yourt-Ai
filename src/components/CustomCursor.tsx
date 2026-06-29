import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Position of the mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for lag effect
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Faster spring for the inner dot
  const dotSpringConfig = { damping: 25, stiffness: 600, mass: 0.1 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  useEffect(() => {
    // Check if the device supports touch and doesn't use a pointer
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!visible) {
        setVisible(true);
      }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = 
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList.contains("cursor-pointer") ||
          window.getComputedStyle(target).cursor === "pointer";
        
        setIsHovered(!!isInteractive);
      }
    };

    const handleMouseLeaveWindow = () => {
      setVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicked(true);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Add CSS global cursor-none style to body so default cursor is hidden cleanly
    const style = document.createElement("style");
    style.id = "custom-cursor-hide-default";
    style.innerHTML = `
      @media (pointer: fine) {
        body, a, button, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      
      const addedStyle = document.getElementById("custom-cursor-hide-default");
      if (addedStyle) {
        addedStyle.remove();
      }
    };
  }, [mouseX, mouseY, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Outer Glowing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#ff6b00]/70 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 0.8 : isHovered ? 1.6 : 1,
          backgroundColor: isHovered ? "rgba(255, 107, 0, 0.15)" : "rgba(255, 107, 0, 0)",
          borderColor: isHovered ? "rgba(255, 107, 0, 1)" : "rgba(255, 107, 0, 0.6)",
          boxShadow: isHovered 
            ? "0 0 16px rgba(255, 107, 0, 0.6), inset 0 0 8px rgba(255, 107, 0, 0.3)" 
            : "0 0 0px rgba(255, 107, 0, 0)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      />

      {/* Inner Pinpoint Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#ff6b00] rounded-full pointer-events-none z-[9999] shadow-[0_0_8px_#ff6b00]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 1.4 : isHovered ? 0.5 : 1,
        }}
      />
    </>
  );
}
