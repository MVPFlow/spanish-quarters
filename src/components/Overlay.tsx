import { Zone, ViewState } from "../types";

interface OverlayProps {
  view: ViewState;
  activeZone: Zone | null;
  onStart: () => void;
  onBack: () => void;
}

const Overlay = ({ view, activeZone, onStart, onBack }: OverlayProps) => {
  const isInside = view === "inside";

  return (
    <div className={`ui-layer ${isInside ? "ui-inside" : ""}`}>
      <header className={isInside ? "hidden" : ""}>
        <h1>THE SPANISH QUARTERS</h1>
        <p>MEMORIA CULTURAL INMERSIVA</p>
      </header>

      {activeZone && !isInside && (
        <div className="zone-panel">
          <h2>{activeZone.name}</h2>
          <p>{activeZone.description}</p>
          <button className="cta-btn primary" onClick={onStart}>
            EXPLORAR CALLEJÓN
          </button>
        </div>
      )}

      {isInside && (
        <>
          <div className="nav-top">
            <button className="cta-btn secondary" onClick={onBack}>
              ← SALIR AL MAPA
            </button>

            <div className="mini-map">
              <div className="map-grid">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`grid-cell ${i === 4 ? "active" : ""}`}
                  />
                ))}
              </div>
              <span>{activeZone?.name}</span>
            </div>
          </div>

          <div className="walk-hint">
            <p>
              Mira con el <strong>MOUSE</strong>
            </p>
            <p>
              Camina con <strong>WASD</strong>
            </p>
            <p>
              <strong>ESC</strong> para liberar el puntero
            </p>
          </div>
        </>
      )}

      {!activeZone && !isInside && (
        <div className="hint-text">
          Selecciona un punto histórico para entrar en su memoria
        </div>
      )}
    </div>
  );
};

export default Overlay;
