import { create } from 'zustand';
import { 
  ViewMode, 
  PaintOption, 
  CaliperOption, 
  WheelOption, 
  AeroPackageOption, 
  ComponentSpec, 
  TelemetryState 
} from '../types/hypercar';
import { soundFX } from '../audio/SoundFX';

export const PAINT_CATALOG: PaintOption[] = [
  {
    id: 'mercury',
    name: 'Liquid Mercury Metallic',
    category: 'ChromaFlake',
    color: '#D8DEE9',
    flakeColor: '#FFFFFF',
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    roughness: 0.12,
    metalness: 0.94,
    price: 0
  },
  {
    id: 'obsidian',
    name: 'Obsidian Void Carbon',
    category: 'Metallic',
    color: '#0E1014',
    flakeColor: '#3A4250',
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    roughness: 0.18,
    metalness: 0.88,
    price: 18000
  },
  {
    id: 'aurora',
    name: 'Apex Aurora Orange',
    category: 'ChromaFlake',
    color: '#FF5400',
    flakeColor: '#FFD166',
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    roughness: 0.14,
    metalness: 0.85,
    price: 32000
  },
  {
    id: 'ultraviolet',
    name: 'Ultraviolet Cyber Ray',
    category: 'ChromaFlake',
    color: '#6B00FF',
    flakeColor: '#00F0FF',
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    roughness: 0.12,
    metalness: 0.92,
    price: 45000
  },
  {
    id: 'cobalt',
    name: 'Monaco Cobalt Hyperion',
    category: 'Metallic',
    color: '#004BFF',
    flakeColor: '#80B3FF',
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    roughness: 0.15,
    metalness: 0.90,
    price: 26000
  },
  {
    id: 'frost_silver',
    name: 'Glacier White Pearl',
    category: 'ChromaFlake',
    color: '#F4F7FB',
    flakeColor: '#90CAF9',
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    roughness: 0.18,
    metalness: 0.82,
    price: 14000
  }
];

export const CALIPER_CATALOG: CaliperOption[] = [
  { id: 'cyan', name: 'Cyber Ion Cyan', color: '#00F0FF', emissive: '#007A82', price: 0 },
  { id: 'crimson', name: 'Brembo Racing Crimson', color: '#FF003C', emissive: '#80001E', price: 4500 },
  { id: 'acid', name: 'Acid Volt Yellow', color: '#D4FF00', emissive: '#688000', price: 4500 },
  { id: 'stealth', name: 'Carbon Anodized Black', color: '#1B1E24', emissive: '#000000', price: 6200 }
];

export const WHEEL_CATALOG: WheelOption[] = [
  { id: 'aero_blade', name: '20"/21" Aero-Blade Monoblock', finish: 'Satin Titanium', color: '#2C3038', weightDeltaKg: 0, price: 0 },
  { id: 'carbon_split', name: '20"/21" Dymag Full Carbon Split', finish: 'Gloss Carbon', color: '#16181C', weightDeltaKg: -14.4, price: 42000 },
  { id: 'forged_mag', name: '20"/21" Centerlock Magnesium GT', finish: 'Forged Magnesium', color: '#9AA0A6', weightDeltaKg: -18.2, price: 34000 }
];

export const AERO_CATALOG: AeroPackageOption[] = [
  { 
    id: 'road_gt', 
    name: 'GT Aerodynamic Package', 
    description: 'Active rear wing with dual DRS channels, optimized for ultra-low drag coefficients and extreme top speed.',
    downforceKgAt200Mph: 480,
    dragCoefficientCd: 0.23,
    weightDeltaKg: 0,
    price: 0 
  },
  { 
    id: 'track_downforce', 
    name: 'Nürburgring Apex Downforce Pack', 
    description: 'Forged carbon dual front dive planes, enlarged ventral diffuser strakes, and high-angle active DRS wing.',
    downforceKgAt200Mph: 860,
    dragCoefficientCd: 0.28,
    weightDeltaKg: 8.5,
    price: 68000 
  }
];

