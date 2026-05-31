import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Icosahedron,
  Sphere,
  Torus,
  Environment,
  Stars,
  ContactShadows,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh, Group } from "three";

function Knot({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x += (pointer.current.y * 0.4 - ref.current.rotation.x) * 0.05;
    ref.current.rotation.y += (pointer.current.x * 0.6 + t * 0.1 - ref.current.rotation.y) * 0.05;
  });
  return (
    <Icosahedron ref={ref} args={[1.45, 5]}>
      <MeshDistortMaterial
        color="#d4a13a"
        emissive="#3a2810"
        emissiveIntensity={0.4}
        roughness={0.12}
        metalness={0.9}
        distort={0.42}
        speed={2.2}
      />
    </Icosahedron>
  );
}

function Rings() {
  const g = useRef<Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.rotation.z = s.clock.elapsedTime * 0.15;
    g.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.3) * 0.3;
  });
  return (
    <group ref={g}>
      <Torus args={[2.3, 0.012, 16, 200]} rotation={[Math.PI / 2.4, 0, 0]}>
        <meshStandardMaterial color="#f0d78c" emissive="#c9a84c" emissiveIntensity={0.8} />
      </Torus>
      <Torus args={[2.7, 0.008, 16, 200]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#2dd4a8" emissive="#0d7a5f" emissiveIntensity={0.6} />
      </Torus>
    </group>
  );
}

function Orbiters() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.35;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });
  const items = [
    { c: "#f0d78c", e: "#c9a84c" },
    { c: "#2dd4a8", e: "#0d7a5f" },
    { c: "#e8a87c", e: "#c4654a" },
    { c: "#f0d78c", e: "#c9a84c" },
    { c: "#a78bfa", e: "#4f46e5" },
  ];
  return (
    <group ref={group}>
      {items.map((it, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const r = 2.4 + (i % 2) * 0.4;
        return (
          <Float key={i} speed={2 + i * 0.3} floatIntensity={1.4} rotationIntensity={0.4}>
            <Sphere args={[0.11 + (i % 3) * 0.03, 32, 32]} position={[Math.cos(angle) * r, Math.sin(angle) * 0.9, Math.sin(angle) * r]}>
              <meshStandardMaterial color={it.c} emissive={it.e} emissiveIntensity={0.9} />
            </Sphere>
          </Float>
        );
      })}
    </group>
  );
}

export function Hero3D() {
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      onPointerMove={(e) => {
        const r = (e.target as HTMLElement).getBoundingClientRect();
        pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.3} color="#f0d78c" />
      <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#4a6fa5" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color="#2dd4a8" />
      <Suspense fallback={null}>
        <Stars radius={20} depth={40} count={1200} factor={2.5} saturation={0} fade speed={1} />
        <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.9}>
          <Knot pointer={pointer} />
        </Float>
        <Rings />
        <Orbiters />
        <ContactShadows position={[0, -1.9, 0]} opacity={0.4} scale={8} blur={2.5} far={3} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
