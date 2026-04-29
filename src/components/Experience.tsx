import { useRef, useEffect, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  PointerLockControls,
  OrbitControls,
  PerspectiveCamera,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { MemoryHallway } from "./MemoryHallway";
import { InteractiveCity } from "./InteractiveCity";
import { Zone, ViewState } from "../types";
import { useKeyboard } from "../hooks/useKeyboard";

interface ExperienceProps {
  view: ViewState;
  activeZone: Zone | null;
  onZoneSelect: (zone: Zone | null) => void;
  onCenterMap: number;
  onZonesChange: (zones: Zone[]) => void;
  audioMuted: boolean;
  audioUnlocked: boolean;
  mobileInput: {
    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    turnLeft: boolean;
    turnRight: boolean;
  };
}

const Experience = ({
  view,
  activeZone,
  onZoneSelect,
  onCenterMap,
  onZonesChange,
  audioMuted,
  audioUnlocked,
  mobileInput,
}: ExperienceProps) => {
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

  useEffect(() => {
    if (isInside) return;
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [onCenterMap, isInside, camera]);

  useFrame((state, delta) => {
    if (!isInside) {
      return;
    }

    const isFeaturedMemory = activeZone?.id === "poi_spanish_quarter_memory";
    const lateralLimit = isFeaturedMemory ? 5.2 : 4;
    const depthLimit = isFeaturedMemory ? 170 : 19;

    // Movimiento FPS
    const speed = 25;
    const forward = moveForward || mobileInput.moveForward;
    const backward = moveBackward || mobileInput.moveBackward;
    const left = moveLeft || mobileInput.moveLeft;
    const right = moveRight || mobileInput.moveRight;
    const turnLeft = mobileInput.turnLeft;
    const turnRight = mobileInput.turnRight;

    if (turnLeft || turnRight) {
      state.camera.rotation.y += (turnRight ? -1 : 1) * delta * 1.2;
    }

    direction.current.z = Number(backward) - Number(forward);
    direction.current.x = Number(right) - Number(left);
    direction.current.normalize();

    if (forward || backward)
      velocity.current.z = direction.current.z * speed * delta;
    if (left || right)
      velocity.current.x = direction.current.x * speed * delta;

    state.camera.translateX(velocity.current.x);
    state.camera.translateZ(velocity.current.z);
    velocity.current.multiplyScalar(0.85);

    // Mantener nivel de ojos y colisiones laterales
    state.camera.position.y = 1.7;
    state.camera.position.x = THREE.MathUtils.clamp(
      state.camera.position.x,
      -lateralLimit,
      lateralLimit,
    );
    state.camera.position.z = THREE.MathUtils.clamp(
      state.camera.position.z,
      -depthLimit,
      depthLimit,
    );
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={45} />

      {!isInside ? (
        <OrbitControls
          makeDefault
          ref={controlsRef}
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
          <InteractiveCity
            onZoneSelect={onZoneSelect}
            activeZone={activeZone}
            onZonesChange={onZonesChange}
          />
        </group>
      ) : (
        <group>
          {/* Atmósfera Urbana: Niebla y Luces de Ciudad */}
          <fog attach="fog" args={["#050505", 5, 35]} />

          <Suspense
            fallback={
              <Html center>
                <div style={{ color: "white" }}>CARICAMENTO...</div>
              </Html>
            }
          >
            <MemoryHallway
              activeZone={activeZone}
              muted={audioMuted}
              unlocked={audioUnlocked}
            />
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
