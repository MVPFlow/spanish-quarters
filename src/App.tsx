import { useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Overlay from "./components/Overlay";
import { Zone, ViewState } from "./types";
import "./styles/index.css";

function App() {
  const [view, setView] = useState<ViewState>("aerial");
  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  // Memorizamos la función de retroceso para usarla en el evento de teclado
  const handleBackToMap = useCallback(() => {
    if (view === "inside" || activeZone) {
      setView("aerial");
      setActiveZone(null);
      console.log("Navegación: Regresando al mapa global");
    }
  }, [view, activeZone]);

  const handleEnterZone = () => setView("inside");

  // Listener para la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleBackToMap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Limpieza del evento al desmontar el componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleBackToMap]);

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
