import { useRef, useEffect, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  PointerLockControls,
  OrbitControls,
  PerspectiveCamera,
  Html,
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
  const { camera } = useThree();
  const isInside = view === "inside";
  const controlsRef = useRef<any>(null);

  const { moveForward, moveBackward, moveLeft, moveRight } = useKeyboard();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // FIX CRÍTICO: Resetear la cámara al entrar para mirar al frente (no al piso)
  useEffect(() => {
    if (isInside) {
      // Posicionamos la cámara al inicio y la obligamos a mirar al fondo del eje Z
      camera.position.set(0, 1.7, 18);
      camera.lookAt(0, 1.7, -100);
    }
  }, [isInside, camera]);

  useFrame((state, delta) => {
    if (!isInside) {
      const targetPos = new THREE.Vector3(60, 60, 60);
      state.camera.position.lerp(targetPos, delta * 2);
      state.camera.lookAt(0, 0, 0);
      return;
    }

    // Movimiento FPS
    const speed = 25;
    direction.current.z = Number(moveBackward) - Number(moveForward);
    direction.current.x = Number(moveRight) - Number(moveLeft);
    direction.current.normalize();

    if (moveForward || moveBackward)
      velocity.current.z = direction.current.z * speed * delta;
    if (moveLeft || moveRight)
      velocity.current.x = direction.current.x * speed * delta;

    state.camera.translateX(velocity.current.x);
    state.camera.translateZ(velocity.current.z);
    velocity.current.multiplyScalar(0.85);

    // Mantener nivel de ojos y colisiones laterales
    state.camera.position.y = 1.7;
    state.camera.position.x = THREE.MathUtils.clamp(
      state.camera.position.x,
      -4,
      4,
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

      {!isInside ? (
        <OrbitControls
          makeDefault
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
        />
      ) : (
        <PointerLockControls />
      )}

      <ambientLight intensity={0.4} />

      {!isInside ? (
        <group>
          <directionalLight
            position={[50, 50, 20]}
            intensity={2.5}
            castShadow
          />
          <City />
          <Hotspots onZoneSelect={onZoneSelect} activeZone={activeZone} />
        </group>
      ) : (
        <group>
          {/* Atmósfera Urbana: Niebla y Luces de Ciudad */}
          <fog attach="fog" args={["#050505", 5, 35]} />

          <Suspense
            fallback={
              <Html center>
                <div style={{ color: "white" }}>CARGANDO...</div>
              </Html>
            }
          >
            <MemoryHallway />
          </Suspense>

          {/* Luz principal del callejón */}
          <rectAreaLight
            width={10}
            height={40}
            intensity={10}
            position={[0, 9, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            color="#ffffff"
          />

          {/* Luces de ciudad distantes para dar profundidad */}
          <pointLight
            position={[30, 20, -40]}
            intensity={20}
            color="#ffaa00"
            distance={100}
          />
          <pointLight
            position={[-30, 15, -40]}
            intensity={15}
            color="#0055ff"
            distance={100}
          />
        </group>
      )}
    </>
  );
};

export default Experience;
