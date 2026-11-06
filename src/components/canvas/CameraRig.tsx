import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useHypercarStore } from '../../store/useHypercarStore';

export const CameraRig: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraFocalState = useHypercarStore((s) => s.cameraFocalState);
  const viewMode = useHypercarStore((s) => s.viewMode);
  const { camera } = useThree();

  // Target vectors for smooth damping interpolation
  const currentLookAt = useRef(new THREE.Vector3(0, 0.4, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.4, 0));
  const targetCamPos = useRef(new THREE.Vector3(3.8, 1.6, 4.2));

  // Sync state changes with choreography targets
  useEffect(() => {
    if (cameraFocalState.isFocused) {
      targetLookAt.current.set(...cameraFocalState.target);
      targetCamPos.current.set(
        cameraFocalState.target[0] + cameraFocalState.offset[0],
        cameraFocalState.target[1] + cameraFocalState.offset[1],
        cameraFocalState.target[2] + cameraFocalState.offset[2]
      );
    } else {
      if (viewMode === 'wind_tunnel') {
        targetLookAt.current.set(0, 0.5, 0);
        targetCamPos.current.set(4.6, 1.2, 1.5); // Side-profile aerodynamic angle
      } else if (viewMode === 'exploded') {
        targetLookAt.current.set(0, 0.6, 0);
        targetCamPos.current.set(4.2, 2.4, 3.8); // Elevated exploded view perspective
      } else {
        targetLookAt.current.set(0, 0.4, 0);
        targetCamPos.current.set(3.8, 1.5, 4.2); // Classic 3/4 beauty angle
      }
    }
  }, [cameraFocalState, viewMode]);

  useFrame((_, delta) => {
    // Smooth programmatic camera glide (exponential damping)
    if (controlsRef.current) {
      const controls = controlsRef.current;

      // Smooth target interpolation
      currentLookAt.current.lerp(targetLookAt.current, THREE.MathUtils.clamp(delta * 3.5, 0, 1));
      controls.target.copy(currentLookAt.current);

      // Smooth position glide when focused or auto-choreographing
      if (cameraFocalState.isFocused) {
        camera.position.lerp(targetCamPos.current, THREE.MathUtils.clamp(delta * 3.5, 0, 1));
      }

      controls.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.04} // Prevent clipping below ground plane
      minDistance={1.8}
      maxDistance={9.5}
      rotateSpeed={0.7}
      panSpeed={0.5}
      zoomSpeed={0.85}
      autoRotate={viewMode === 'showroom' && !cameraFocalState.isFocused}
      autoRotateSpeed={0.4}
    />
  );
};
