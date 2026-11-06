import React from 'react';
import { Volume2, VolumeX, Cpu, Activity } from 'lucide-react';
import { useHypercarStore } from '../../store/useHypercarStore';

export const Header: React.FC = () => {
  const isMuted = useHypercarStore((s) => s.isMuted);
  const toggleMute = useHypercarStore((s) => s.toggleMute);
  const performanceTier = useHypercarStore((s) => s.performanceTier);
  const viewMode = useHypercarStore((s) => s.viewMode);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 pointer-events-none">
      {/* Brand & Vehicle Designation */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.25)]">
          <svg className="w-6 h-6 text-[#00F0FF]" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 2,22 12,17 22,22" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-extrabold tracking-[0.25em] uppercase text-white font-sans">
              AETHER HYPERION GT
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40">
              SPEC-01
            </span>
          </div>
          <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
            2,050 HP // TRI-MOTOR ALL-ELECTRIC HYPERCAR
          </p>
        </div>
      </div>

      {/* Top Center System Status */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-2 rounded-full bg-[#0A0E17]/60 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2 text-[11px] font-mono text-white/70">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>800V ARCHITECTURE</span>
        </div>
        <div className="w-[1px] h-3 bg-white/20" />
        <div className="flex items-center gap-2 text-[11px] font-mono text-white/70">
          <Activity className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>TORQUE VECTORING: ACTIVE</span>
        </div>
        <div className="w-[1px] h-3 bg-white/20" />
        <div className="flex items-center gap-2 text-[11px] font-mono text-white/70">
          <span className="text-[#00F0FF] font-bold uppercase">{viewMode.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Right Controls: Sound, Performance, Tier */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Performance Tier Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A0D14]/80 border border-white/10 text-white/60 font-mono text-[11px] backdrop-blur-md">
          <Cpu className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span className="uppercase">{performanceTier} TIER // 60 FPS</span>
        </div>

        {/* Web Audio Synthesizer Mute Toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className={`p-2.5 rounded-full border transition-all duration-300 backdrop-blur-md ${
            isMuted
              ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
              : 'bg-[#0A0D14]/80 border-white/20 text-[#00F0FF] hover:border-[#00F0FF] hover:bg-[#00F0FF]/15 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
