import { Html, useProgress } from "@react-three/drei";

export const GlobalLoader = ({ forceVisible = false }: { forceVisible?: boolean }) => {
  const { active, progress, item } = useProgress();

  if (!active && !forceVisible) return null;

  return (
    <Html fullscreen>
      <div className="global-loader global-loader--fullscreen" role="status" aria-live="polite">
        <div className="global-loader__card">
          <div className="global-loader__spinner" />
          <div className="global-loader__text">
            <span>CARICAMENTO</span>
            <strong>{`${Math.round(active ? progress : 0)}%`}</strong>
          </div>
          <div className="global-loader__item">{item || "Preparando experiencia"}</div>
        </div>
      </div>
    </Html>
  );
};
