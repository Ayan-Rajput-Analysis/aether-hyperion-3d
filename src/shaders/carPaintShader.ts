import * as THREE from 'three';

/**
 * Multi-Layer Bespoke Car Paint & Anisotropic Carbon GLSL Shader
 * Features:
 * - Sub-surface chromatic metallic micro-flake sparkle glint (view-dependent)
 * - Two-layer clearcoat specular reflectance with Schlick Fresnel approximation
 * - Dual-roughness metallic luster
 * - Real-time uniforms with zero re-instantiation overhead
 */

export const CarPaintVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    
    vec4 mvPosition = viewMatrix * worldPosition;
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const CarPaintFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uBaseColor;
  uniform vec3 uFlakeColor;
  uniform float uClearcoat;
  uniform float uClearcoatRoughness;
  uniform float uRoughness;
  uniform float uMetalness;
  uniform float uFlakeScale;
  uniform float uFlakeIntensity;
  uniform float uTime;
  uniform vec3 uLightPos;
  uniform vec3 uLightColor;
  uniform vec3 uAmbientColor;
  uniform float uIsCarbon;

  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  // Procedural 2D/3D hash for deterministic micro-flake sparkles
  float hash3(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  // 3D pseudo-random normal perturbation for metallic flakes
  vec3 getFlakeNormal(vec3 worldPos, vec3 baseNormal, float scale) {
    vec3 p = worldPos * scale;
    vec3 i = floor(p);
    vec3 f = fract(p);

    float n0 = hash3(i);
    float n1 = hash3(i + vec3(1.0, 0.0, 0.0));
    float n2 = hash3(i + vec3(0.0, 1.0, 0.0));
    float n3 = hash3(i + vec3(0.0, 0.0, 1.0));

    vec3 randomOffset = vec3(n1 - n0, n2 - n0, n3 - n0) * 2.0 - 1.0;
    return normalize(baseNormal + randomOffset * 0.45);
  }

  // Carbon fiber weave pattern generator
  vec3 getCarbonFiberColor(vec2 uv, vec3 normal, vec3 viewDir, vec3 lightDir) {
    vec2 weave = fract(uv * 140.0);
    float pattern = step(0.5, weave.x) != step(0.5, weave.y) ? 0.85 : 0.45;
    
    // Anisotropic sheen direction
    vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
    vec3 halfVec = normalize(lightDir + viewDir);
    float dotTH = dot(tangent, halfVec);
    float sinTH = sqrt(max(0.0, 1.0 - dotTH * dotTH));
    float anisoSpec = pow(sinTH, 40.0) * 0.6;
    
    vec3 carbonBase = vec3(0.04, 0.045, 0.05) * pattern;
    return carbonBase + vec3(anisoSpec * 0.4);
  }

  // Schlick Fresnel approximation
  float fresnelSchlick(float cosTheta, float F0) {
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize(uLightPos - vWorldPosition);
    vec3 H = normalize(L + V);

    float NdotL = max(dot(N, L), 0.0);
    float NdotV = max(dot(N, V), 0.001);
    float NdotH = max(dot(N, H), 0.0);
    float VdotH = max(dot(V, H), 0.0);

    if (uIsCarbon > 0.5) {
      vec3 carbon = getCarbonFiberColor(vUv, N, V, L);
      float F = fresnelSchlick(NdotV, 0.04);
      vec3 clearcoatSpec = vec3(1.0) * pow(NdotH, 64.0) * uClearcoat;
      vec3 finalColor = carbon + clearcoatSpec * F + uAmbientColor * 0.15;
      gl_FragColor = vec4(finalColor, 1.0);
      return;
    }

    // --- BASE PBR COAT ---
    vec3 diffuse = uBaseColor * (1.0 - uMetalness) * NdotL * uLightColor;
    
    // Base Specular (Blinn-Phong roughness term)
    float specPower = mix(128.0, 8.0, uRoughness);
    vec3 baseSpecular = mix(vec3(0.04), uBaseColor, uMetalness) * pow(NdotH, specPower);

    // --- METALLIC MICRO-FLAKE SPARKLE LAYER ---
    vec3 flakeN = getFlakeNormal(vWorldPosition, N, uFlakeScale);
    float flakeNdotH = max(dot(flakeN, H), 0.0);
    float sparkle = pow(flakeNdotH, 180.0) * uFlakeIntensity;
    
    // Sparkle sparkles sharply when view moves
    vec3 sparkleColor = uFlakeColor * sparkle * step(0.2, NdotL);

    // --- CLEARCOAT REFLECTANCE LAYER ---
    float clearcoatFresnel = fresnelSchlick(NdotV, 0.04) * uClearcoat;
    float clearcoatSpecPower = mix(512.0, 64.0, uClearcoatRoughness);
    vec3 clearcoatSpecular = vec3(1.0) * pow(NdotH, clearcoatSpecPower) * clearcoatFresnel;

    // Environmental horizon glow
    float rim = pow(1.0 - NdotV, 3.5) * 0.35;
    vec3 rimLight = mix(uBaseColor, vec3(1.0), 0.4) * rim;

    // Composite Final Shading
    vec3 ambient = uAmbientColor * uBaseColor * 0.25;
    vec3 color = ambient + diffuse + baseSpecular + sparkleColor + clearcoatSpecular + rimLight;

    // ACESFilmic tonemapping curve approximation
    color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createCarPaintMaterial(params?: {
  color?: string;
  flakeColor?: string;
  clearcoat?: number;
  roughness?: number;
  metalness?: number;
  isCarbon?: boolean;
}) {
  return new THREE.ShaderMaterial({
    vertexShader: CarPaintVertexShader,
    fragmentShader: CarPaintFragmentShader,
    uniforms: {
      uBaseColor: { value: new THREE.Color(params?.color || '#D8DEE9') },
      uFlakeColor: { value: new THREE.Color(params?.flakeColor || '#FFFFFF') },
      uClearcoat: { value: params?.clearcoat ?? 1.0 },
      uClearcoatRoughness: { value: 0.04 },
      uRoughness: { value: params?.roughness ?? 0.14 },
      uMetalness: { value: params?.metalness ?? 0.92 },
      uFlakeScale: { value: 120.0 },
      uFlakeIntensity: { value: 2.8 },
      uTime: { value: 0 },
      uLightPos: { value: new THREE.Vector3(5.0, 10.0, 5.0) },
      uLightColor: { value: new THREE.Vector3(1.2, 1.25, 1.3) },
      uAmbientColor: { value: new THREE.Vector3(0.2, 0.25, 0.32) },
      uIsCarbon: { value: params?.isCarbon ? 1.0 : 0.0 }
    }
  });
}
