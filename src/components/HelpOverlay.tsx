import { useEffect } from "react";

interface HelpOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const HelpOverlay = ({ open, onClose }: HelpOverlayProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-panel" onClick={(event) => event.stopPropagation()}>
        <div className="help-panel__header">
          <h2>Come usare l'esperienza</h2>
          <button className="help-panel__close" onClick={onClose}>
            Chiudi
          </button>
        </div>

        <section>
          <h3>Mappa</h3>
          <ul>
            <li>Tocca i punti evidenziati per esplorare un luogo.</li>
            <li>Usa il mouse o il tocco per ruotare la scena.</li>
            <li>Il percorso blu apre Spanish Quarter Memory.</li>
          </ul>
        </section>

        <section>
          <h3>Dentro il corridoio</h3>
          <ul>
            <li>Muoviti con WASD o con le frecce mobili in basso.</li>
            <li>Guarda con il mouse o con le frecce di rotazione.</li>
            <li>Tocca i video per riprodurli o metterli in pausa.</li>
            <li>Premi ESC per liberare il puntatore.</li>
            <li>Usa TORNA ALLA MAPPA per uscire.</li>
          </ul>
        </section>

        <section>
          <h3>Audio</h3>
          <ul>
            <li>Premi Audio attivo/disattivato per controllare la musica.</li>
            <li>Nel corridoio il suono cambia in base alla distanza.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
