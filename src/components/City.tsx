import { useMemo } from "react";
import * as THREE from "three";

export const City = () => {
  const count = 400; // Densidad de edificios

  const buildings = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      const h = Math.random() * 5 + 1;
      const w = Math.random() * 2 + 1;

      temp.push({ position: [x, h / 2, z], args: [w, h, w] });
    }
    return temp;
  }, []);

  return (
    <group>
      {/* Suelo base */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Edificios procedurales */}
      {buildings.map((props, i) => (
        <mesh key={i} position={props.position as any} castShadow receiveShadow>
          <boxGeometry args={props.args as any} />
          <meshStandardMaterial color="#444" />
        </mesh>
      ))}
    </group>
  );
};
