import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { LightingRig } from './LightingRig';
import { CameraRig } from './CameraRig';
import { ExplodedCarModel } from './ExplodedCarModel';
import { AeroParticleSystem } from './AeroParticleSystem';
import { HotspotMarkers } from './HotspotMarkers';
import { useHypercarStore } from '../../store/useHypercarStore';

interface SceneCanvasProps {
  onLoaded?: () => void;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({ onLoaded }) => {
  const [dpr, setDpr] = useState<number>(1.5);
  const setPerformanceTier = useHypercarStore((s) => s.setPerformanceTier);

  // Hardware capability and device pixel ratio detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const deviceDpr = window.devicePixelRatio || 1;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;

    if (isMobile || cores <= 4) {
      setPerformanceTier('low');
      setDpr(Math.min(deviceDpr, 1.0));
    } else if (cores <= 8) {
      setPerformanceTier('medium');
      setDpr(Math.min(deviceDpr, 1.5));
    } else {
      setPerformanceTier('high');
      setDpr(Math.min(deviceDpr, 2.0));
    }

    if (onLoaded) {
      const timer = setTimeout(onLoaded, 300);
      return () => clearTimeout(timer);
    }
  }, [setPerformanceTier, onLoaded]);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        camera={{
          fov: 38,
          near: 0.1,
          far: 50,
          position: [3.8, 1.6, 4.2]
        }}
        dpr={dpr}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        onCreated={({ gl, scene, camera }) => {
          // ACESFilmic HDR Tone Mapping
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          gl.outputColorSpace = THREE.SRGBColorSpace;

          // Pre-warm shaders into GPU pipeline cache to prevent interaction stutter
          gl.compile(scene, camera);
        }}
        className="w-full h-full"
      >
        <color attach="background" args={['#050608']} />
        <fog attach="fog" args={['#050608', 8, 28]} />

        <Suspense fallback={null}>
          <LightingRig />
          <ExplodedCarModel />
          <AeroParticleSystem />
          <HotspotMarkers />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
};
