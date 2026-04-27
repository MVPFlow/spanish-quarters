import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Overlay from "./components/Overlay";
import { Zone, ViewState } from "./types";
import "./styles/index.css";

function App() {
  const [view, setView] = useState<ViewState>("aerial");
  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  const handleEnterZone = () => setView("inside");
  const handleBackToMap = () => {
    setView("aerial");
    setActiveZone(null);
  };

  return (
    <div className="container">
      <Canvas
        shadows
        camera={{ position: [50, 50, 50], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#050505"]} />
        <Experience
          view={view}
          activeZone={activeZone}
          onZoneSelect={setActiveZone}
        />
      </Canvas>

      <Overlay
        view={view}
        activeZone={activeZone}
        onStart={handleEnterZone}
        onBack={handleBackToMap}
      />
    </div>
  );
}

export default App;
