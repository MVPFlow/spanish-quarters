import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PointerLockControls,
  PerspectiveCamera,
  Stars,
  Sky,
} from "@react-three/drei";
import * as THREE from "three";
import { City } from "./City";
import { MemoryHallway } from "./MemoryHallway";
import { Hotspots } from "./Hotspots";
import { Zone, ViewState } from "../types";
import { useKeyboard } from "../hooks/useKeyboard";

interface ExperienceProps {
  view: ViewState;
  activeZone: Zone | null;
  onZoneSelect: (zone: Zone | null) => void;
}

const Experience = ({ view, activeZone, onZoneSelect }: ExperienceProps) => {
  const isInside = view === "inside";

  // Hook de teclado para WASD / Flechas
  const { moveForward, moveBackward, moveLeft, moveRight } = useKeyboard();

  // Referencias para la física simple del movimiento
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    // --- VISTA AÉREA (MAPA GLOBAL) ---
    if (!isInside) {
      const targetPos = new THREE.Vector3(60, 60, 60);
      state.camera.position.lerp(targetPos, delta * 2);
      state.camera.lookAt(0, 0, 0);
      return;
    }

    // --- VISTA INTERIOR (FIRST PERSON) ---
    const speed = 25; // Ajusta la velocidad de caminata aquí

    // Calculamos dirección basada en las teclas
    // En Three.js, hacia adelante es -Z, por eso invertimos la lógica aquí:
    direction.current.z = Number(moveBackward) - Number(moveForward);
    direction.current.x = Number(moveRight) - Number(moveLeft);
    direction.current.normalize();

    // Aplicar velocidad con suavizado (delta para consistencia de frames)
    if (moveForward || moveBackward)
      velocity.current.z = direction.current.z * speed * delta;
    if (moveLeft || moveRight)
      velocity.current.x = direction.current.x * speed * delta;

    // Traducir la cámara en su espacio local (hacia donde mira)
    state.camera.translateX(velocity.current.x);
    state.camera.translateZ(velocity.current.z);

    // Fricción para que no deslice infinitamente
    velocity.current.multiplyScalar(0.85);

    // Bloqueo de altura y límites de las paredes del pasillo
    state.camera.position.y = 1.7; // Altura de ojos fija
    state.camera.position.x = THREE.MathUtils.clamp(
      state.camera.position.x,
      -4.2,
      4.2,
    );
    state.camera.position.z = THREE.MathUtils.clamp(
      state.camera.position.z,
      -19,
      19,
    );
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={45} />

      {/* Selector de controles: Orbit para el mapa, PointerLock para el interior */}
      {!isInside ? (
        <OrbitControls
          makeDefault
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
        />
      ) : (
        <PointerLockControls />
      )}

      {/* Iluminación Dinámica */}
      <ambientLight intensity={0.6} />

      {!isInside ? (
        <group>
          <directionalLight
            position={[50, 50, 20]}
            intensity={2.5}
            castShadow
          />
          <Sky sunPosition={[100, 20, 100]} />
          <City />
          <Hotspots onZoneSelect={onZoneSelect} activeZone={activeZone} />
        </group>
      ) : (
        <group>
          {/* Ambiente de callejón con estrellas y luz de techo */}
          <MemoryHallway />
          <rectAreaLight
            width={12}
            height={40}
            intensity={6}
            position={[0, 9, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            color="#ffffff"
          />
          <Stars radius={50} count={3000} factor={4} fade speed={1} />
        </group>
      )}
    </>
  );
};

export default Experience;
