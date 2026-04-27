import { OrbitControls, Sky, ContactShadows } from "@react-three/drei";
import { City } from "./City";
import { Hotspots } from "./Hotspots";
import { Zone } from "../App";

interface ExperienceProps {
  view: "aerial" | "transitioning";
  onZoneSelect: (zone: Zone) => void;
  activeZone: Zone | null;
}

const Experience = ({ view, onZoneSelect, activeZone }: ExperienceProps) => {
  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={view === "aerial"}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={20}
        maxDistance={100}
      />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#fff" />
      <directionalLight position={[-20, 50, 10]} intensity={1} castShadow />

      <City />
      <Hotspots onZoneSelect={onZoneSelect} activeZone={activeZone} />

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={100}
        blur={2.4}
      />
    </>
  );
};

export default Experience;
