import { Zone } from "../types";

interface OverlayProps {
  view: "aerial" | "transitioning" | "inside";
  activeZone: Zone | null;
  onStart: () => void;
  onBack: () => void;
}

const Overlay = ({ view, activeZone, onStart, onBack }: OverlayProps) => {
  const isInside = view === "inside";

  return (
    <div className={`ui-layer ${isInside ? "ui-minimal" : ""}`}>
      <header className={isInside ? "hidden" : ""}>
        <h1>SPANISH QUARTER</h1>
        <p>Experiencia de Memoria Cultural</p>
      </header>

      {/* Info de zona y botón de entrada */}
      {activeZone && !isInside && (
        <div className="zone-panel">
          <h2>{activeZone.name}</h2>
          <p>{activeZone.description}</p>
          <button className="cta-btn primary" onClick={onStart}>
            DESCUBRIR HISTORIA
          </button>
        </div>
      )}

      {/* Interfaz cuando ya estás "dentro" */}
      {isInside && (
        <div className="inside-ui">
          <button className="cta-btn secondary" onClick={onBack}>
            ← VOLVER AL MAPA
          </button>
          <div className="location-tag">
            ZONA: <span>{activeZone?.name}</span>
          </div>
        </div>
      )}

      {!activeZone && !isInside && (
        <div className="hint-text">
          Explora el laberinto y selecciona un punto
        </div>
      )}
    </div>
  );
};

export default Overlay;
