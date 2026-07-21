import { useEffect, useState } from "react";

export default function MouseGlow() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const move = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-0 h-[350px] w-[350px] rounded-full bg-yellow-400/10 blur-[120px] transition-all duration-300"
      style={{
        left: position.x - 175,
        top: position.y - 175,
      }}
    />
  );
}