export const COMPONENT_HOTSPOTS: ComponentSpec[] = [
  {
    id: 'outer_shell',
    name: 'Aerodynamic Monocoque Skin & Butterfly Doors',
    assemblyGroup: 'outer_shell',
    worldPosition: [0, 1.45, 0.2],
    cameraTarget: [0, 0.8, 0],
    cameraOffset: [2.5, 1.8, 3.2],
    material: 'T1000G High-Modulus Pre-Preg Carbon Fiber with Titanium Weave',
    weightKg: 114.2,
    thermalTolerance: '-40°C to +180°C',
    primaryMetricLabel: 'Torsional Rigidity',
    primaryMetricValue: '72,000 Nm/deg',
    secondaryMetricLabel: 'Skin Drag (Cd)',
    secondaryMetricValue: '0.23 (Active DRS)',
    description: 'Single-piece molded dry carbon aerodynamic outer envelope engineered with CFD-guided vortex generators, integrated boundary layer suction, and powered synchronized dihedral butterfly doors.',
    blueprintCode: 'AETH-AERO-SKN-001'
  },
  {
    id: 'chassis_tub',
    name: 'Single-Piece Carbon Monocoque & Crash Structures',
    assemblyGroup: 'chassis',
    worldPosition: [0, 0.55, 0.1],
    cameraTarget: [0, 0.5, 0],
    cameraOffset: [-2.2, 1.4, 2.5],
    material: 'Toray T1100 Composite with HexWeb Honeycomb Core & 3D Printed Ti-6Al-4V Nodes',
    weightKg: 168.0,
    thermalTolerance: '-50°C to +240°C',
    primaryMetricLabel: 'Safety Cell Impact',
    primaryMetricValue: 'FIA LMH Tested (120 kN)',
    secondaryMetricLabel: 'Chassis Weight',
    secondaryMetricValue: '88 kg Tub Only',
    description: 'Autoclave-cured monocoque survival cell housing the driver cockpit in a bespoke ergonomic reclined angle (34°), bonded with front and rear sacrificial aluminum-lithium energy absorbers.',
    blueprintCode: 'AETH-TUB-STR-094'
  },
  {
    id: 'powertrain_tri_motor',
    name: 'Tri-Motor Torque-Vectoring Electric Powertrain',
    assemblyGroup: 'powertrain',
    worldPosition: [0, 0.45, -0.9],
    cameraTarget: [0, 0.45, -0.9],
    cameraOffset: [2.0, 1.2, -1.8],
    material: 'Silicon Carbide (SiC) Inverters + Hairpin Stator Liquid-Cooled Motors',
    weightKg: 196.4,
    thermalTolerance: 'Peak 140°C Coolant Limit',
    primaryMetricLabel: 'Peak Output',
    primaryMetricValue: '2,050 HP / 2,400 Nm',
    secondaryMetricLabel: 'Max Motor RPM',
    secondaryMetricValue: '26,500 RPM',
    description: 'One 550 HP front dual-inverter axle motor and two 750 HP rear independent direct-drive permanent magnet motors enabling millisecond individual wheel slip control and true zero-yaw vectoring.',
    blueprintCode: 'AETH-PWR-MTR-303'
  },
  {
    id: 'battery_pack',
    name: '120 kWh Structural Cell-to-Chassis Battery Array',
    assemblyGroup: 'powertrain',
    worldPosition: [0, 0.22, 0.05],
    cameraTarget: [0, 0.25, 0],
    cameraOffset: [-2.6, 1.1, 0.3],
    material: 'Silicon-Anode Solid-State Cells with Dielectric Immersion Fluid',
    weightKg: 440.0,
    thermalTolerance: 'Active Vapor Chamber 22°C - 35°C',
    primaryMetricLabel: 'Volumetric Density',
    primaryMetricValue: '380 Wh/kg Cell Level',
    secondaryMetricLabel: 'Fast Charge (800V)',
    secondaryMetricValue: '10% - 80% in 9 mins',
    description: 'Low-slung structural pack integrating 4,680 individual high-rate discharge cells directly into the floorpan, lowering center of gravity to 345mm above asphalt while acting as an integral shear member.',
    blueprintCode: 'AETH-BAT-120-SS'
  },
  {
    id: 'suspension_brakes',
    name: 'Formula 1 Pushrod Suspension & Carbon-Ceramic Brakes',
    assemblyGroup: 'suspension',
    worldPosition: [-0.92, 0.42, 1.25],
    cameraTarget: [-0.95, 0.42, 1.25],
    cameraOffset: [-1.8, 0.8, 2.2],
    material: 'Titanium Pushrods + Multimatic DSSV Dampers + Brembo C/SiC Discs',
    weightKg: 94.6,
    thermalTolerance: 'Rotor Surface > 1,150°C Fade-Free',
    primaryMetricLabel: 'Braking Distance (100-0)',
    primaryMetricValue: '28.2 meters',
    secondaryMetricLabel: 'Lateral Grip',
    secondaryMetricValue: '1.92 G (Peak Aero)',
    description: 'Inboard four-way adjustable spool-valve dampers with active ride height and heave-spring compensation, clamped by 420mm front and 390mm rear carbon-ceramic discs with 10-piston monobloc calipers.',
    blueprintCode: 'AETH-SUS-BRK-512'
  }
];

