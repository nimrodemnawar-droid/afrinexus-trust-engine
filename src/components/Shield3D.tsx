import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, RoundedBox, Torus } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";

function Shield() {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.4) * 0.4;
  });
  return (
    <RoundedBox ref={ref} args={[1.6, 2, 0.25]} radius={0.5} smoothness={6}>
      <meshStandardMaterial color="#d4a13a" metalness={0.95} roughness={0.15} emissive="#3a2810" emissiveIntensity={0.3} />
    </RoundedBox>
  );
}

function Orbit() {
  const g = useRef<Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.rotation.y = s.clock.elapsedTime * 0.4;
    g.current.rotation.x = s.clock.elapsedTime * 0.15;
  });
  return (
    <group ref={g}>
      <Torus args={[1.8, 0.015, 16, 200]}>
        <meshStandardMaterial color="#2dd4a8" emissive="#0d7a5f" emissiveIntensity={0.7} />
      </Torus>
      <Torus args={[2.1, 0.01, 16, 200]} rotation={[Math.PI / 2.5, 0, 0]}>
        <meshStandardMaterial color="#f0d78c" emissive="#c9a84c" emissiveIntensity={0.6} />
      </Torus>
    </group>
  );
}

export function Shield3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 4]} intensity={1.4} color="#f0d78c" />
      <directionalLight position={[-4, -2, -4]} intensity={0.5} color="#2dd4a8" />
      <Suspense fallback={null}>
        <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.8}>
          <Shield />
        </Float>
        <Orbit />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
