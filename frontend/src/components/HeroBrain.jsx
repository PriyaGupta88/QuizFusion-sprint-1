import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

// Lightweight 3D "AI brain" — a distorted glowing sphere with floating particles.
function DistortSphere() {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} scale={1.6}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#7c9bff"
          attach="material"
          distort={0.45}
          speed={2}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const ref = useRef();
  const sphere = random.inSphere(new Float32Array(1500), { radius: 3.2 });
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
    }
  });
  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled>
      <PointMaterial transparent color="#a78bfa" size={0.008} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

const HeroBrain = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <DistortSphere />
        <Particles />
      </Canvas>
    </div>
  );
};

export default HeroBrain;
