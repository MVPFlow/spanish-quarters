import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const CITY_MODEL_URL = "/models/quartieri_spagnoli_interactive.glb";
const CITY_SCALE = 0.35;

export const City = () => {
  const gltf = useGLTF(CITY_MODEL_URL);

  const scene = useMemo(() => {
    gltf.scene.traverse((object) => {
      const mesh = object as THREE.Object3D & {
        castShadow?: boolean;
        receiveShadow?: boolean;
        userData: { interactive?: boolean };
      };

      if (mesh.name === "city_base") {
        mesh.receiveShadow = true;
      }

      if (mesh.name.startsWith("poi_qs_")) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.interactive = true;
      }
    });

    return gltf.scene;
  }, [gltf.scene]);

  return (
    <group scale={CITY_SCALE}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload(CITY_MODEL_URL);
