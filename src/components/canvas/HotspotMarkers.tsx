import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useHypercarStore, COMPONENT_HOTSPOTS } from '../../store/useHypercarStore';

export const HotspotMarkers: React.FC = () => {
  const viewMode = useHypercarStore((s) => s.viewMode);
  const explodeProgress = useHypercarStore((s) => s.explodeProgress);
  const activeHotspotId = useHypercarStore((s) => s.activeHotspotId);
  const selectHotspot = useHypercarStore((s) => s.selectHotspot);

  // Only display hotspot anchors during exploded or inspection view
  if (explodeProgress < 0.25 && viewMode !== 'exploded') {
    return null;
  }

  return (
    <group name="HOTSPOT_ANCHORS">
      {COMPONENT_HOTSPOTS.map((comp, idx) => {
        const isActive = activeHotspotId === comp.id;

        // Dynamic position offset based on explosion expansion
        const basePos = new THREE.Vector3(...comp.worldPosition);
        if (comp.assemblyGroup === 'outer_shell') {
          basePos.y += explodeProgress * 1.0;
        } else if (comp.assemblyGroup === 'powertrain') {
          basePos.y -= explodeProgress * 0.8;
        } else if (comp.assemblyGroup === 'suspension') {
          basePos.x -= explodeProgress * 1.1;
        }

        return (
          <group key={comp.id} position={basePos.toArray()}>
            <Html
              center
              distanceFactor={8}
              zIndexRange={[100, 0]}
              className="pointer-events-auto select-none"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectHotspot(isActive ? null : comp.id);
                }}
                className={`group relative flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                  isActive
                    ? 'bg-[#00F0FF] border-[#00F0FF] text-black shadow-[0_0_24px_rgba(0,240,255,0.8)] scale-110'
                    : 'bg-[#0A0D14]/85 border-white/20 text-white/90 hover:border-[#00F0FF] hover:bg-[#00F0FF]/15 hover:text-white hover:scale-105'
                }`}
              >
                {/* Pulsing indicator ring */}
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isActive ? 'bg-black' : 'bg-[#00F0FF]'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isActive ? 'bg-black' : 'bg-[#00F0FF]'
                    }`}
                  />
                </span>

                {/* Index Code and Component Name */}
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider whitespace-nowrap">
                  <span className={isActive ? 'text-black/70' : 'text-[#00F0FF]'}>
                    0{idx + 1}
                  </span>
                  <span className="uppercase tracking-widest">{comp.name.split(' ')[0]}</span>
                </div>

                {/* Corner reticle bracket on hover */}
                <div className="absolute -inset-1 border border-[#00F0FF]/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
