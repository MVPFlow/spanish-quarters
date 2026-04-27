import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  ContactShadows,
  Sky,
} from "@react-three/drei";
import * as THREE from "three";
import { City } from "./City";
import { Hotspots } from "./Hotspots";
import { Zone } from "../types";

interface ExperienceProps {
  view: "aerial" | "transitioning" | "inside";
  activeZone: Zone | null;
  onZoneSelect: (zone: Zone | null) => void;
}

const Experience = ({ view, activeZone, onZoneSelect }: ExperienceProps) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Posiciones predefinidas
  const AERIAL_POS = new THREE.Vector3(50, 50, 50);
  const AERIAL_TARGET = new THREE.Vector3(0, 0, 0);

  useFrame((state, delta) => {
    let targetPos = AERIAL_POS;
    let targetLookAt = AERIAL_TARGET;

    if (view === "inside" && activeZone) {
      // Calculamos una posición frente al hotspot
      const [x, y, z] = activeZone.position;
      targetPos = new THREE.Vector3(x + 5, y + 2, z + 10);
      targetLookAt = new THREE.Vector3(x, y, z);
    }

    // Suavizado de posición (Lerp)
    state.camera.position.lerp(targetPos, delta * 2);

    // Suavizado del objetivo de la cámara
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt, delta * 2);
      controlsRef.current.update();
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[50, 50, 50]} fov={45} />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={120}
        enabled={view !== "inside"} // Bloqueamos controles manuales durante el "zoom"
      />

      <ambientLight intensity={0.2} />
      <directionalLight position={[-10, 20, 10]} intensity={1.5} castShadow />

      <City />

      {/* Solo mostramos hotspots si no estamos "dentro" de una zona */}
      {view !== "inside" && (
        <Hotspots onZoneSelect={onZoneSelect} activeZone={activeZone} />
      )}

      <Sky sunPosition={[100, 20, 100]} />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={100}
        blur={2}
        far={10}
      />
    </>
  );
};

export default Experience;
