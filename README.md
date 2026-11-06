# AETHER HYPERION GT // BESPOKE ELECTRIC HYPERCAR EXPERIENCE

> **Award-Winning, Production-Grade 3D Web Experience**  
> Engineered with Three.js, React Three Fiber, WebGL2 GLSL Shaders, GSAP, Zustand, and Web Audio API.

---

## 1. System Architecture & Scene Graph Hierarchy

```
[WebGL2 Render Context]
  ├── LightingRig
  │     ├── Key DirectionalLight (2048x2048 PCFSoftShadowMap, bias calibrated)
  │     ├── Cool Horizon Fill Light
  │     ├── Aerodynamic Silhouette Rim Spotlight (Cyan Glint)
  │     ├── Venturi Underbody Point Light (Mode Reactive)
  │     └── Ground Plane (Dark Reflective PBR + Laser Grid Helper)
  ├── ExplodedCarModel (Parametric Programmatic Assembly)
  │     ├── Outer Shell & Aero Panels (Hood, Butterfly Doors, Canopy, DRS Wing, Splitter, Diffuser)
  │     ├── Chassis & Monocoque (T1100 Carbon Tub, Front Crash Box, Rear Subframe)
  │     ├── Powertrain & Battery (120kWh Structural Pack, Front SiC Motors, Rear High-RPM Motors)
  │     └── Suspension & Brakes (Pushrods, Dampers, Brembo Carbon-Ceramic Rotors, Monobloc Calipers, Forged Wheels)
  ├── AeroParticleSystem (GPU Compute Wind Tunnel Flow)
  │     └── 14,000 Streamline Particles with Dynamic Navier-Stokes / CFD Pressure Gradients
  ├── HotspotMarkers (Drei 3D-to-2D Screen-Space Projected Reticles)
  │     └── [01] Shell, [02] Monocoque, [03] Powertrain, [04] Battery, [05] Suspension
  └── CameraRig
        └── OrbitControls with Programmatic Vector Damping and Focal State Choreography
```

---

## 2. Mathematical Breakdown

### 2.1 Exploded Vector Interpolation (Lerp)
Components translate along directional vectors radiating outwards from the vehicle's monocoque center of mass $\vec{C} = (0, 0.45, 0)$:

$$\vec{P}_{t} = \text{lerp}(\vec{P}_{\text{rest}}, \vec{P}_{\text{target}}, f(t))$$

Where $t \in [0, 1]$ is the continuous scrub progress driven either by mouse wheel/scroll or the UI range slider, and $f(t)$ is a smooth Hermite cubic easing curve:

$$f(t) = t^2 \cdot (3 - 2t)$$

### 2.2 Metallic Flake Sparkle Shader Equation
The car paint shader computes view-dependent micro-facet sparkles using 3D pseudo-random hash perturbations:

$$\vec{N}_{\text{flake}} = \text{normalize}\left(\vec{N}_{\text{base}} + (\text{hash}_3(\vec{P}_{\text{world}} \cdot s) \cdot 2 - 1) \cdot \kappa\right)$$

$$I_{\text{sparkle}} = \max\left(\vec{N}_{\text{flake}} \cdot \vec{H}, 0\right)^{\gamma} \cdot \alpha_{\text{flake}}$$

Where $\vec{H} = \text{normalize}(\vec{L} + \vec{V})$ is the half-vector, $\gamma = 180$ controls the microscopic sharpness of the metallic flakes, and Schlick's approximation provides realistic dual-layer clearcoat specular reflectance:

$$F(\theta) = F_0 + (1 - F_0)(1 - \cos\theta)^5$$

### 2.3 Aerodynamic Pressure Mapping (Wind Tunnel Mode)
Particle streamlines evaluate local body deflection and stagnation pressure coefficients:

$$C_p = \text{clamp}\left(1.2 \cdot P_{\text{nose}} - 0.6 \cdot P_{\text{canopy}} + 0.2, 0.0, 1.0\right)$$

- $C_p \to 1.0$: High-pressure stagnation zones $\to$ Crimson / Amber hot spectrum
- $C_p \to 0.0$: Accelerated low-pressure suction $\to$ Electric Cyan / Deep Blue velocity streamlines

---

## 3. Technology Stack

- **Framework**: React 18 / 19 + TypeScript + Vite
- **3D Graphics Engine**: Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- **Animation Engine**: GSAP (GreenSock) for smooth continuous scrub and easing
- **State Management**: Zustand with immutable updates and calculated telemetry
- **Audio Feedback**: Procedural Web Audio API synthesizer (no external sound asset latency)
- **Styling**: Tailwind CSS + Custom GLSL Shaders
