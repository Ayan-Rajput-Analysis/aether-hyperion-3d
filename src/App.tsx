import React, { useState } from 'react';
import { SceneCanvas } from './components/canvas/SceneCanvas';
import { Header } from './components/ui/Header';
import { ConfiguratorHUD } from './components/ui/ConfiguratorHUD';
import { ComponentTelemetryModal } from './components/ui/ComponentTelemetryModal';
import { useScrollScrub } from './hooks/useScrollScrub';

export const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Bind continuous wheel/scroll gesture to 3D explosion with GSAP
  useScrollScrub();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050608]">
      {/* 1. Main 3D Graphics Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <SceneCanvas onLoaded={() => setIsLoaded(true)} />
      </div>

      {/* 2. Aerospace HUD Overlay Layers */}
      <Header />
      <ComponentTelemetryModal />
      <ConfiguratorHUD />

      {/* 3. Cinematic Overlays */}
      <div className="absolute inset-0 vignette pointer-events-none z-10" />
      <div className="absolute inset-0 scanlines opacity-25 pointer-events-none z-10" />

      {/* 4. Progressive Asset Loader & Shader Pre-Warm Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050608] text-white transition-opacity duration-700">
          <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.3)] animate-pulse">
            <svg className="w-8 h-8 text-[#00F0FF]" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 2,22 12,17 22,22" />
            </svg>
          </div>
          <h2 className="text-sm font-extrabold tracking-[0.3em] uppercase text-white font-mono mb-2">
            AETHER HYPERION GT
          </h2>
          <div className="text-[11px] font-mono text-[#00F0FF] tracking-widest uppercase mb-4 animate-pulse">
            INITIALIZING GRAPHICS PIPELINE & PRE-WARMING SHADERS...
          </div>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#00F0FF] animate-[pulse_1s_infinite] w-full" />
          </div>
        </div>
      )}
    </div>
  );
};
