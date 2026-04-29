import { useEffect, useMemo, useState } from "react";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Zone } from "../types";

const CITY_MODEL_URL = "/models/quartieri_spagnoli_interactive.glb";
const CITY_SCALE = 0.35;

type PoiDescriptor = {
  name: string;
  object: THREE.Mesh;
  markerPosition: THREE.Vector3;
};

type VirtualPoi = {
  id: string;
  name: string;
  description: string;
  type: "memory";
  featured: true;
  district: string;
  position: [number, number, number];
};

interface InteractiveCityProps {
  onZoneSelect: (zone: Zone) => void;
  activeZone: Zone | null;
  onZonesChange: (zones: Zone[]) => void;
}

export const InteractiveCity = ({
  onZoneSelect,
  activeZone,
  onZonesChange,
}: InteractiveCityProps) => {
  const gltf = useGLTF(CITY_MODEL_URL);
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.name === "city_base") {
        mesh.receiveShadow = true;
      }
      if (mesh.name.startsWith("poi_qs_")) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.interactive = true;
      }
    });
    return cloned;
  }, [gltf.scene]);

  const specialPoi = useMemo<VirtualPoi>(() => {
    const bounds = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    bounds.getCenter(center);
    const adjusted = new THREE.Vector3(center.x, bounds.max.y + 0.12, center.z);

    return {
      id: "poi_spanish_quarter_memory",
      name: "Spanish Quarter Memory",
      description:
        "Un percorso visivo tra ricordi, strade e atmosfere dei Quartieri Spagnoli.",
      type: "memory",
      featured: true,
      district: "quartieri_spagnoli",
      position: [adjusted.x, adjusted.y, adjusted.z],
    };
  }, [scene]);

  const poiMeshes = useMemo(() => {
    const hits: PoiDescriptor[] = [];
    scene.updateMatrixWorld(true);
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh || !mesh.name.startsWith("poi_qs_")) return;

      const bounds = new THREE.Box3().setFromObject(mesh);
      const markerPosition = new THREE.Vector3(
        (bounds.min.x + bounds.max.x) / 2,
        bounds.max.y + 0.7,
        (bounds.min.z + bounds.max.z) / 2,
      );

      hits.push({
        name: mesh.name,
        object: mesh,
        markerPosition,
      });
    });
    return hits;
  }, [scene]);

  useEffect(() => {
    const zones: Zone[] = poiMeshes.map(({ object }) => {
      const position = new THREE.Vector3();
      object.getWorldPosition(position);

      return {
        id: object.name,
        name: object.userData.poi_name || object.name,
        description: "Punto di interesse dei Quartieri Spagnoli.",
        position: [position.x, position.y, position.z],
        type: "poi",
        district: "quartieri_spagnoli",
      };
    });

    zones.unshift({
      id: "poi_spanish_quarter_memory",
      name: "Spanish Quarter Memory",
      description:
        "Un percorso visivo tra ricordi, strade e atmosfere dei Quartieri Spagnoli.",
      position: specialPoi.position,
      type: "memory",
      featured: true,
      district: "quartieri_spagnoli",
    });

    onZonesChange(zones);
  }, [onZonesChange, poiMeshes, specialPoi.position]);

  useEffect(() => {
    document.body.style.cursor = hoveredName ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hoveredName]);

  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh || !mesh.name.startsWith("poi_qs_")) return;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((material) => {
        if (!("color" in material)) return;

        const mat = material as THREE.MeshStandardMaterial;
        if (!mat.userData.baseColor) {
          mat.userData.baseColor = new THREE.Color("#ff3b30");
          mat.userData.baseEmissive = mat.emissive.clone();
          mat.userData.baseEmissiveIntensity = mat.emissiveIntensity;
        }

        const isHovered = hoveredName === mesh.name;
        const isActive = activeZone?.id === mesh.name;

        mat.color.copy(mat.userData.baseColor);
        mat.emissive.copy(mat.userData.baseEmissive);
        mat.emissiveIntensity = mat.userData.baseEmissiveIntensity ?? 0;
        mesh.scale.setScalar(isHovered ? 1.08 : isActive ? 1.04 : 1);

        if (isHovered) {
          mat.color.set("#ffdd88");
          mat.emissive.set("#ffb347");
          mat.emissiveIntensity = 2.2;
        } else if (isActive) {
          mat.color.set("#ff9f43");
          mat.emissive.set("#ff7a18");
          mat.emissiveIntensity = 1.6;
        }

        mat.needsUpdate = true;
      });
    });
  }, [activeZone?.id, hoveredName, scene]);

  const handleZoneSelect = (mesh: THREE.Mesh) => {
    const position = new THREE.Vector3();
    mesh.getWorldPosition(position);

    onZoneSelect({
      id: mesh.name,
      name: mesh.userData.poi_name || mesh.name,
      description: "Punto di interesse dei Quartieri Spagnoli.",
      position: [position.x, position.y, position.z],
    });
  };

  const handleSpecialSelect = () => {
    onZoneSelect({
      id: specialPoi.id,
      name: specialPoi.name,
      description: specialPoi.description,
      position: specialPoi.position,
      type: specialPoi.type,
      featured: specialPoi.featured,
      district: specialPoi.district,
    });
  };

  return (
    <group scale={CITY_SCALE}>
      <primitive object={scene} />

      <SpecialMemoryStreetMarker
        position={specialPoi.position}
        onHoverChange={setHoveredName}
        onSelect={handleSpecialSelect}
      />

      {poiMeshes.map(({ name, object, markerPosition }) => (
        <group key={object.uuid}>
          <mesh
            geometry={object.geometry}
            matrix={object.matrixWorld}
            matrixAutoUpdate={false}
            onPointerOver={(event) => {
              event.stopPropagation();
              setHoveredName(name);
            }}
            onPointerOut={(event) => {
              event.stopPropagation();
              setHoveredName(null);
            }}
            onClick={(event) => {
              event.stopPropagation();
              handleZoneSelect(object);
            }}
          >
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <group position={markerPosition}>
            <Html
              center
              distanceFactor={25}
              transform
              occlude
              style={{ pointerEvents: "none" }}
            >
              <div className="poi-marker">
                <div className="poi-marker__arrow" />
                <div className="poi-marker__label">
                  {object.userData.poi_name || object.name}
                </div>
              </div>
            </Html>
          </group>
        </group>
      ))}
    </group>
  );
};

useGLTF.preload(CITY_MODEL_URL);

interface SpecialMemoryStreetMarkerProps {
  position: [number, number, number];
  onHoverChange: (name: string | null) => void;
  onSelect: () => void;
}

const SpecialMemoryStreetMarker = ({
  position,
  onHoverChange,
  onSelect,
}: SpecialMemoryStreetMarkerProps) => {
  return (
    <group position={position}>
      <mesh
        name="poi_spanish_quarter_memory_marker"
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHoverChange("poi_spanish_quarter_memory");
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHoverChange(null);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
      >
        <planeGeometry args={[6, 0.35]} />
        <meshStandardMaterial
          color="#1e7bff"
          emissive="#2b8cff"
          emissiveIntensity={2.2}
          transparent
          opacity={0.78}
          roughness={0.2}
          metalness={0.2}
        />
      </mesh>
      <Html center distanceFactor={25} transform style={{ pointerEvents: "none" }}>
        <div className="poi-marker poi-marker--special">
          <div className="poi-marker__arrow poi-marker__arrow--special" />
          <div className="poi-marker__label">Spanish Quarter Memory</div>
        </div>
      </Html>
    </group>
  );
};
