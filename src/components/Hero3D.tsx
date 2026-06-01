import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Sphere,
  Torus,
  Environment,
  Stars,
  ContactShadows,
  Text,
  Line,
  Html,
} from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group, Mesh } from "three";

// Convert lat/lon to a point on a sphere
function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Key nodes: Nairobi (hub) + diaspora cities
const NAIROBI = { lat: -1.29, lon: 36.82, label: "Nairobi" };
const DIASPORA = [
  { lat: 51.5, lon: -0.12, label: "London" },
  { lat: 40.71, lon: -74.0, label: "New York" },
  { lat: 25.2, lon: 55.27, label: "Dubai" },
  { lat: 1.35, lon: 103.82, label: "Singapore" },
  { lat: 43.65, lon: -79.38, label: "Toronto" },
  { lat: -33.87, lon: 151.21, label: "Sydney" },
];

const RADIUS = 1.5;

function Globe() {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.08;
  });

  return (
    <group>
      {/* Solid core */}
      <Sphere ref={ref} args={[RADIUS, 64, 64]}>
        <meshStandardMaterial
          color="#0a1a3a"
          emissive="#0f1b3d"
          emissiveIntensity={0.4}
          roughness={0.4}
          metalness={0.6}
        />
      </Sphere>
      {/* Wireframe shell */}
      <Sphere args={[RADIUS * 1.005, 32, 32]}>
        <meshBasicMaterial color="#c9a84c" wireframe transparent opacity={0.18} />
      </Sphere>
      {/* Atmosphere glow */}
      <Sphere args={[RADIUS * 1.08, 64, 64]}>
        <meshBasicMaterial color="#f0d78c" transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
}

function ConnectionArc({
  start,
  end,
  delay = 0,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  delay?: number;
}) {
  const points = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    mid.normalize().multiplyScalar(RADIUS + dist * 0.45);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(60);
  }, [start, end]);

  const lineRef = useRef<any>(null);
  const pulseRef = useRef<Mesh>(null);

  useFrame((s) => {
    const t = (s.clock.elapsedTime + delay) % 4;
    const progress = Math.min(t / 2.5, 1);
    if (lineRef.current?.material) {
      lineRef.current.material.opacity = 0.25 + 0.5 * Math.sin(t * Math.PI * 0.5);
    }
    if (pulseRef.current && progress < 1) {
      const idx = Math.floor(progress * (points.length - 1));
      pulseRef.current.position.copy(points[idx]);
      pulseRef.current.visible = true;
      const scale = 1 - Math.abs(progress - 0.5) * 1.4;
      pulseRef.current.scale.setScalar(Math.max(0.3, scale));
    } else if (pulseRef.current) {
      pulseRef.current.visible = false;
    }
  });

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color="#f0d78c"
        lineWidth={1.2}
        transparent
        opacity={0.5}
      />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#2dd4a8" emissive="#2dd4a8" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function CityNode({
  position,
  label,
  isHub,
}: {
  position: THREE.Vector3;
  label: string;
  isHub?: boolean;
}) {
  const ringRef = useRef<Mesh>(null);
  useFrame((s) => {
    if (!ringRef.current) return;
    const pulse = 1 + Math.sin(s.clock.elapsedTime * 2) * 0.3;
    ringRef.current.scale.setScalar(pulse);
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[isHub ? 0.07 : 0.045, 16, 16]} />
        <meshStandardMaterial
          color={isHub ? "#f0d78c" : "#2dd4a8"}
          emissive={isHub ? "#f0d78c" : "#2dd4a8"}
          emissiveIntensity={2}
        />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.08, 0.11, 32]} />
        <meshBasicMaterial
          color={isHub ? "#f0d78c" : "#2dd4a8"}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Html
        position={[0, isHub ? 0.18 : 0.13, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div
          className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm"
          style={{
            background: isHub ? "rgba(240,215,140,0.95)" : "rgba(13,27,61,0.85)",
            color: isHub ? "#0f1b3d" : "#f0d78c",
            border: "1px solid rgba(240,215,140,0.4)",
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

function Scene() {
  const groupRef = useRef<Group>(null);
  const nairobiPos = useMemo(() => latLonToVec3(NAIROBI.lat, NAIROBI.lon, RADIUS), []);
  const diasporaPositions = useMemo(
    () => DIASPORA.map((c) => ({ ...c, pos: latLonToVec3(c.lat, c.lon, RADIUS) })),
    []
  );

  useFrame((s) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = s.clock.elapsedTime * 0.08;
  });

  return (
    <group ref={groupRef}>
      <Globe />
      <CityNode position={nairobiPos} label="Nairobi" isHub />
      {diasporaPositions.map((c) => (
        <CityNode key={c.label} position={c.pos} label={c.label} />
      ))}
      {diasporaPositions.map((c, i) => (
        <ConnectionArc key={c.label} start={nairobiPos} end={c.pos} delay={i * 0.6} />
      ))}
    </group>
  );
}

function OrbitTrust() {
  const g = useRef<Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.rotation.z = s.clock.elapsedTime * 0.1;
    g.current.rotation.x = Math.PI / 2.6;
  });
  return (
    <group ref={g}>
      <Torus args={[2.4, 0.005, 16, 200]}>
        <meshStandardMaterial color="#f0d78c" emissive="#c9a84c" emissiveIntensity={0.7} />
      </Torus>
    </group>
  );
}

function FloatingBadges() {
  const items = [
    { text: "VERIFIED", color: "#2dd4a8" },
    { text: "ESCROW", color: "#f0d78c" },
    { text: "AUDITED", color: "#e8a87c" },
  ];
  return (
    <>
      {items.map((it, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const x = Math.cos(angle) * 2.6;
        const y = Math.sin(angle) * 1.2 + 0.2;
        return (
          <Float key={i} speed={2} floatIntensity={1.5} rotationIntensity={0.2}>
            <Text
              position={[x, y, 1.2]}
              fontSize={0.18}
              color={it.color}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.005}
              outlineColor="#0f1b3d"
            >
              {it.text}
            </Text>
          </Float>
        );
      })}
    </>
  );
}

export function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#f0d78c" />
      <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#2dd4a8" />
      <pointLight position={[0, 2, 3]} intensity={0.6} color="#f0d78c" />
      <Suspense fallback={null}>
        <Stars radius={30} depth={50} count={1500} factor={2.5} saturation={0} fade speed={1} />
        <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.5}>
          <Scene />
        </Float>
        <OrbitTrust />
        <FloatingBadges />
        <ContactShadows position={[0, -1.9, 0]} opacity={0.3} scale={8} blur={2.5} far={3} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
