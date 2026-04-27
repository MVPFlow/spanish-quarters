import { useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Overlay from "./components/Overlay";
import { Zone, ViewState } from "./types";
import "./styles/index.css";

function App() {
  const [view, setView] = useState<ViewState>("aerial");
  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  const handleBackToMap = useCallback(() => {
    setView("aerial");
    setActiveZone(null);
  }, []);

  const handleEnterZone = () => setView("inside");

  // Listener para Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleBackToMap();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBackToMap]);

  return (
    <div className="container">
      <Canvas
        shadows
        camera={{ position: [50, 50, 50], fov: 45 }}
        dpr={[1, 2]} // Optimización para pantallas retina
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
