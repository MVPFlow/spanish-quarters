import { useTexture } from "@react-three/drei";
import { Suspense } from "react";
import { MemoryMedia } from "../types";

interface MemoryFrameProps {
  data: MemoryMedia;
}

const FrameContent = ({ data }: MemoryFrameProps) => {
  const texture = useTexture(data.url);

  return (
    <mesh position={[0, 0, 0.06]}>
      <planeGeometry args={[4, 2.5]} />
      <meshStandardMaterial map={texture} roughness={0.3} />
    </mesh>
  );
};

const FrameLoader = () => {
  return (
    <group position={[0, 0, 0.06]}>
      <mesh>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="#1b1b1b" roughness={1} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.18, 0.32, 32]} />
        <meshStandardMaterial color="#6bb0ff" emissive="#6bb0ff" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[0, -0.52, 0.01]}>
        <planeGeometry args={[1.2, 0.22]} />
        <meshStandardMaterial color="#2f4f6f" />
      </mesh>
    </group>
  );
};

export const MemoryFrame = ({ data }: MemoryFrameProps) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh castShadow>
        <boxGeometry args={[4.2, 2.7, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      <Suspense fallback={<FrameLoader />}>
        <FrameContent data={data} />
      </Suspense>

      <pointLight
        position={[0, 0, 2]}
        intensity={5}
        distance={6}
        color="#fff"
      />
    </group>
  );
};
