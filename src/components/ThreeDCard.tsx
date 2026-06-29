import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any; // Allow forwarding of framer-motion props
}

export default function ThreeDCard({ children, className = "", ...props }: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Position of mouse within card bounds (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const springConfig = { damping: 22, stiffness: 220, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

  // Scale and shadow springs for 3D lifting effect
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Get cursor offset relative to card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates to -0.5 and 0.5
    const normalizedX = mouseX / width - 0.5;
    const normalizedY = mouseY / height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseEnter = () => {
    scale.set(1.035);
  };

  const handleMouseLeave = () => {
    scale.set(1);
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      style={{ perspective: 1000 }} 
      className="w-full h-full flex items-center justify-center"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full h-full transition-colors duration-250 select-none ${className}`}
        {...props}
      >
        {/* Shine overlay for high-fidelity light play reflection */}
        <div 
          style={{
            transform: "translateZ(35px)",
            transformStyle: "preserve-3d",
          }}
          className="w-full h-full"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
