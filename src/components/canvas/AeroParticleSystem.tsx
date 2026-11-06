import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useHypercarStore } from '../../store/useHypercarStore';
import { createAeroParticleMaterial } from '../../shaders/aeroFlowShader';

interface AeroParticleSystemProps {
  particleCount?: number;
}

export const AeroParticleSystem: React.FC<AeroParticleSystemProps> = ({
  particleCount = 14000
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const viewMode = useHypercarStore((s) => s.viewMode);
  const performanceTier = useHypercarStore((s) => s.performanceTier);

  // Dynamic particle count based on device hardware tier
  const actualCount = useMemo(() => {
    if (performanceTier === 'low') return Math.floor(particleCount * 0.35);
    if (performanceTier === 'medium') return Math.floor(particleCount * 0.65);
    return particleCount;
  }, [performanceTier, particleCount]);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(actualCount * 3);
    const initialPos = new Float32Array(actualCount * 3);
    const speeds = new Float32Array(actualCount);
    const phases = new Float32Array(actualCount);

    for (let i = 0; i < actualCount; i++) {
      // Stratified tunnel cross-section distribution (-1.6 to 1.6 X, 0.05 to 1.8 Y)
      const x = (Math.random() - 0.5) * 3.2;
      const y = 0.08 + Math.pow(Math.random(), 1.4) * 1.7;
      const z = (Math.random() - 0.5) * 14.0;

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      initialPos[i * 3 + 0] = x;
      initialPos[i * 3 + 1] = y;
      initialPos[i * 3 + 2] = 0; // base stream anchor

      speeds[i] = 0.75 + Math.random() * 0.5;
      phases[i] = Math.random();
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aInitialPos', new THREE.BufferAttribute(initialPos, 3));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const mat = createAeroParticleMaterial();
    return { geometry: geo, material: mat };
  }, [actualCount]);

  // Clean disposal on unmount to eliminate GPU memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    if (!material.uniforms) return;

    // Time progression
    material.uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth activation crossfade for Wind Tunnel mode
    const targetFlow = viewMode === 'wind_tunnel' ? 1.0 : 0.0;
    const currentFlow = material.uniforms.uFlowActive.value;
    material.uniforms.uFlowActive.value = THREE.MathUtils.damp(
      currentFlow,
      targetFlow,
      4.0,
      delta
    );
  });

  return (
    <points 
      ref={pointsRef} 
      geometry={geometry} 
      material={material} 
      frustumCulled={false} 
    />
  );
};
