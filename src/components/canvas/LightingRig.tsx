import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useHypercarStore } from '../../store/useHypercarStore';

export const LightingRig: React.FC = () => {
  const viewMode = useHypercarStore((s) => s.viewMode);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.SpotLight>(null);
  const underglowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    // Subtle breathing light intensity based on active mode
    if (underglowRef.current) {
      if (viewMode === 'wind_tunnel') {
        underglowRef.current.intensity = 2.5 + Math.sin(state.clock.elapsedTime * 4.0) * 0.5;
        underglowRef.current.color.set('#00F0FF');
      } else if (viewMode === 'exploded') {
        underglowRef.current.intensity = 1.8;
        underglowRef.current.color.set('#FF7A00');
      } else {
        underglowRef.current.intensity = 0.8;
        underglowRef.current.color.set('#3A6073');
      }
    }
  });

  return (
    <>
      {/* Studio Ambient Floor Fill */}
      <ambientLight intensity={0.45} color="#8CA0BA" />

      {/* Primary Key Light (Soft Sun / Studio Overhead Bank) */}
      <directionalLight
        ref={keyLightRef}
        position={[6.0, 10.0, 5.0]}
        intensity={2.2}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.00015}
        shadow-radius={3.5}
      />

      {/* Fill Light (Softer Cool Horizon) */}
      <directionalLight
        position={[-6.0, 4.0, -3.0]}
        intensity={0.8}
        color="#6C829D"
      />

      {/* Aerodynamic Rim / Silhouette Light */}
      <spotLight
        ref={rimLightRef}
        position={[0, 5.0, -8.0]}
        intensity={3.4}
        angle={0.7}
        penumbra={0.8}
        color="#00E5FF"
      />

      {/* Underbody Venturi Chassis Glow */}
      <pointLight
        ref={underglowRef}
        position={[0, 0.08, 0]}
        distance={4.5}
        decay={2}
      />

      {/* Dark Reflective Studio Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#06080B"
          roughness={0.25}
          metalness={0.75}
        />
      </mesh>

      {/* High-Tech Runway Grid Projection */}
      <gridHelper
        args={[40, 40, '#00F0FF', '#141E28']}
        position={[0, 0.001, 0]}
      />
    </>
  );
};
