import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function TiltedCard({
  children,
  className = "",
  rotateAmplitude = 12,
  scaleOnHover = 1.04,
}) {
  const ref = useRef(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springRotateX = useSpring(rotateX, {
    stiffness: 200,
    damping: 20,
  });

  const springRotateY = useSpring(rotateY, {
    stiffness: 200,
    damping: 20,
  });

  const springScale = useSpring(scale, {
    stiffness: 250,
    damping: 20,
  });

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateYValue =
      ((x - centerX) / centerX) * rotateAmplitude;

    const rotateXValue =
      -((y - centerY) / centerY) * rotateAmplitude;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      ref={ref}
      className={`[perspective:1000px] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="h-full w-full [transform-style:preserve-3d]"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          scale: springScale,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}