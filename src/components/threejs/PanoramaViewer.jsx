import { useRef, useEffect, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * PanoramaViewer — Renders a 360° equirectangular image inside an inverted sphere.
 * The camera sits at the center; the user looks outward.
 */
const PanoramaViewer = ({ imageUrl, brightness = 1.0, onLoaded }) => {
  const sphereRef = useRef();
  const { gl } = useThree();
  const [texture, setTexture] = useState(null);
  const [loading, setLoading] = useState(false);
  const prevUrl = useRef(null);

  // Load panorama texture
  useEffect(() => {
    if (!imageUrl) return;

    // Skip if same URL
    if (prevUrl.current === imageUrl && texture) return;
    prevUrl.current = imageUrl;

    setLoading(true);
    const loader = new THREE.TextureLoader();

    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.mapping = THREE.EquirectangularReflectionMapping;

        // Dispose previous texture
        if (texture) {
          texture.dispose();
        }

        setTexture(loadedTexture);
        setLoading(false);
        onLoaded?.();
      },
      undefined,
      (error) => {
        console.error("Failed to load panorama:", error);
        setLoading(false);
      },
    );

    // Cleanup on unmount
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl]);

  // Fade animation
  const materialRef = useRef();
  useFrame(() => {
    if (materialRef.current && texture) {
      // Smooth fade in
      if (materialRef.current.opacity < 1) {
        materialRef.current.opacity = Math.min(
          1,
          materialRef.current.opacity + 0.02,
        );
      }
    }
  });

  if (!texture) {
    // Fallback: dark sky sphere when no texture is loaded
    return (
      <mesh>
        <sphereGeometry args={[50, 64, 32]} />
        <meshBasicMaterial color="#0A0E17" side={THREE.BackSide} />
      </mesh>
    );
  }

  return (
    <mesh ref={sphereRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
        transparent
        opacity={0}
      />
    </mesh>
  );
};

export default PanoramaViewer;
