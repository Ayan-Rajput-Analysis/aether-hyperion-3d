import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useHypercarStore } from '../../store/useHypercarStore';
import { createCarPaintMaterial } from '../../shaders/carPaintShader';

// Precision parametric geometric representations of the Aether Hyperion GT assemblies
export const ExplodedCarModel: React.FC = () => {
  const explodeProgress = useHypercarStore((s) => s.explodeProgress);
  const viewMode = useHypercarStore((s) => s.viewMode);
  const selectedPaint = useHypercarStore((s) => s.selectedPaint);
  const selectedCaliper = useHypercarStore((s) => s.selectedCaliper);
  const selectedWheel = useHypercarStore((s) => s.selectedWheel);
  const selectHotspot = useHypercarStore((s) => s.selectHotspot);

  // Group references for programmatic transform interpolation
  const groupHood = useRef<THREE.Group>(null);
  const groupCanopy = useRef<THREE.Group>(null);
  const groupDoorLeft = useRef<THREE.Group>(null);
  const groupDoorRight = useRef<THREE.Group>(null);
  const groupAeroWing = useRef<THREE.Group>(null);
  const groupFrontSplitter = useRef<THREE.Group>(null);
  const groupRearDiffuser = useRef<THREE.Group>(null);
  const groupChassisTub = useRef<THREE.Group>(null);
  const groupFrontCrash = useRef<THREE.Group>(null);
  const groupRearSubframe = useRef<THREE.Group>(null);
  const groupBatteryPack = useRef<THREE.Group>(null);
  const groupFrontMotor = useRef<THREE.Group>(null);
  const groupRearMotor = useRef<THREE.Group>(null);
  const groupWheelFL = useRef<THREE.Group>(null);
  const groupWheelFR = useRef<THREE.Group>(null);
  const groupWheelRL = useRef<THREE.Group>(null);
  const groupWheelRR = useRef<THREE.Group>(null);
  const groupSuspensionFL = useRef<THREE.Group>(null);
  const groupSuspensionFR = useRef<THREE.Group>(null);
  const groupSuspensionRL = useRef<THREE.Group>(null);
  const groupSuspensionRR = useRef<THREE.Group>(null);

  // Custom Paint Materials with zero re-instantiation overhead
  const bodyPaintMaterial = useMemo(() => {
    return createCarPaintMaterial({
      color: selectedPaint.color,
      flakeColor: selectedPaint.flakeColor,
      clearcoat: selectedPaint.clearcoat,
      roughness: selectedPaint.roughness,
      metalness: selectedPaint.metalness,
      isCarbon: false
    });
  }, []);

  const carbonFiberMaterial = useMemo(() => {
    return createCarPaintMaterial({
      isCarbon: true
    });
  }, []);

  // Caliper Dynamic Material
  const caliperMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedCaliper.color),
      emissive: new THREE.Color(selectedCaliper.emissive),
      emissiveIntensity: 0.35,
      metalness: 0.9,
      roughness: 0.2
    });
  }, []);

  // Update paint uniforms directly without reconstructing shaders or geometries
  useEffect(() => {
    if (bodyPaintMaterial.uniforms) {
      bodyPaintMaterial.uniforms.uBaseColor.value.set(selectedPaint.color);
      bodyPaintMaterial.uniforms.uFlakeColor.value.set(selectedPaint.flakeColor);
      bodyPaintMaterial.uniforms.uRoughness.value = selectedPaint.roughness;
      bodyPaintMaterial.uniforms.uMetalness.value = selectedPaint.metalness;
      bodyPaintMaterial.uniforms.uClearcoat.value = selectedPaint.clearcoat;
    }
  }, [selectedPaint, bodyPaintMaterial]);

  useEffect(() => {
    caliperMaterial.color.set(selectedCaliper.color);
    caliperMaterial.emissive.set(selectedCaliper.emissive);
  }, [selectedCaliper, caliperMaterial]);

  // Standard shared PBR materials for interior, powertrain, tires, and mechanicals
  const tireMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#121316',
    roughness: 0.85,
    metalness: 0.1
  }), []);

  const rimMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: selectedWheel.color,
    roughness: selectedWheel.finish === 'Gloss Carbon' ? 0.1 : 0.35,
    metalness: selectedWheel.finish === 'Gloss Carbon' ? 0.3 : 0.95
  }), [selectedWheel]);

  const discMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#282C34',
    roughness: 0.45,
    metalness: 0.6
  }), []);

  const motorGoldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C68B39',
    roughness: 0.25,
    metalness: 0.85
  }), []);

  const batteryCellMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00F0FF',
    emissive: '#005577',
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#050a10',
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.92,
    transparent: true,
    opacity: 0.45,
    ior: 1.52
  }), []);

  // Interpolate explosion transforms in the render loop at 60+ FPS
  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(explodeProgress, 0, 1);
    const ease = t * t * (3.0 - 2.0 * t); // Smooth cubic hermite ease

    // Update shader time for flake shimmer glints
    if (bodyPaintMaterial.uniforms) {
      bodyPaintMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Outer Shell & Aero Panels (Radiating Upward, Forward & Outward)
    if (groupHood.current) {
      groupHood.current.position.set(0, THREE.MathUtils.lerp(0.55, 1.85, ease), THREE.MathUtils.lerp(1.2, 2.65, ease));
      groupHood.current.rotation.x = THREE.MathUtils.lerp(0, 0.15, ease);
    }
    if (groupCanopy.current) {
      groupCanopy.current.position.set(0, THREE.MathUtils.lerp(0.9, 2.5, ease), THREE.MathUtils.lerp(-0.1, 0.1, ease));
    }
    if (groupDoorLeft.current) {
      groupDoorLeft.current.position.set(
        THREE.MathUtils.lerp(-0.85, -2.15, ease),
        THREE.MathUtils.lerp(0.65, 1.75, ease),
        THREE.MathUtils.lerp(0.1, 0.4, ease)
      );
      groupDoorLeft.current.rotation.z = THREE.MathUtils.lerp(0, 0.52, ease);
      groupDoorLeft.current.rotation.y = THREE.MathUtils.lerp(0, 0.2, ease);
    }
    if (groupDoorRight.current) {
      groupDoorRight.current.position.set(
        THREE.MathUtils.lerp(0.85, 2.15, ease),
        THREE.MathUtils.lerp(0.65, 1.75, ease),
        THREE.MathUtils.lerp(0.1, 0.4, ease)
      );
      groupDoorRight.current.rotation.z = THREE.MathUtils.lerp(0, -0.52, ease);
      groupDoorRight.current.rotation.y = THREE.MathUtils.lerp(0, -0.2, ease);
    }
    if (groupAeroWing.current) {
      groupAeroWing.current.position.set(0, THREE.MathUtils.lerp(0.85, 2.1, ease), THREE.MathUtils.lerp(-2.1, -3.2, ease));
      groupAeroWing.current.rotation.x = THREE.MathUtils.lerp(0, -0.18, ease);
    }
    if (groupFrontSplitter.current) {
      groupFrontSplitter.current.position.set(0, THREE.MathUtils.lerp(0.15, -0.2, ease), THREE.MathUtils.lerp(2.2, 3.25, ease));
    }
    if (groupRearDiffuser.current) {
      groupRearDiffuser.current.position.set(0, THREE.MathUtils.lerp(0.2, -0.25, ease), THREE.MathUtils.lerp(-2.1, -3.3, ease));
    }

    // Chassis & Monocoque
    if (groupChassisTub.current) {
      groupChassisTub.current.position.set(0, THREE.MathUtils.lerp(0.4, 0.65, ease), 0);
    }
    if (groupFrontCrash.current) {
      groupFrontCrash.current.position.set(0, THREE.MathUtils.lerp(0.42, 0.7, ease), THREE.MathUtils.lerp(1.7, 2.7, ease));
    }
    if (groupRearSubframe.current) {
      groupRearSubframe.current.position.set(0, THREE.MathUtils.lerp(0.45, 0.75, ease), THREE.MathUtils.lerp(-1.6, -2.65, ease));
    }

    // Powertrain & Battery (Sub-surface Drop & Motor Separation)
    if (groupBatteryPack.current) {
      groupBatteryPack.current.position.set(0, THREE.MathUtils.lerp(0.18, -1.25, ease), 0);
    }
    if (groupFrontMotor.current) {
      groupFrontMotor.current.position.set(0, THREE.MathUtils.lerp(0.38, -0.45, ease), THREE.MathUtils.lerp(1.3, 2.2, ease));
    }
    if (groupRearMotor.current) {
      groupRearMotor.current.position.set(0, THREE.MathUtils.lerp(0.42, 0.35, ease), THREE.MathUtils.lerp(-1.25, -2.35, ease));
    }

    // Suspension & Forged Wheels (Expanding Horizontally Outward)
    const wheelSpread = THREE.MathUtils.lerp(1.0, 2.25, ease);
    if (groupWheelFL.current) groupWheelFL.current.position.x = -wheelSpread;
    if (groupWheelFR.current) groupWheelFR.current.position.x = wheelSpread;
    if (groupWheelRL.current) groupWheelRL.current.position.x = -(wheelSpread + 0.05);
    if (groupWheelRR.current) groupWheelRR.current.position.x = (wheelSpread + 0.05);

    const suspSpread = THREE.MathUtils.lerp(0.72, 1.45, ease);
    if (groupSuspensionFL.current) groupSuspensionFL.current.position.x = -suspSpread;
    if (groupSuspensionFR.current) groupSuspensionFR.current.position.x = suspSpread;
    if (groupSuspensionRL.current) groupSuspensionRL.current.position.x = -suspSpread;
    if (groupSuspensionRR.current) groupSuspensionRR.current.position.x = suspSpread;

    // Slow cinematic rotation when in Showroom mode
    if (viewMode === 'showroom' && groupChassisTub.current) {
      // Gentle floating physics
      const hover = Math.sin(state.clock.elapsedTime * 1.5) * 0.008;
      groupChassisTub.current.position.y += hover;
    }
  });

  // Reusable Wheel Component
  const renderWheelAssembly = (isFront: boolean, isLeft: boolean) => (
    <group>
      {/* Carbon / Forged Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={rimMaterial}>
        <cylinderGeometry args={[0.38, 0.38, 0.32, 32]} />
      </mesh>
      {/* Performance Low-Profile Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={tireMaterial}>
        <torusGeometry args={[0.38, 0.12, 16, 32]} />
      </mesh>
      {/* 420mm Carbon-Ceramic Drilled Disc */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={discMaterial}>
        <cylinderGeometry args={[0.32, 0.32, 0.03, 32]} />
      </mesh>
      {/* Brembo 10-Piston Monobloc Caliper */}
      <mesh 
        position={[0, 0.22, 0]} 
        rotation={[0, 0, isLeft ? 0.3 : -0.3]} 
        material={caliperMaterial} 
        castShadow
      >
        <boxGeometry args={[0.12, 0.2, 0.14]} />
      </mesh>
      {/* Aero Blades / Wheel Center Cap */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={carbonFiberMaterial}>
        <cylinderGeometry args={[0.1, 0.1, 0.34, 16]} />
      </mesh>
    </group>
  );

  return (
    <group name="AETHER_HYPERION_GT_SCENE_ROOT">
      {/* ========================================================================= */}
      {/* 1. OUTER SHELL & AERODYNAMIC PANELS                                       */}
      {/* ========================================================================= */}
      <group 
        name="outer_shell_group"
        onClick={(e) => { e.stopPropagation(); selectHotspot('outer_shell'); }}
      >
        {/* Sculpted Aerodynamic Hood */}
        <group ref={groupHood} position={[0, 0.55, 1.2]}>
          <mesh castShadow receiveShadow material={bodyPaintMaterial}>
            <boxGeometry args={[1.58, 0.12, 1.5]} />
          </mesh>
          {/* Central Hood NACA Vent */}
          <mesh position={[0, 0.07, 0.1]} material={carbonFiberMaterial}>
            <boxGeometry args={[0.45, 0.04, 0.7]} />
          </mesh>
        </group>

        {/* Cockpit Canopy & Glasshouse */}
        <group ref={groupCanopy} position={[0, 0.9, -0.1]}>
          {/* Glass Canopy */}
          <mesh castShadow material={glassMaterial}>
            <sphereGeometry args={[0.82, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
          </mesh>
          {/* Carbon Roof Spine */}
          <mesh position={[0, 0.4, -0.05]} material={carbonFiberMaterial} castShadow>
            <boxGeometry args={[0.22, 0.06, 1.4]} />
          </mesh>
        </group>

        {/* Left Dihedral Butterfly Door */}
        <group ref={groupDoorLeft} position={[-0.85, 0.65, 0.1]}>
          <mesh castShadow receiveShadow material={bodyPaintMaterial}>
            <boxGeometry args={[0.18, 0.68, 1.35]} />
          </mesh>
          {/* Aero Venturi Cutout */}
          <mesh position={[-0.08, -0.1, 0.1]} material={carbonFiberMaterial}>
            <boxGeometry args={[0.04, 0.3, 0.9]} />
          </mesh>
        </group>

        {/* Right Dihedral Butterfly Door */}
        <group ref={groupDoorRight} position={[0.85, 0.65, 0.1]}>
          <mesh castShadow receiveShadow material={bodyPaintMaterial}>
            <boxGeometry args={[0.18, 0.68, 1.35]} />
          </mesh>
          <mesh position={[0.08, -0.1, 0.1]} material={carbonFiberMaterial}>
            <boxGeometry args={[0.04, 0.3, 0.9]} />
          </mesh>
        </group>

        {/* Active Aero Rear DRS Wing */}
        <group ref={groupAeroWing} position={[0, 0.85, -2.1]}>
          <mesh castShadow material={carbonFiberMaterial}>
            <boxGeometry args={[1.85, 0.05, 0.42]} />
          </mesh>
          {/* Hydraulic Stanchions */}
          <mesh position={[-0.45, -0.22, 0]} material={discMaterial}>
            <cylinderGeometry args={[0.02, 0.02, 0.45, 12]} />
          </mesh>
          <mesh position={[0.45, -0.22, 0]} material={discMaterial}>
            <cylinderGeometry args={[0.02, 0.02, 0.45, 12]} />
          </mesh>
          {/* Endplates */}
          <mesh position={[-0.92, 0.04, 0]} material={carbonFiberMaterial}>
            <boxGeometry args={[0.03, 0.22, 0.48]} />
          </mesh>
          <mesh position={[0.92, 0.04, 0]} material={carbonFiberMaterial}>
            <boxGeometry args={[0.03, 0.22, 0.48]} />
          </mesh>
        </group>

        {/* Front Ground-Effect Splitter & Dive Planes */}
        <group ref={groupFrontSplitter} position={[0, 0.15, 2.2]}>
          <mesh castShadow material={carbonFiberMaterial}>
            <boxGeometry args={[1.95, 0.05, 0.55]} />
          </mesh>
        </group>

        {/* Venturi Ventral Rear Diffuser with Strakes */}
        <group ref={groupRearDiffuser} position={[0, 0.2, -2.1]}>
          <mesh castShadow material={carbonFiberMaterial}>
            <boxGeometry args={[1.8, 0.08, 0.8]} />
          </mesh>
          {[-0.6, -0.2, 0.2, 0.6].map((x, idx) => (
            <mesh key={idx} position={[x, 0.06, 0]} material={carbonFiberMaterial}>
              <boxGeometry args={[0.02, 0.16, 0.78]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 2. CHASSIS & MONOCOQUE TUB                                                */}
      {/* ========================================================================= */}
      <group 
        name="chassis_tub_group"
        onClick={(e) => { e.stopPropagation(); selectHotspot('chassis_tub'); }}
      >
        <group ref={groupChassisTub} position={[0, 0.4, 0]}>
          {/* Carbon Fiber Survival Tub */}
          <mesh castShadow receiveShadow material={carbonFiberMaterial}>
            <boxGeometry args={[1.25, 0.55, 2.5]} />
          </mesh>
          {/* Rollover Hoops & Titanium Nodes */}
          <mesh position={[-0.35, 0.45, -0.35]} material={discMaterial}>
            <torusGeometry args={[0.2, 0.04, 16, 24, Math.PI]} />
          </mesh>
          <mesh position={[0.35, 0.45, -0.35]} material={discMaterial}>
            <torusGeometry args={[0.2, 0.04, 16, 24, Math.PI]} />
          </mesh>
        </group>

        {/* Front Sacrificial Crash Structure */}
        <group ref={groupFrontCrash} position={[0, 0.42, 1.7]}>
          <mesh castShadow material={discMaterial}>
            <boxGeometry args={[0.92, 0.38, 0.8]} />
          </mesh>
        </group>

        {/* Rear Powertrain Subframe */}
        <group ref={groupRearSubframe} position={[0, 0.45, -1.6]}>
          <mesh castShadow material={discMaterial}>
            <boxGeometry args={[1.1, 0.45, 1.1]} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 3. POWERTRAIN & 120 kWh STRUCTURAL BATTERY                                */}
      {/* ========================================================================= */}
      <group 
        name="powertrain_group"
        onClick={(e) => { e.stopPropagation(); selectHotspot('battery_pack'); }}
      >
        {/* 120kWh Structural Battery Pack Floorpan */}
        <group ref={groupBatteryPack} position={[0, 0.18, 0]}>
          <mesh castShadow receiveShadow material={discMaterial}>
            <boxGeometry args={[1.35, 0.18, 2.3]} />
          </mesh>
          {/* Visible Solid-State Lithium/Silicon Prismatic Cell Arrays */}
          {[-0.4, -0.15, 0.15, 0.4].map((x, i) => (
            <mesh key={i} position={[x, 0.08, 0]} material={batteryCellMaterial}>
              <boxGeometry args={[0.18, 0.05, 2.0]} />
            </mesh>
          ))}
          {/* High Voltage 800V Busbars */}
          <mesh position={[0, 0.11, 0]} material={motorGoldMaterial}>
            <boxGeometry args={[0.08, 0.02, 2.1]} />
          </mesh>
        </group>

        {/* Front Twin-Motor Vectoring Unit */}
        <group 
          ref={groupFrontMotor} 
          position={[0, 0.38, 1.3]}
          onClick={(e) => { e.stopPropagation(); selectHotspot('powertrain_tri_motor'); }}
        >
          <mesh castShadow material={motorGoldMaterial} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.65, 24]} />
          </mesh>
          {/* SiC Inverter Housing */}
          <mesh position={[0, 0.22, 0]} material={discMaterial}>
            <boxGeometry args={[0.48, 0.18, 0.36]} />
          </mesh>
        </group>

        {/* Rear Dual High-Torque Inverter Motor Assembly */}
        <group 
          ref={groupRearMotor} 
          position={[0, 0.42, -1.25]}
          onClick={(e) => { e.stopPropagation(); selectHotspot('powertrain_tri_motor'); }}
        >
          <mesh castShadow material={motorGoldMaterial} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.28, 0.85, 24]} />
          </mesh>
          {/* Dual Inverters */}
          <mesh position={[0, 0.28, 0]} material={discMaterial}>
            <boxGeometry args={[0.62, 0.24, 0.44]} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 4. SUSPENSION & CARBON-CERAMIC BRAKES & FORGED WHEELS                    */}
      {/* ========================================================================= */}
      <group 
        name="suspension_brakes_group"
        onClick={(e) => { e.stopPropagation(); selectHotspot('suspension_brakes'); }}
      >
        {/* Front Left Wheel */}
        <group ref={groupWheelFL} position={[-1.0, 0.38, 1.35]}>
          {renderWheelAssembly(true, true)}
        </group>
        {/* Front Right Wheel */}
        <group ref={groupWheelFR} position={[1.0, 0.38, 1.35]}>
          {renderWheelAssembly(true, false)}
        </group>
        {/* Rear Left Wheel */}
        <group ref={groupWheelRL} position={[-1.05, 0.42, -1.45]}>
          {renderWheelAssembly(false, true)}
        </group>
        {/* Rear Right Wheel */}
        <group ref={groupWheelRR} position={[1.05, 0.42, -1.45]}>
          {renderWheelAssembly(false, false)}
        </group>

        {/* Pushrod Suspension Links & Inboard Dampers */}
        <group ref={groupSuspensionFL} position={[-0.72, 0.45, 1.35]}>
          <mesh rotation={[0, 0, -0.6]} material={discMaterial}>
            <cylinderGeometry args={[0.018, 0.018, 0.65, 12]} />
          </mesh>
          <mesh position={[0.1, 0.1, 0]} material={motorGoldMaterial} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.035, 0.035, 0.3, 12]} />
          </mesh>
        </group>

        <group ref={groupSuspensionFR} position={[0.72, 0.45, 1.35]}>
          <mesh rotation={[0, 0, 0.6]} material={discMaterial}>
            <cylinderGeometry args={[0.018, 0.018, 0.65, 12]} />
          </mesh>
          <mesh position={[-0.1, 0.1, 0]} material={motorGoldMaterial} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.035, 0.035, 0.3, 12]} />
          </mesh>
        </group>

        <group ref={groupSuspensionRL} position={[-0.72, 0.48, -1.45]}>
          <mesh rotation={[0, 0, -0.6]} material={discMaterial}>
            <cylinderGeometry args={[0.018, 0.018, 0.65, 12]} />
          </mesh>
        </group>

        <group ref={groupSuspensionRR} position={[0.72, 0.48, -1.45]}>
          <mesh rotation={[0, 0, 0.6]} material={discMaterial}>
            <cylinderGeometry args={[0.018, 0.018, 0.65, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