interface HypercarState {
  viewMode: ViewMode;
  explodeProgress: number; // 0.0 to 1.0
  activeHotspotId: string | null;
  selectedPaint: PaintOption;
  selectedCaliper: CaliperOption;
  selectedWheel: WheelOption;
  selectedAero: AeroPackageOption;
  isMuted: boolean;
  performanceTier: 'high' | 'medium' | 'low';
  
  // Camera choreo state
  cameraFocalState: {
    target: [number, number, number];
    offset: [number, number, number];
    isFocused: boolean;
    dofFocusDistance: number;
  };

  // Computed Telemetry
  telemetry: TelemetryState;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setExplodeProgress: (progress: number) => void;
  setPaint: (paint: PaintOption) => void;
  setCaliper: (caliper: CaliperOption) => void;
  setWheel: (wheel: WheelOption) => void;
  setAero: (aero: AeroPackageOption) => void;
  selectHotspot: (id: string | null) => void;
  clearFocus: () => void;
  toggleMute: () => void;
  setPerformanceTier: (tier: 'high' | 'medium' | 'low') => void;
}

const BASE_PRICE = 2850000;
const BASE_WEIGHT = 1640; // kg

function calculateTelemetry(
  wheel: WheelOption,
  aero: AeroPackageOption,
  paint: PaintOption,
  caliper: CaliperOption
): TelemetryState {
  const curbWeightKg = BASE_WEIGHT + wheel.weightDeltaKg + aero.weightDeltaKg;
  
  // Dynamic 0-60 calculation factoring weight and drag
  const zeroToSixtySec = Number((1.74 + (curbWeightKg - 1600) * 0.0012 + (aero.dragCoefficientCd - 0.23) * 0.35).toFixed(2));
  
  // Dynamic top speed calculation
  const topSpeedMph = aero.dragCoefficientCd > 0.25 ? 265 : 282;

  // Total price
  const totalPriceUsd = BASE_PRICE + paint.price + caliper.price + wheel.price + aero.price;
  const monthlyLeaseUsd = Math.round((totalPriceUsd * 0.0125));

  // Front/Rear weight balance calculation (48.4% Front / 51.6% Rear nominal)
  const frontDist = Number((48.4 - (wheel.weightDeltaKg * 0.02)).toFixed(1));
  const rearDist = Number((100 - frontDist).toFixed(1));

  return {
    curbWeightKg,
    frontDistributionPct: frontDist,
    rearDistributionPct: rearDist,
    zeroToSixtySec,
    topSpeedMph,
    maxPowerHp: 2050,
    maxTorqueNm: 2400,
    totalPriceUsd,
    monthlyLeaseUsd
  };
}

