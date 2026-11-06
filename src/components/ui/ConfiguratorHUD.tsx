import React, { useState } from 'react';
import { 
  Eye, 
  Wind, 
  Layers, 
  Palette, 
  Disc, 
  CircleDot, 
  Gauge, 
  DollarSign, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  useHypercarStore, 
  PAINT_CATALOG, 
  CALIPER_CATALOG, 
  WHEEL_CATALOG, 
  AERO_CATALOG 
} from '../../store/useHypercarStore';
import { ViewMode } from '../../types/hypercar';

export const ConfiguratorHUD: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'paint' | 'caliper' | 'wheels' | 'aero' | 'telemetry'>('paint');
  const [isTrayExpanded, setIsTrayExpanded] = useState(true);

  const viewMode = useHypercarStore((s) => s.viewMode);
  const setViewMode = useHypercarStore((s) => s.setViewMode);
  const explodeProgress = useHypercarStore((s) => s.explodeProgress);
  const setExplodeProgress = useHypercarStore((s) => s.setExplodeProgress);

  const selectedPaint = useHypercarStore((s) => s.selectedPaint);
  const setPaint = useHypercarStore((s) => s.setPaint);
  const selectedCaliper = useHypercarStore((s) => s.selectedCaliper);
  const setCaliper = useHypercarStore((s) => s.setCaliper);
  const selectedWheel = useHypercarStore((s) => s.selectedWheel);
  const setWheel = useHypercarStore((s) => s.setWheel);
  const selectedAero = useHypercarStore((s) => s.selectedAero);
  const setAero = useHypercarStore((s) => s.setAero);

  const telemetry = useHypercarStore((s) => s.telemetry);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none flex flex-col items-center justify-end p-4 md:p-6 select-none">
      {/* 1. TOP FLOATING BAR: VIEW MODES & CONTINUOUS EXPLODE SCRUBBER */}
      <div className="pointer-events-auto flex flex-col md:flex-row items-center gap-3 md:gap-6 bg-[#080B10]/85 border border-white/15 px-5 py-3 rounded-2xl backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] mb-4 w-full max-w-2xl">
        {/* Mode Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 w-full md:w-auto justify-between">
          <button
            onClick={() => setViewMode('showroom')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              viewMode === 'showroom'
                ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.6)] font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>SHOWROOM</span>
          </button>

          <button
            onClick={() => setViewMode('wind_tunnel')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              viewMode === 'wind_tunnel'
                ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.6)] font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>WIND TUNNEL</span>
          </button>

          <button
            onClick={() => setViewMode('exploded')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              viewMode === 'exploded'
                ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.6)] font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>EXPLODE</span>
          </button>
        </div>

        {/* Continuous Scrub Slider */}
        <div className="flex items-center gap-3 w-full flex-1">
          <div className="text-[11px] font-mono text-white/50 tracking-wider whitespace-nowrap">
            DECONSTRUCT:
          </div>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={explodeProgress}
              onChange={(e) => setExplodeProgress(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00F0FF] hover:bg-white/30 transition-colors"
            />
          </div>
          <div className="text-xs font-mono font-bold text-[#00F0FF] w-12 text-right">
            {Math.round(explodeProgress * 100)}%
          </div>
        </div>
      </div>

      {/* 2. BESPOKE CONFIGURATION & TELEMETRY DOCK */}
      <div className="pointer-events-auto w-full max-w-4xl bg-[#090C12]/92 border border-white/15 rounded-2xl backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300">
        {/* Navigation Tab Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setActiveTab('paint'); setIsTrayExpanded(true); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === 'paint'
                  ? 'bg-white/10 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>PAINT FINISH</span>
            </button>

            <button
              onClick={() => { setActiveTab('caliper'); setIsTrayExpanded(true); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === 'caliper'
                  ? 'bg-white/10 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>CALIPERS</span>
            </button>

            <button
              onClick={() => { setActiveTab('wheels'); setIsTrayExpanded(true); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === 'wheels'
                  ? 'bg-white/10 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              <span>WHEELS</span>
            </button>

            <button
              onClick={() => { setActiveTab('aero'); setIsTrayExpanded(true); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === 'aero'
                  ? 'bg-white/10 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>AERO PACK</span>
            </button>

            <button
              onClick={() => { setActiveTab('telemetry'); setIsTrayExpanded(true); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === 'telemetry'
                  ? 'bg-white/10 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>TELEMETRY</span>
            </button>
          </div>

          {/* Tray Collapse Toggle */}
          <button
            onClick={() => setIsTrayExpanded(!isTrayExpanded)}
            className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isTrayExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Tab Content Panes */}
        {isTrayExpanded && (
          <div className="p-4 md:p-5">
            {/* PAINT TAB */}
            {activeTab === 'paint' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {PAINT_CATALOG.map((paint) => {
                  const isSelected = selectedPaint.id === paint.id;
                  return (
                    <button
                      key={paint.id}
                      onClick={() => setPaint(paint)}
                      className={`group flex flex-col p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white/10 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="w-7 h-7 rounded-full border border-white/30 shadow-inner"
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${paint.flakeColor}, ${paint.color})`
                          }}
                        />
                        {paint.price > 0 ? (
                          <span className="text-[10px] font-mono text-white/50">
                            +${(paint.price / 1000).toFixed(0)}k
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-emerald-400">INCL</span>
                        )}
                      </div>
                      <div className="text-xs font-mono font-bold text-white truncate">
                        {paint.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] font-mono text-white/40 truncate">
                        {paint.category}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* CALIPER TAB */}
            {activeTab === 'caliper' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CALIPER_CATALOG.map((caliper) => {
                  const isSelected = selectedCaliper.id === caliper.id;
                  return (
                    <button
                      key={caliper.id}
                      onClick={() => setCaliper(caliper)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'bg-white/10 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-white/30 shadow-md flex-shrink-0"
                        style={{ backgroundColor: caliper.color }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-mono font-bold text-white truncate">
                          {caliper.name}
                        </div>
                        <div className="text-[10px] font-mono text-white/40">
                          {caliper.price > 0 ? `+$${caliper.price.toLocaleString()}` : 'Standard'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* WHEELS TAB */}
            {activeTab === 'wheels' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {WHEEL_CATALOG.map((wheel) => {
                  const isSelected = selectedWheel.id === wheel.id;
                  return (
                    <button
                      key={wheel.id}
                      onClick={() => setWheel(wheel)}
                      className={`flex flex-col p-4 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'bg-white/10 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono font-bold text-white">
                          {wheel.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#00F0FF]">
                          {wheel.weightDeltaKg !== 0 ? `${wheel.weightDeltaKg} kg` : '0 kg'}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-white/50 mb-2">
                        Finish: {wheel.finish}
                      </div>
                      <div className="text-xs font-mono font-semibold text-emerald-400">
                        {wheel.price > 0 ? `+$${wheel.price.toLocaleString()}` : 'Included in Spec'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* AERO DOWNFORCE TAB */}
            {activeTab === 'aero' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AERO_CATALOG.map((aero) => {
                  const isSelected = selectedAero.id === aero.id;
                  return (
                    <button
                      key={aero.id}
                      onClick={() => setAero(aero)}
                      className={`flex flex-col p-4 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'bg-white/10 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold text-white">
                          {aero.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#00F0FF]">
                          {aero.price > 0 ? `+$${aero.price.toLocaleString()}` : 'Included'}
                        </span>
                      </div>
                      <p className="text-[11px] font-sans text-white/60 mb-3 leading-relaxed">
                        {aero.description}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-white/70 border-t border-white/10 pt-2">
                        <span>Downforce: <strong className="text-white">{aero.downforceKgAt200Mph} kg</strong> @ 200mph</span>
                        <span>Drag Cd: <strong className="text-white">{aero.dragCoefficientCd}</strong></span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* LIVE TELEMETRY & PRICING TAB */}
            {activeTab === 'telemetry' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Curb Weight & Balance */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-white/50 mb-1">Curb Mass / Balance</div>
                  <div className="text-base font-mono font-bold text-white mb-1.5">
                    {telemetry.curbWeightKg} kg
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
                    <span>F: {telemetry.frontDistributionPct}%</span>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00F0FF]" 
                        style={{ width: `${telemetry.frontDistributionPct}%` }}
                      />
                    </div>
                    <span>R: {telemetry.rearDistributionPct}%</span>
                  </div>
                </div>

                {/* 0-60 MPH & Top Speed */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-white/50 mb-1">0–60 mph Acceleration</div>
                  <div className="text-base font-mono font-bold text-[#00F0FF]">
                    {telemetry.zeroToSixtySec} seconds
                  </div>
                  <div className="text-[10px] font-mono text-white/60 mt-1">
                    Top Speed: {telemetry.topSpeedMph} MPH
                  </div>
                </div>

                {/* Power & Torque */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-white/50 mb-1">Powertrain Output</div>
                  <div className="text-base font-mono font-bold text-white">
                    {telemetry.maxPowerHp} HP
                  </div>
                  <div className="text-[10px] font-mono text-white/60 mt-1">
                    {telemetry.maxTorqueNm} Nm Instant Torque
                  </div>
                </div>

                {/* Pricing & Lease Terms */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#00F0FF]/30">
                  <div className="text-[10px] font-mono text-white/50 mb-1">Total Configured MSRP</div>
                  <div className="text-base font-mono font-bold text-emerald-400">
                    ${telemetry.totalPriceUsd.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-white/60 mt-1">
                    Est. Lease: ${telemetry.monthlyLeaseUsd.toLocaleString()}/mo
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Persistent Bottom Bar with MSRP Quick View */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-black/60 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-4 text-white/70">
            <span>SPEC: <strong className="text-white">{selectedPaint.name}</strong></span>
            <span className="hidden sm:inline">AERO: <strong className="text-white">{selectedAero.name}</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/60">TOTAL:</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              ${telemetry.totalPriceUsd.toLocaleString()}
            </span>
            <button className="px-3.5 py-1 rounded-lg bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-bold tracking-wider uppercase transition-colors text-[11px]">
              Reserve Allocation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
