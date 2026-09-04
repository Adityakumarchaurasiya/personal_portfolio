import { useCallback, useRef, useState } from "react";
import { resolveMediaUrl } from "../services/api";

const PORTRAIT_SRC = "/about-portrait.svg";

function AboutImageFrame({ src, alt = "Aditya Kumar" }) {
  const displaySrc = resolveMediaUrl(src) || PORTRAIT_SRC;
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMove = useCallback((event) => {
    const node = wrapRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  }, []);

  const handleLeave = useCallback(() => {
    setHovering(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const rotateY = tilt.x * 14;
  const rotateX = tilt.y * -14;
  const translateX = tilt.x * 10;
  const translateY = tilt.y * 10;

  return (
    <div
      ref={wrapRef}
      className={`about-image-stage ${hovering ? "is-hovering" : ""}`}
      onMouseEnter={() => setHovering(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className="about-deco about-deco-ring about-deco-ring-1" aria-hidden />
      <span className="about-deco about-deco-ring about-deco-ring-2" aria-hidden />
      <span className="about-deco about-deco-orb about-deco-orb-1" aria-hidden />
      <span className="about-deco about-deco-orb about-deco-orb-2" aria-hidden />
      <span className="about-deco about-deco-orb about-deco-orb-3" aria-hidden />
      <span className="about-deco about-deco-dot-grid" aria-hidden />

      <div
        className="about-image-tilt"
        style={{
          transform: `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0)`,
        }}
      >
        <div className="about-image-frame">
          <img src={displaySrc} alt={alt} loading="lazy" />
        </div>
      </div>
    </div>
  );
}

export default AboutImageFrame;
