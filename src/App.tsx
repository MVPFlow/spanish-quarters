import { useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { AudioManager } from "./components/AudioManager";
import { HelpOverlay } from "./components/HelpOverlay";
import Experience from "./components/Experience";
import Overlay from "./components/Overlay";
import { Zone, ViewState } from "./types";
import "./styles/index.css";

function App() {
  const [view, setView] = useState<ViewState>("aerial");
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const [centerMapTick, setCenterMapTick] = useState(0);
  const [zones, setZones] = useState<Zone[]>([]);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [isMobileUi, setIsMobileUi] = useState(false);
  const [mobileInput, setMobileInput] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    turnLeft: false,
    turnRight: false,
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const update = () => setIsMobileUi(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const handleBackToMap = useCallback(() => {
    setView("aerial");
    setActiveZone(null);
    setMobileInput({
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      turnLeft: false,
      turnRight: false,
    });
  }, []);

  const handleEnterZone = () => {
    setMobileInput({
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      turnLeft: false,
      turnRight: false,
    });
    setView("inside");
  };
  const handleCenterMap = () => setCenterMapTick((value) => value + 1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (helpOpen) {
          setHelpOpen(false);
          return;
        }
        handleBackToMap();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBackToMap, helpOpen]);

  return (
    <div className="container">
      <Canvas
        shadows
        camera={{ position: [50, 50, 50], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <color attach="background" args={["#050505"]} />
        <AudioManager
          view={view}
          activeZone={activeZone}
          muted={audioMuted}
          unlocked={audioUnlocked}
          onUnlock={() => setAudioUnlocked(true)}
        />
        <Experience
          view={view}
          activeZone={activeZone}
          onZoneSelect={setActiveZone}
          onCenterMap={centerMapTick}
          onZonesChange={setZones}
          audioMuted={audioMuted}
          audioUnlocked={audioUnlocked}
          mobileInput={mobileInput}
        />
      </Canvas>

      <Overlay
        view={view}
        activeZone={activeZone}
        isMobileUi={isMobileUi}
        mobileInput={mobileInput}
        onMobileInputChange={setMobileInput}
        onStart={handleEnterZone}
        onBack={handleBackToMap}
        onCenterMap={handleCenterMap}
        zones={zones}
        onZonePick={setActiveZone}
        audioMuted={audioMuted}
        onToggleAudio={() => setAudioMuted((value) => !value)}
        onToggleHelp={() => setHelpOpen((value) => !value)}
      />
      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

export default App;
