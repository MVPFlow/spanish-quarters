import { useTexture } from "@react-three/drei";
import { MemoryMedia } from "../types";
import { Suspense } from "react";

interface MemoryFrameProps {
  data: MemoryMedia;
}

const FrameContent = ({ data }: MemoryFrameProps) => {
  // Intentamos cargar la textura. Si falla aquí, Suspense mostrará el fallback.
  const texture = useTexture(data.url);

  return (
    <mesh position={[0, 0, 0.06]}>
      <planeGeometry args={[4, 2.5]} />
      <meshStandardMaterial map={texture} roughness={0.3} />
    </mesh>
  );
};

export const MemoryFrame = ({ data }: MemoryFrameProps) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      {/* El marco físico (siempre visible) */}
      <mesh castShadow>
        <boxGeometry args={[4.2, 2.7, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* El contenido con Suspense para evitar que la app explote si no carga */}
      <Suspense
        fallback={
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[4, 2.5]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        }
      >
        <FrameContent data={data} />
      </Suspense>

      {/* Luz puntual de acento */}
      <pointLight
        position={[0, 0, 2]}
        intensity={5}
        distance={6}
        color="#fff"
      />
    </group>
  );
};
