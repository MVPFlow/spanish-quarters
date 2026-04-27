import { useState } from "react";
import { Html } from "@react-three/drei";
import { Zone } from "../App";

const ZONES: Zone[] = [
  {
    id: "toledo",
    name: "Via Toledo",
    description: "El eje comercial y latido del barrio.",
    position: [-15, 8, 10],
  },
  {
    id: "maradona",
    name: "Murale di Maradona",
    description: "Santuario de la cultura popular.",
    position: [5, 10, -5],
  },
  {
    id: "piazza",
    name: "Piazza del Plebiscito",
    description: "La gran apertura hacia el mar.",
    position: [20, 6, 20],
  },
];

interface HotspotsProps {
  onZoneSelect: (zone: Zone) => void;
  activeZone: Zone | null;
}

export const Hotspots = ({ onZoneSelect, activeZone }: HotspotsProps) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <group>
      {ZONES.map((zone) => {
        const isHovered = hovered === zone.id;
        const isActive = activeZone?.id === zone.id;

        return (
          <group key={zone.id} position={zone.position}>
            {/* Punto interactivo */}
            <mesh
              onPointerOver={() => setHovered(zone.id)}
              onPointerOut={() => setHovered(null)}
              onClick={() => onZoneSelect(zone)}
            >
              <sphereGeometry
                args={[isHovered || isActive ? 1.2 : 0.8, 32, 32]}
              />
              <meshStandardMaterial
                emissive={isActive ? "#ff3e00" : "#fff"}
                emissiveIntensity={isHovered ? 5 : 2}
                color={isActive ? "#ff3e00" : "#fff"}
              />
            </mesh>

            {/* Etiqueta HTML */}
            <Html distanceFactor={40} position={[0, 2, 0]} center>
              <div
                className={`hotspot-label ${isHovered || isActive ? "visible" : ""}`}
              >
                {zone.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
