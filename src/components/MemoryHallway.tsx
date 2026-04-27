import { useMemo } from "react";
import * as THREE from "three";

export const MemoryHallway = () => {
  const wallWidth = 40;
  const wallHeight = 10;

  return (
    <group>
      {/* Suelo del callejón - Estilo adoquines oscuros */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[10, wallWidth]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Pared Izquierda */}
      <mesh position={[-5, wallHeight / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, wallHeight, wallWidth]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Pared Derecha */}
      <mesh position={[5, wallHeight / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, wallHeight, wallWidth]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Luces puntuales tipo farolas */}
      {[-15, -5, 5, 15].map((z, i) => (
        <pointLight
          key={i}
          position={[0, 4, z]}
          intensity={5}
          color="#ffaa44"
          distance={10}
        />
      ))}
    </group>
  );
};
