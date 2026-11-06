import React from 'react';
import { X, ShieldAlert, Cpu, Flame, Weight, Compass, ExternalLink } from 'lucide-react';
import { useHypercarStore, COMPONENT_HOTSPOTS } from '../../store/useHypercarStore';

export const ComponentTelemetryModal: React.FC = () => {
  const activeHotspotId = useHypercarStore((s) => s.activeHotspotId);
  const clearFocus = useHypercarStore((s) => s.clearFocus);

  if (!activeHotspotId) return null;

  const component = COMPONENT_HOTSPOTS.find((c) => c.id === activeHotspotId);
  if (!component) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-end p-6 md:p-10">
      {/* Dark overlay backdrop on mobile */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs md:hidden pointer-events-auto"
        onClick={clearFocus}
      />

      {/* Glassmorphic Engineering Telemetry Card */}
      <div className="relative pointer-events-auto w-full max-w-md bg-[#090C12]/90 border border-white/15 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,255,0.15)] text-white animate-in fade-in slide-in-from-right-8 duration-300">
        {/* Subtle cyan corner accent lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00F0FF] rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00F0FF] rounded-br-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 uppercase">
                {component.assemblyGroup.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-mono text-white/40">
                {component.blueprintCode}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold font-sans tracking-wide text-white">
              {component.name}
            </h2>
          </div>

          <button
            onClick={clearFocus}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engineering Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Primary Metric */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/50 mb-1">
              <Cpu className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>{component.primaryMetricLabel}</span>
            </div>
            <div className="text-base md:text-lg font-mono font-extrabold text-[#00F0FF]">
              {component.primaryMetricValue}
            </div>
          </div>

          {/* Secondary Metric */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/50 mb-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{component.secondaryMetricLabel}</span>
            </div>
            <div className="text-base md:text-lg font-mono font-extrabold text-white">
              {component.secondaryMetricValue}
            </div>
          </div>

          {/* Component Dry Weight */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/50 mb-1">
              <Weight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dry Mass</span>
            </div>
            <div className="text-sm md:text-base font-mono font-bold text-white/90">
              {component.weightKg} kg
            </div>
          </div>

          {/* Thermal Tolerance */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/50 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Thermal Envelope</span>
            </div>
            <div className="text-xs md:text-sm font-mono font-bold text-white/90 truncate">
              {component.thermalTolerance}
            </div>
          </div>
        </div>

        {/* Material Composition Specification */}
        <div className="mb-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">
            Material Composition
          </div>
          <div className="text-xs font-mono text-white/80 leading-relaxed">
            {component.material}
          </div>
        </div>

        {/* Engineering Description */}
        <div className="mb-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5">
            Architecture Synopsis
          </div>
          <p className="text-xs font-sans text-white/70 leading-relaxed">
            {component.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            TELEMETRY CALIBRATED
          </span>
          <button
            onClick={clearFocus}
            className="px-4 py-2 rounded-lg bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono font-bold uppercase tracking-wider transition-all"
          >
            Reset Orbit
          </button>
        </div>
      </div>
    </div>
  );
};
