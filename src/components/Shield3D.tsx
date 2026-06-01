import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  RoundedBox,
  Torus,
  Text,
  Stars,
  ContactShadows,
  Html,
} from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group, Mesh } from "three";

function Shield() {
  const ref = useRef<Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.35;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.3) * 0.08;
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[1.7, 2.1, 0.28]} radius={0.55} smoothness={6}>
        <meshStandardMaterial
          color="#0f1b3d"
          metalness={0.9}
          roughness={0.25}
          emissive="#1e3a5f"
          emissiveIntensity={0.35}
        />
      </RoundedBox>

      <RoundedBox args={[1.45, 1.85, 0.32]} radius={0.45} smoothness={6} position={[0, 0, 0.02]}>
        <meshStandardMaterial
          color="#d4a13a"
          metalness={0.95}
          roughness={0.15}
          emissive="#3a2810"
          emissiveIntensity={0.4}
        />
      </RoundedBox>

      {/* Engraved checkmark */}
      <group position={[0, 0, 0.21]}>
        <mesh rotation={[0, 0, -Math.PI / 4]} position={[-0.18, -0.05, 0]}>
          <boxGeometry args={[0.18, 0.6, 0.08]} />
          <meshStandardMaterial color="#0f1b3d" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 3]} position={[0.15, 0.1, 0]}>
          <boxGeometry args={[0.18, 1.0, 0.08]} />
          <meshStandardMaterial color="#0f1b3d" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      <Text
        position={[0, 0.7, 0.22]}
        fontSize={0.13}
        color="#0f1b3d"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        AFRINEXUS
      </Text>
      <Text
        position={[0, -0.78, 0.22]}
        fontSize={0.08}
        color="#0f1b3d"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
      >
        VERIFIED · ENCRYPTED · AUDITED
      </Text>
    </group>
  );
}

function OrbitRings() {
  const g = useRef<Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.rotation.y = s.clock.elapsedTime * 0.4;
    g.current.rotation.x = s.clock.elapsedTime * 0.15;
  });
  return (
    <group ref={g}>
      <Torus args={[1.9, 0.015, 16, 200]}>
        <meshStandardMaterial color="#2dd4a8" emissive="#0d7a5f" emissiveIntensity={0.9} />
      </Torus>
      <Torus args={[2.2, 0.01, 16, 200]} rotation={[Math.PI / 2.5, 0, 0]}>
        <meshStandardMaterial color="#f0d78c" emissive="#c9a84c" emissiveIntensity={0.7} />
      </Torus>
      <Torus args={[2.5, 0.008, 16, 200]} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <meshStandardMaterial color="#3b6fa0" emissive="#1e3a5f" emissiveIntensity={0.6} />
      </Torus>
    </group>
  );
}

function EncryptedParticles() {
  const ref = useRef<Group>(null);
  const positions = useMemo(() => {
    const arr: Array<{ p: THREE.Vector3; speed: number; offset: number; color: string }> = [];
    const colors = ["#f0d78c", "#2dd4a8", "#3b6fa0"];
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const r = 1.6 + Math.random() * 1.1;
      arr.push({
        p: new THREE.Vector3(Math.cos(angle) * r, (Math.random() - 0.5) * 2.4, Math.sin(angle) * r),
        speed: 0.3 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
      });
    }
    return arr;
  }, []);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.18;
    ref.current.children.forEach((child, i) => {
      const data = positions[i];
      child.position.y = data.p.y + Math.sin(s.clock.elapsedTime * data.speed + data.offset) * 0.15;
    });
  });

  return (
    <group ref={ref}>
      {positions.map((d, i) => (
        <mesh key={i} position={d.p}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color={d.color} emissive={d.color} emissiveIntensity={2.5} />
        </mesh>
      ))}
    </group>
  );
}

function SecurityTags() {
  const tags = [
    { text: "RLS POLICIES", color: "#2dd4a8", angle: 0 },
    { text: "AES-256", color: "#f0d78c", angle: (Math.PI * 2) / 3 },
    { text: "ZERO RESALE", color: "#e8a87c", angle: (Math.PI * 4) / 3 },
  ];
  const g = useRef<Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.rotation.y = s.clock.elapsedTime * 0.12;
  });
  return (
    <group ref={g}>
      {tags.map((t, i) => {
        const x = Math.cos(t.angle) * 2.8;
        const z = Math.sin(t.angle) * 2.8;
        return (
          <Float key={i} speed={1.8} floatIntensity={1.2} rotationIntensity={0.15}>
            <group position={[x, Math.sin(i) * 0.6, z]}>
              <Html center distanceFactor={9} style={{ pointerEvents: "none" }}>
                <div
                  className="whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
                  style={{
                    background: "rgba(13,27,61,0.85)",
                    color: t.color,
                    border: `1px solid ${t.color}66`,
                    boxShadow: `0 0 16px ${t.color}40`,
                  }}
                >
                  {t.text}
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
    </group>
  );
}

function ScanBeam() {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.8) * 1.2;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 + Math.abs(Math.sin(t * 0.8)) * 0.25;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.4, 0.04]} />
      <meshBasicMaterial color="#2dd4a8" transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function Shield3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 4]} intensity={1.4} color="#f0d78c" />
      <directionalLight position={[-4, -2, -4]} intensity={0.6} color="#2dd4a8" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#f0d78c" />
      <Suspense fallback={null}>
        <Stars radius={25} depth={40} count={1000} factor={2} saturation={0} fade speed={1} />
        <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.7}>
          <Shield />
          <ScanBeam />
        </Float>
        <OrbitRings />
        <EncryptedParticles />
        <SecurityTags />
        <ContactShadows position={[0, -1.6, 0]} opacity={0.35} scale={7} blur={2.5} far={3} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
