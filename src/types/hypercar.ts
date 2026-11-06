import * as THREE from 'three';

export type ViewMode = 'showroom' | 'wind_tunnel' | 'exploded' | 'xray';

export type AssemblyGroupKey = 'outer_shell' | 'chassis' | 'powertrain' | 'suspension';

export interface PaintOption {
  id: string;
  name: string;
  category: 'Metallic' | 'ChromaFlake' | 'MatteFrost';
  color: string;
  flakeColor: string;
  clearcoat: number;
  clearcoatRoughness: number;
  roughness: number;
  metalness: number;
  price: number;
}

export interface CaliperOption {
  id: string;
  name: string;
  color: string;
  emissive: string;
  price: number;
}

export interface WheelOption {
  id: string;
  name: string;
  finish: 'Satin Titanium' | 'Gloss Carbon' | 'Forged Magnesium';
  color: string;
  weightDeltaKg: number;
  price: number;
}

export interface AeroPackageOption {
  id: string;
  name: string;
  description: string;
  downforceKgAt200Mph: number;
  dragCoefficientCd: number;
  weightDeltaKg: number;
  price: number;
}

export interface ComponentSpec {
  id: string;
  name: string;
  assemblyGroup: AssemblyGroupKey;
  worldPosition: [number, number, number]; // [x, y, z] anchor
  cameraTarget: [number, number, number];
  cameraOffset: [number, number, number];
  material: string;
  weightKg: number;
  thermalTolerance: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  description: string;
  blueprintCode: string;
}

export interface ExplodedGroupVector {
  direction: THREE.Vector3;
  distance: number;
  rotationDelta: THREE.Euler;
}

export interface TelemetryState {
  curbWeightKg: number;
  frontDistributionPct: number;
  rearDistributionPct: number;
  zeroToSixtySec: number;
  topSpeedMph: number;
  maxPowerHp: number;
  maxTorqueNm: number;
  totalPriceUsd: number;
  monthlyLeaseUsd: number;
}
