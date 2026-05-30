import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Sphere, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh, Group } from "three";

function Knot() {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <Icosahedron ref={ref} args={[1.4, 4]}>
      <MeshDistortMaterial
        color="#d4a13a"
        emissive="#3a2810"
        roughness={0.15}
        metalness={0.85}
        distort={0.35}
        speed={1.6}
      />
    </Icosahedron>
  );
}

function Orbiters() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <Sphere key={i} args={[0.12, 32, 32]} position={[Math.cos(angle) * 2.6, Math.sin(angle) * 0.8, Math.sin(angle) * 2.6]}>
            <meshStandardMaterial color="#f0d78c" emissive="#c9a84c" emissiveIntensity={0.6} />
          </Sphere>
        );
      })}
    </group>
  );
}

export function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#f0d78c" />
      <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#4a6fa5" />
      <Suspense fallback={null}>
        <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
          <Knot />
        </Float>
        <Orbiters />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
