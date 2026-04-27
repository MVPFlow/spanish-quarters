import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Overlay from "./components/Overlay";
import "./styles/index.css";

export type Zone = {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
};

function App() {
  const [view, setView] = useState<"aerial" | "transitioning">("aerial");
  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  const handleZoneClick = (zone: Zone) => {
    setActiveZone(zone);
    // Preparado para el zoom cinematográfico de la siguiente fase
    console.log("Navegando a:", zone.name);
  };

  return (
    <div className="container">
      <Canvas shadows camera={{ position: [50, 50, 50], fov: 45 }}>
        <color attach="background" args={["#0a0a0a"]} />
        <Experience
          view={view}
          onZoneSelect={handleZoneClick}
          activeZone={activeZone}
        />
      </Canvas>

      <Overlay
        view={view}
        activeZone={activeZone}
        onStart={() => setView("transitioning")}
      />
    </div>
  );
}

export default App;
