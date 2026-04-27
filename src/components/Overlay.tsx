import { Zone } from "../App";

interface OverlayProps {
  view: string;
  activeZone: Zone | null;
  onStart: () => void;
}

const Overlay = ({ view, activeZone, onStart }: OverlayProps) => {
  return (
    <div className={`ui-layer ${view !== "aerial" ? "fade-out" : ""}`}>
      <header>
        <h1>SPANISH QUARTER</h1>
        <p>Explora la memoria de la ciudad</p>
      </header>

      {activeZone && (
        <div className="zone-info">
          <h2>{activeZone.name}</h2>
          <p>{activeZone.description}</p>
          <button className="enter-btn" onClick={onStart}>
            ENTRAR EN LA ZONA
          </button>
        </div>
      )}

      {!activeZone && (
        <div className="hint">
          Selecciona un punto brillante en el mapa para comenzar
        </div>
      )}

      <div className="footer-info">FASE 2: SISTEMA DE INTERACCIÓN</div>
    </div>
  );
};

export default Overlay;
