import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Zone, ViewState } from "../types";

type MobileInputState = {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  turnLeft: boolean;
  turnRight: boolean;
};

interface OverlayProps {
  view: ViewState;
  activeZone: Zone | null;
  zones: Zone[];
  isMobileUi: boolean;
  mobileInput: MobileInputState;
  onMobileInputChange: Dispatch<SetStateAction<MobileInputState>>;
  onStart: () => void;
  onBack: () => void;
  onCenterMap: () => void;
  onZonePick: (zone: Zone) => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
  onToggleHelp: () => void;
}

const WORKSHOP_VIDEO_URL = "/assets/quarters-memory.mp4";

const Overlay = ({
  view,
  activeZone,
  zones,
  isMobileUi,
  mobileInput,
  onMobileInputChange,
  onStart,
  onBack,
  onCenterMap,
  onZonePick,
  audioMuted,
  onToggleAudio,
  onToggleHelp,
}: OverlayProps) => {
  const isInside = view === "inside";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileHelpOpen, setIsMobileHelpOpen] = useState(false);
  const [isWorkshopVideoOpen, setIsWorkshopVideoOpen] = useState(false);

  const sortedZones = useMemo(
    () =>
      [...zones].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name);
      }),
    [zones],
  );

  const handlePick = (zone: Zone) => {
    onZonePick(zone);
    setIsMenuOpen(false);
  };

  return (
    <div className={`ui-layer ${isInside ? "ui-inside" : ""}`}>
      <header className={isInside ? "hidden" : ""}>
        <h1>THE SPANISH QUARTERS</h1>
        <p>MEMORIA CULTURALE IMMERSIVA</p>
      </header>

      {activeZone && !isInside && (
        <div className="zone-panel">
          <h2>{activeZone.name}</h2>
          <p>{activeZone.description}</p>
          <button className="cta-btn primary" onClick={onStart}>
            ENTRA NEL VICOLO
          </button>
        </div>
      )}

      {isInside &&
        (isMobileUi ? (
          <div className="mobile-hud">
            <div className="mobile-hud__top">
              <button className="cta-btn secondary cta-btn--compact" onClick={onBack}>
                MAPPA
              </button>

              <div className="mobile-hud__meta">
                <span className="mobile-hud__title">{activeZone?.name}</span>
                <button
                  className="cta-btn secondary cta-btn--compact"
                  onClick={() => setIsMenuOpen((value) => !value)}
                >
                  MENU
                </button>
                <button
                  className="cta-btn secondary cta-btn--compact"
                  onClick={() => setIsMobileHelpOpen((value) => !value)}
                >
                  {isMobileHelpOpen ? "CHIUDI AIUTO" : "AIUTO"}
                </button>
              </div>
            </div>

            {isMenuOpen && (
              <div className="zones-menu zones-menu--mobile">
                <div className="zones-menu__header">
                  <h3>Luoghi</h3>
                  <button className="zones-menu__close" onClick={() => setIsMenuOpen(false)}>
                    Chiudi
                  </button>
                </div>
                <div className="zones-menu__list">
                  {sortedZones.slice(0, 6).map((zone) => (
                    <button
                      key={zone.id}
                      className={`zones-menu__item ${
                        activeZone?.id === zone.id ? "is-active" : ""
                      }`}
                      onClick={() => handlePick(zone)}
                    >
                      <span>{zone.name}</span>
                      {zone.featured && <strong>IN EVIDENZA</strong>}
                    </button>
                  ))}
                  <button
                    className="zones-menu__item zones-menu__item--video"
                    onClick={() => {
                      setIsWorkshopVideoOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <span>Accesso diretto al video del laboratorio</span>
                    <strong>VIDEO COMPLETO</strong>
                  </button>
                </div>
              </div>
            )}

            {isMobileHelpOpen && (
              <div className="mobile-help-panel">
                <p>Controlli a destra: tieni premuto per muoverti.</p>
                <p>Usa MENU per scegliere i luoghi rapidamente.</p>
                <p>MAPPA ti riporta indietro alla vista generale.</p>
              </div>
            )}

            <MobileControls
              mobileInput={mobileInput}
              onMobileInputChange={onMobileInputChange}
            />
          </div>
        ) : (
          <>
            <div className="nav-top">
              <button className="cta-btn secondary" onClick={onBack}>
                TORNA ALLA MAPPA
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
                Guarda con il <strong>MOUSE</strong>
              </p>
              <p>
                Muoviti con <strong>WASD</strong>
              </p>
              <p>
                <strong>ESC</strong> per liberare il puntatore
              </p>
            </div>
          </>
        ))}

      {!activeZone && !isInside && (
        <div className="hint-text">
          Seleziona un punto storico per entrare nella sua memoria
        </div>
      )}

      {!isInside && (
        <div className="map-actions">
          <button className="cta-btn secondary" onClick={onToggleAudio}>
            {audioMuted ? "Audio disattivato" : "Audio attivo"}
          </button>
          <button className="cta-btn secondary" onClick={onCenterMap}>
            CENTRA MAPPA
          </button>
          <button
            className="cta-btn secondary"
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            MENU
          </button>
          <button className="cta-btn secondary" onClick={onToggleHelp}>
            Aiuto
          </button>
        </div>
      )}

      {!isInside && (
        <footer className="main-footer">
          <span>2026 made with love by </span>
          <a
            href="https://github.com/theghost1980"
            target="_blank"
            rel="noreferrer"
          >
            theghost1980
          </a>
        </footer>
      )}

      {!isInside && isMenuOpen && (
        <div className="zones-menu">
          <div className="zones-menu__header">
            <h3>Luoghi di interesse</h3>
            <button
              className="zones-menu__close"
              onClick={() => setIsMenuOpen(false)}
            >
              Chiudi
            </button>
          </div>
          <div className="zones-menu__list">
            {sortedZones.map((zone) => (
              <button
                key={zone.id}
                className={`zones-menu__item ${
                  activeZone?.id === zone.id ? "is-active" : ""
                }`}
                onClick={() => handlePick(zone)}
              >
                <span>{zone.name}</span>
                {zone.featured && <strong>IN EVIDENZA</strong>}
              </button>
            ))}
            <button
              className="zones-menu__item zones-menu__item--video"
              onClick={() => {
                setIsWorkshopVideoOpen(true);
                setIsMenuOpen(false);
              }}
            >
              <span>Accesso diretto al video del laboratorio</span>
              <strong>VIDEO COMPLETO</strong>
            </button>
          </div>
        </div>
      )}

      {isWorkshopVideoOpen && (
        <div className="workshop-video-modal" onClick={() => setIsWorkshopVideoOpen(false)}>
          <div className="workshop-video-modal__panel" onClick={(e) => e.stopPropagation()}>
            <div className="workshop-video-modal__header">
              <h3>Video del laboratorio</h3>
              <button
                className="zones-menu__close"
                onClick={() => setIsWorkshopVideoOpen(false)}
              >
                Chiudi
              </button>
            </div>
            <video
              className="workshop-video-modal__video"
              src={WORKSHOP_VIDEO_URL}
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Overlay;

const MobileControls = ({
  mobileInput,
  onMobileInputChange,
}: {
  mobileInput: MobileInputState;
  onMobileInputChange: Dispatch<SetStateAction<MobileInputState>>;
}) => {
  const setAction = (key: keyof MobileInputState, value: boolean) => {
    onMobileInputChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mobile-controls" aria-label="Controlli mobili">
      <div className="mobile-controls__stack">
        <button
          className={`mobile-controls__btn ${mobileInput.turnLeft ? "is-active" : ""}`}
          aria-label="Gira a sinistra"
          onPointerDown={() => setAction("turnLeft", true)}
          onPointerUp={() => setAction("turnLeft", false)}
          onPointerCancel={() => setAction("turnLeft", false)}
        >
          ←
        </button>
        <button
          className={`mobile-controls__btn ${mobileInput.moveForward ? "is-active" : ""}`}
          aria-label="Cammina avanti"
          onPointerDown={() => setAction("moveForward", true)}
          onPointerUp={() => setAction("moveForward", false)}
          onPointerCancel={() => setAction("moveForward", false)}
        >
          ↑
        </button>
        <button
          className={`mobile-controls__btn ${mobileInput.moveBackward ? "is-active" : ""}`}
          aria-label="Cammina indietro"
          onPointerDown={() => setAction("moveBackward", true)}
          onPointerUp={() => setAction("moveBackward", false)}
          onPointerCancel={() => setAction("moveBackward", false)}
        >
          ↓
        </button>
        <button
          className={`mobile-controls__btn ${mobileInput.moveLeft ? "is-active" : ""}`}
          aria-label="Sposta a sinistra"
          onPointerDown={() => setAction("moveLeft", true)}
          onPointerUp={() => setAction("moveLeft", false)}
          onPointerCancel={() => setAction("moveLeft", false)}
        >
          ←
        </button>
        <button
          className={`mobile-controls__btn ${mobileInput.moveRight ? "is-active" : ""}`}
          aria-label="Sposta a destra"
          onPointerDown={() => setAction("moveRight", true)}
          onPointerUp={() => setAction("moveRight", false)}
          onPointerCancel={() => setAction("moveRight", false)}
        >
          →
        </button>
        <button
          className={`mobile-controls__btn ${mobileInput.turnRight ? "is-active" : ""}`}
          aria-label="Gira a destra"
          onPointerDown={() => setAction("turnRight", true)}
          onPointerUp={() => setAction("turnRight", false)}
          onPointerCancel={() => setAction("turnRight", false)}
        >
          →
        </button>
      </div>
    </div>
  );
};
