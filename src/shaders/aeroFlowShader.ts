import * as THREE from 'three';

/**
 * Aerodynamic Wind Tunnel Particle Flow GLSL Shader
 * Features:
 * - Real-time laminar flow simulation over hypercar contours
 * - Pressure-to-velocity gradient mapping (stagnation red/orange <-> accelerated low-pressure cyan/blue)
 * - Dynamic aerodynamic wake turbulence and active DRS channeling
 */

export const AeroParticleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uSpread;
  uniform float uFlowActive;

  attribute float aSpeed;
  attribute float aPhase;
  attribute vec3 aInitialPos;

  varying float vPressure;
  varying float vAlpha;
  varying float vSpeed;

  void main() {
    float t = mod(uTime * aSpeed * uSpeed + aPhase * 20.0, 14.0) - 7.0; // moves along Z: 7m front to -7m rear
    
    vec3 pos = aInitialPos;
    pos.z = -t; // Travel direction: Front (+Z) to Rear (-Z)

    // Aerodynamic profile deflection simulation around Hyperion GT envelope
    // Body length: ~4.8m (Z from 2.4 to -2.4), width: 2.1m (X from -1.05 to 1.05), height: 1.15m (Y from 0.1 to 1.25)
    float inCarRange = step(-2.8, pos.z) * step(pos.z, 2.5);
    
    // Stagnation at nose (z ~ 2.2 to 2.4, x ~ 0, y ~ 0.35)
    float noseDist = length(vec2(pos.x, pos.y - 0.4));
    if (pos.z > 1.8 && pos.z < 2.5 && noseDist < 0.9) {
      float deflect = (0.9 - noseDist) * 0.7;
      pos.x += sign(pos.x + 0.001) * deflect * 0.5;
      pos.y += deflect * 0.4;
    }

    // Cockpit canopy deflection (z ~ 0.8 to -1.0)
    if (pos.z > -1.2 && pos.z < 1.4 && abs(pos.x) < 0.8) {
      float canopyHeight = smoothstep(1.4, 0.2, pos.z) * smoothstep(-1.2, -0.4, pos.z) * 0.85;
      pos.y += canopyHeight * (1.0 - smoothstep(0.0, 0.7, abs(pos.x)));
    }

    // Venturi underbody suction effect (ground effect channels)
    if (pos.y < 0.25 && pos.z > -2.0 && pos.z < 1.5) {
      pos.y = max(pos.y, 0.08); // Ground suction floor
    }

    // Rear diffuser and active wing upwash (z < -1.8)
    if (pos.z < -1.8) {
      float upwash = smoothstep(-1.8, -3.2, pos.z) * 0.55;
      pos.y += upwash;
      // Wake turbulence eddying
      pos.x += sin(t * 8.0 + aPhase) * 0.06 * upwash;
    }

    // Pressure & velocity calculation
    // High pressure / stagnation: near nose (pos.z ~ 2.2, pos.y ~ 0.4)
    float frontStagnation = smoothstep(1.5, 2.4, pos.z) * (1.0 - smoothstep(0.0, 0.8, length(pos.xy - vec2(0.0, 0.4))));
    
    // Low pressure / high velocity: canopy apex and side venturis
    float canopyLowPressure = smoothstep(0.2, 1.1, pos.y) * smoothstep(1.6, 0.0, abs(pos.z));
    
    // vPressure in [0, 1]: 1.0 = High Pressure (Red), 0.0 = Low Pressure/High Velocity (Cyan)
    vPressure = clamp(frontStagnation * 1.2 - canopyLowPressure * 0.6 + 0.2, 0.0, 1.0);
    vSpeed = aSpeed;

    // Fade in at front, fade out at rear
    vAlpha = smoothstep(6.5, 5.0, pos.z) * smoothstep(-6.5, -4.5, pos.z) * uFlowActive;

    vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Particle size attenuation
    gl_PointSize = (18.0 * aSpeed / -mvPosition.z) * (1.0 + vPressure * 0.4);
  }
`;

export const AeroParticleFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uHighVelocityColor; // Cyan: vec3(0.0, 0.94, 1.0)
  uniform vec3 uStagnationColor;   // Red/Orange: vec3(1.0, 0.22, 0.1)
  uniform vec3 uMidColor;          // Amber: vec3(1.0, 0.65, 0.0)

  varying float vPressure;
  varying float vAlpha;
  varying float vSpeed;

  void main() {
    // Round circular point sprite with soft radial falloff
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float innerGlow = smoothstep(0.5, 0.05, dist);
    float coreSpark = smoothstep(0.18, 0.0, dist) * 1.5;

    // Color gradient mapping based on CFD pressure coefficient
    vec3 gradient;
    if (vPressure > 0.5) {
      float f = (vPressure - 0.5) * 2.0;
      gradient = mix(uMidColor, uStagnationColor, f);
    } else {
      float f = vPressure * 2.0;
      gradient = mix(uHighVelocityColor, uMidColor, f);
    }

    vec3 finalColor = gradient + vec3(coreSpark);
    float alpha = innerGlow * vAlpha * 0.85;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function createAeroParticleMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: AeroParticleVertexShader,
    fragmentShader: AeroParticleFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 2.2 },
      uSpread: { value: 1.0 },
      uFlowActive: { value: 0.0 },
      uHighVelocityColor: { value: new THREE.Color('#00F0FF') },
      uMidColor: { value: new THREE.Color('#0066FF') },
      uStagnationColor: { value: new THREE.Color('#FF2A55') }
    }
  });
}
