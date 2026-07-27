import React, { useEffect, useRef } from "react";

export default function MouseGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    let animationFrameId = null;

    const handleMouseMove = (e) => {
      if (glowRef.current) {
        // Use requestAnimationFrame for smooth, GPU-accelerated cursor tracking without re-renders
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        animationFrameId = requestAnimationFrame(() => {
          glowRef.current.style.transform = `translate3d(${e.clientX - 175}px, ${e.clientY - 175}px, 0)`;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 z-0 h-[350px] w-[350px] rounded-full bg-yellow-400/10 blur-[120px] will-change-transform"
    />
  );
}