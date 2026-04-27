import { MemoryFrame } from "./MemoryFrame";
import { MemoryMedia } from "../types";

const SAMPLE_MEMORIES: MemoryMedia[] = [
  {
    id: "m1",
    title: "Callejón de la Luz",
    url: "https://picsum.photos/id/1015/800/600",
    position: [-4.7, 2.5, -12],
    rotation: [0, Math.PI / 2, 0],
    description: "",
  },
  {
    id: "m2",
    title: "Estructuras",
    url: "https://picsum.photos/id/1016/800/600",
    position: [-4.7, 2.5, 0],
    rotation: [0, Math.PI / 2, 0],
    description: "",
  },
  {
    id: "m3",
    title: "Murales",
    url: "https://picsum.photos/id/1018/800/600",
    position: [4.7, 2.5, -6],
    rotation: [0, -Math.PI / 2, 0],
    description: "",
  },
  {
    id: "m4",
    title: "Tradiciones",
    url: "https://picsum.photos/id/1019/800/600",
    position: [4.7, 2.5, 10],
    rotation: [0, -Math.PI / 2, 0],
    description: "",
  },
];

export const MemoryHallway = () => {
  return (
    <group>
      {/* Suelo oscuro con ligero reflejo */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[12, 50]} />
        <meshStandardMaterial color="#080808" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Paredes del callejón */}
      <mesh position={[-5, 5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 10, 50]} />
        <meshStandardMaterial color="#151515" />
      </mesh>
      <mesh position={[5, 5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 10, 50]} />
        <meshStandardMaterial color="#151515" />
      </mesh>

      {/* Farolas de pared */}
      {[-15, -5, 5, 15].map((z, i) => (
        <group
          key={`hall-light-${i}`}
          position={[i % 2 === 0 ? -4.6 : 4.6, 3.5, z]}
        >
          <pointLight intensity={12} distance={12} color="#ffcc88" />
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ffcc88" />
          </mesh>
        </group>
      ))}

      {/* Renderizado de los marcos de fotos */}
      {SAMPLE_MEMORIES.map((m) => (
        <MemoryFrame key={m.id} data={m} />
      ))}
    </group>
  );
};
