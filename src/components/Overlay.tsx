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
      {/* HEADER: Solo visible en la vista aérea */}
      <header className={isInside ? "hidden" : ""}>
        <h1>SPANISH QUARTER</h1>
        <p>Una inmersión en la memoria cultural</p>
      </header>

      {/* PANEL DE INFORMACIÓN: Aparece al seleccionar un hotspot en el mapa */}
      {activeZone && !isInside && (
        <div className="zone-panel">
          <h2>{activeZone.name}</h2>
          <p>{activeZone.description}</p>
          <button className="cta-btn primary" onClick={onStart}>
            INICIAR RECORRIDO
          </button>
        </div>
      )}

      {/* INTERFAZ INTERIOR: Mini-mapa y controles FPS */}
      {isInside && (
        <>
          <div className="nav-top">
            <button className="cta-btn secondary" onClick={onBack}>
              ← VOLVER AL MAPA
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
              Haz <strong>CLIC</strong> en la pantalla para mirar
            </p>
            <p>
              <strong>WASD</strong> o <strong>FLECHAS</strong> para caminar
            </p>
            <p>
              <strong>ESC</strong> para liberar el mouse o salir
            </p>
          </div>
        </>
      )}

      {/* PISTA INICIAL: Solo si no hay nada seleccionado */}
      {!activeZone && !isInside && (
        <div className="hint-text">
          Explora el laberinto y selecciona un punto brillante
        </div>
      )}

      {/* FOOTER: Estado técnico de la fase */}
      {!isInside && (
        <div
          className="footer-info"
          style={{ opacity: 0.3, fontSize: "0.7rem", letterSpacing: "2px" }}
        >
          FASE 5: NAVEGACIÓN EN PRIMERA PERSONA
        </div>
      )}
    </div>
  );
};

export default Overlay;
