import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * HotspotMarker — 3D interactive hotspot positioned inside the panorama sphere.
 * Features a pulsing glow ring that follows the active VR theme color.
 */
const HotspotMarker = ({
  position,
  label,
  type = "equipment",
  color = "#39FF14",
  onClick,
  isHovered,
  onHoverStart,
  onHoverEnd,
}) => {
  const ringRef = useRef();
  const glowRef = useRef();

  // Pulsing animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      const scale = 1 + Math.sin(t * 3) * 0.1;
      ringRef.current.scale.set(scale, scale, scale);
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(t * 2) * 0.15;
    }
  });

  const typeIcons = {
    equipment: "🏋️",
    info: "ℹ️",
    navigation: "🚪",
  };

  return (
    <group position={position}>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Inner core */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHoverStart?.();
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          onHoverEnd?.();
        }}
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 1.5 : 0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Animated ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.45, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label tooltip */}
      <Html position={[0, 1, 0]} center distanceFactor={15}>
        <div
          style={{
            background: "rgba(10, 14, 23, 0.92)",
            backdropFilter: "blur(10px)",
            padding: "8px 14px",
            borderRadius: "10px",
            border: `1px solid ${isHovered ? color : "rgba(148, 163, 184, 0.15)"}`,
            boxShadow: isHovered
              ? `0 0 20px ${color}40`
              : "0 4px 20px rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
            fontSize: "12px",
            color: isHovered ? color : "#E2E8F0",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
        >
          <span style={{ fontSize: "14px" }}>{typeIcons[type]}</span>
          {label}
        </div>
      </Html>
    </group>
  );
};

export default HotspotMarker;