export const useHypercarStore = create<HypercarState>((set, get) => ({
  viewMode: 'showroom',
  explodeProgress: 0,
  activeHotspotId: null,
  selectedPaint: PAINT_CATALOG[0],
  selectedCaliper: CALIPER_CATALOG[0],
  selectedWheel: WHEEL_CATALOG[0],
  selectedAero: AERO_CATALOG[0],
  isMuted: false,
  performanceTier: 'high',

  cameraFocalState: {
    target: [0, 0.4, 0],
    offset: [3.8, 1.6, 4.2],
    isFocused: false,
    dofFocusDistance: 5.5
  },

  telemetry: calculateTelemetry(
    WHEEL_CATALOG[0],
    AERO_CATALOG[0],
    PAINT_CATALOG[0],
    CALIPER_CATALOG[0]
  ),

  setViewMode: (mode) => {
    const currentMode = get().viewMode;
    if (currentMode === mode) return;

    soundFX.playChirp(mode !== 'showroom');
    soundFX.setWindTunnelActive(mode === 'wind_tunnel');

    set((state) => {
      let explodeProgress = state.explodeProgress;
      if (mode === 'exploded' && explodeProgress < 0.2) {
        explodeProgress = 0.65;
      } else if (mode === 'showroom' && explodeProgress > 0) {
        explodeProgress = 0;
      }

      return {
        viewMode: mode,
        explodeProgress,
        activeHotspotId: mode === 'exploded' ? state.activeHotspotId : null,
        cameraFocalState: mode === 'showroom' ? {
          target: [0, 0.4, 0],
          offset: [3.8, 1.6, 4.2],
          isFocused: false,
          dofFocusDistance: 5.5
        } : state.cameraFocalState
      };
    });
  },

  setExplodeProgress: (progress) => {
    const clamped = Math.max(0, Math.min(1, progress));
    const prev = get().explodeProgress;
    const delta = Math.abs(clamped - prev);

    if (delta > 0.015) {
      soundFX.triggerServoFeedback(delta * 10);
    }

    set((state) => {
      let nextMode = state.viewMode;
      if (clamped > 0.05 && state.viewMode === 'showroom') {
        nextMode = 'exploded';
      } else if (clamped <= 0.02 && state.viewMode === 'exploded') {
        nextMode = 'showroom';
      }

      return {
        explodeProgress: clamped,
        viewMode: nextMode
      };
    });
  },

  setPaint: (paint) => {
    soundFX.playClick(1800);
    set((state) => ({
      selectedPaint: paint,
      telemetry: calculateTelemetry(state.selectedWheel, state.selectedAero, paint, state.selectedCaliper)
    }));
  },

  setCaliper: (caliper) => {
    soundFX.playClick(1600);
    set((state) => ({
      selectedCaliper: caliper,
      telemetry: calculateTelemetry(state.selectedWheel, state.selectedAero, state.selectedPaint, caliper)
    }));
  },

  setWheel: (wheel) => {
    soundFX.playClick(1200);
    set((state) => ({
      selectedWheel: wheel,
      telemetry: calculateTelemetry(wheel, state.selectedAero, state.selectedPaint, state.selectedCaliper)
    }));
  },

  setAero: (aero) => {
    soundFX.playClick(1100);
    set((state) => ({
      selectedAero: aero,
      telemetry: calculateTelemetry(state.selectedWheel, aero, state.selectedPaint, state.selectedCaliper)
    }));
  },

  selectHotspot: (id) => {
    if (!id) {
      get().clearFocus();
      return;
    }

    const component = COMPONENT_HOTSPOTS.find((c) => c.id === id);
    if (!component) return;

    soundFX.playModalChime();

    set({
      activeHotspotId: id,
      viewMode: 'exploded',
      explodeProgress: Math.max(0.55, get().explodeProgress),
      cameraFocalState: {
        target: component.cameraTarget,
        offset: component.cameraOffset,
        isFocused: true,
        dofFocusDistance: 3.2
      }
    });
  },

  clearFocus: () => {
    soundFX.playClick(900);
    set({
      activeHotspotId: null,
      cameraFocalState: {
        target: [0, 0.4, 0],
        offset: [3.8, 1.6, 4.2],
        isFocused: false,
        dofFocusDistance: 5.5
      }
    });
  },

  toggleMute: () => {
    const isMuted = soundFX.toggleMute();
    set({ isMuted });
  },

  setPerformanceTier: (tier) => {
    set({ performanceTier: tier });
  }
}));
