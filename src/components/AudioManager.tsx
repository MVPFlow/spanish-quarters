import { useEffect, useMemo, useRef } from "react";
import { Zone, ViewState } from "../types";

const MAP_AUDIO_URL = "/audio/Voci_sul_selciato.mp3";
const MAP_VOLUME = 0.16;

interface AudioManagerProps {
  view: ViewState;
  activeZone: Zone | null;
  muted: boolean;
  unlocked: boolean;
  onUnlock: () => void;
}

const fadeAudio = (
  audio: HTMLAudioElement,
  targetVolume: number,
  durationMs = 700,
) => {
  const startVolume = audio.volume;
  const start = performance.now();
  const safeTargetVolume = Math.min(1, Math.max(0, targetVolume));

  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / durationMs);
    const nextVolume =
      startVolume + (safeTargetVolume - startVolume) * progress;
    audio.volume = Math.min(1, Math.max(0, nextVolume));
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

export const AudioManager = ({
  view,
  activeZone: _activeZone,
  muted,
  unlocked,
  onUnlock,
}: AudioManagerProps) => {
  const mapAudioRef = useRef<HTMLAudioElement | null>(null);
  const isInside = view === "inside";

  const createAudio = useMemo(
    () => () => {
      const audio = new Audio(MAP_AUDIO_URL);
      audio.loop = true;
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      audio.volume = 0;
      return audio;
    },
    [],
  );

  useEffect(() => {
    const audio = createAudio();
    mapAudioRef.current = audio;

    const unlockAudio = () => {
      onUnlock();
      if (!muted && !isInside) {
        requestAnimationFrame(() => {
          void audio.play().catch(() => undefined);
        });
      }
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);
    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
      audio.pause();
      audio.src = "";
      mapAudioRef.current = null;
    };
  }, [createAudio, isInside, muted, onUnlock]);

  useEffect(() => {
    const audio = mapAudioRef.current;
    if (!audio) return;

    const target = !isInside && !muted && unlocked ? MAP_VOLUME : 0;
    if (target > 0 && audio.paused) {
      void audio.play().catch(() => undefined);
    }

    fadeAudio(audio, target, 800);
    if (target === 0) {
      window.setTimeout(() => audio.pause(), 850);
    }
  }, [isInside, muted, unlocked]);

  return null;
};
