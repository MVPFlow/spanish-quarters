import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Html, PositionalAudio } from "@react-three/drei";
import * as THREE from "three";
import { MemoryFrame } from "./MemoryFrame";
import { MemoryMedia, Zone } from "../types";
import {
  MemoryAsset,
  SPANISH_MEMORY_ASSETS,
} from "../data/spanishQuarterMemoryAssets";
import { getExternalMediaForPoi } from "../data/poiExternalMedia";

const NORMAL_HALLWAY_LIGHT_INTENSITY = 1.8;
const MEMORY_HALLWAY_LIGHT_INTENSITY = 2.6;
const WALL_COLOR = "#252321";
const FLOOR_COLOR = "#2a2724";
const CEILING_COLOR = "#1c1a18";
const SPECIAL_HALLWAY_SPACING = 8;
const SPECIAL_HALLWAY_MIN_LENGTH = 90;
const SPECIAL_HALLWAY_LIGHT_COUNT = 14;
const EXTERNAL_WALL_OFFSET = 0.08;

const SAMPLE_MEMORIES: MemoryMedia[] = [
  {
    id: "m1",
    title: "Callejón de la Luz",
    url: "https://picsum.photos/id/1015/800/600",
    position: [-4.7, 2.5, -12],
    rotation: [0, Math.PI / 2, 0],
    description: "",
  },
  {
    id: "m2",
    title: "Estructuras",
    url: "https://picsum.photos/id/1016/800/600",
    position: [-4.7, 2.5, 0],
    rotation: [0, Math.PI / 2, 0],
    description: "",
  },
  {
    id: "m3",
    title: "Murales",
    url: "https://picsum.photos/id/1018/800/600",
    position: [4.7, 2.5, -6],
    rotation: [0, -Math.PI / 2, 0],
    description: "",
  },
  {
    id: "m4",
    title: "Tradiciones",
    url: "https://picsum.photos/id/1019/800/600",
    position: [4.7, 2.5, 10],
    rotation: [0, -Math.PI / 2, 0],
    description: "",
  },
];

interface MemoryHallwayProps {
  activeZone?: Zone | null;
  muted: boolean;
  unlocked: boolean;
}

type HallwayMedia = MemoryMedia & { asset?: MemoryAsset };
type ExternalMediaSlot =
  | {
      id: string;
      kind: "image";
      url: string;
      fallbackUrl: string;
      title: string;
      position: [number, number, number];
      rotation: [number, number, number];
    }
  | {
      id: string;
      kind: "video";
      youtubeEmbedUrl: string;
      title: string;
      position: [number, number, number];
      rotation: [number, number, number];
    };

const FALLBACK_IMAGE_POOL = [
  "/assets/1.jpg",
  "/assets/2.jpg",
  "/assets/3.jpg",
  "/assets/4.jpg",
  "/assets/5.jpg",
  "/assets/6.jpg",
  "/assets/7.jpg",
  "/assets/8.jpg",
  "/assets/9.jpg",
  "/assets/10.jpg",
] as const;

export const MemoryHallway = ({
  activeZone,
  muted,
  unlocked,
}: MemoryHallwayProps) => {
  const isFeaturedMemory = activeZone?.id === "poi_spanish_quarter_memory";
  const externalMedia = !isFeaturedMemory
    ? getExternalMediaForPoi(activeZone?.id ?? "")
    : null;
  const hasExternalMedia = Boolean(externalMedia);

  const [videoPlayingCount, setVideoPlayingCount] = useState(0);
  const hallwayAudioRef = useRef<THREE.PositionalAudio | null>(null);
  const mediaAssets = isFeaturedMemory ? SPANISH_MEMORY_ASSETS : [];

  const hallwayLength = isFeaturedMemory
    ? Math.max(
        SPECIAL_HALLWAY_MIN_LENGTH,
        mediaAssets.length * SPECIAL_HALLWAY_SPACING,
      )
    : hasExternalMedia
      ? 72
      : 50;
  const wallHeight = isFeaturedMemory ? 12 : hasExternalMedia ? 11 : 10;
  const ceilingHeight = wallHeight;

  const ceilingLightPositions = useMemo(() => {
    if (!isFeaturedMemory) return [-18, -8, 2, 12];
    const count = Math.max(
      SPECIAL_HALLWAY_LIGHT_COUNT,
      Math.ceil(mediaAssets.length / 2),
    );
    const start = -hallwayLength / 2 + 8;
    const step = Math.max(6, hallwayLength / Math.max(count - 1, 1));
    return Array.from({ length: count }, (_, index) => start + index * step);
  }, [hallwayLength, isFeaturedMemory, mediaAssets.length]);

  const featuredMedia = useMemo<HallwayMedia[]>(() => {
    if (!isFeaturedMemory) return SAMPLE_MEMORIES.map((memory) => ({ ...memory }));

    const startZ = -hallwayLength / 2 + 10;
    return mediaAssets.map((asset, index) => {
      const x = index % 2 === 0 ? -4.7 : 4.7;
      const z = startZ + index * SPECIAL_HALLWAY_SPACING;
      return {
        id: `${asset.title}-${index}`,
        title: asset.title,
        url: asset.src,
        position: [x, 2.6, z],
        rotation: [0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0],
        description: "",
        asset,
      };
    });
  }, [hallwayLength, isFeaturedMemory, mediaAssets]);

  const externalHallwayMedia = useMemo(() => {
    if (!externalMedia) return [];

    const imageSlots: ExternalMediaSlot[] = [
      {
        id: `${activeZone?.id ?? "poi"}-image-0`,
        kind: "image",
        url: externalMedia.images[0],
        fallbackUrl: FALLBACK_IMAGE_POOL[0],
        title: activeZone?.name ?? "Punto di interesse",
        position: [-5 - EXTERNAL_WALL_OFFSET, 2.35, -12],
        rotation: [0, Math.PI / 2, 0],
      },
      {
        id: `${activeZone?.id ?? "poi"}-image-1`,
        kind: "image",
        url: externalMedia.images[1],
        fallbackUrl: FALLBACK_IMAGE_POOL[1],
        title: activeZone?.name ?? "Punto di interesse",
        position: [5 + EXTERNAL_WALL_OFFSET, 2.35, 0],
        rotation: [0, -Math.PI / 2, 0],
      },
      {
        id: `${activeZone?.id ?? "poi"}-image-2`,
        kind: "image",
        url: externalMedia.images[2],
        fallbackUrl: FALLBACK_IMAGE_POOL[2],
        title: activeZone?.name ?? "Punto di interesse",
        position: [-5 - EXTERNAL_WALL_OFFSET, 2.35, 12],
        rotation: [0, Math.PI / 2, 0],
      },
    ];

    const videoSlot: ExternalMediaSlot = {
      id: `${activeZone?.id ?? "poi"}-video`,
      kind: "video",
      youtubeEmbedUrl: externalMedia.youtubeEmbedUrl,
      title: activeZone?.name ?? "Video",
      position: [5 + EXTERNAL_WALL_OFFSET, 2.35, 24],
      rotation: [0, -Math.PI / 2, 0],
    };

    return [...imageSlots, videoSlot];
  }, [activeZone?.id, activeZone?.name, externalMedia]);

  useEffect(() => {
    const audio = hallwayAudioRef.current;
    if (!audio) return;

    if (videoPlayingCount > 0 && isFeaturedMemory) {
      audio.pause();
    } else if (!muted && unlocked && isFeaturedMemory) {
      audio.play();
    }
  }, [isFeaturedMemory, muted, unlocked, videoPlayingCount]);

  return (
    <group>
      <ambientLight intensity={isFeaturedMemory ? 0.75 : 0.5} />
      <hemisphereLight
        color="#f4d8b8"
        groundColor="#14110f"
        intensity={isFeaturedMemory ? 0.9 : 0.65}
      />

      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, 0.01, 0]}>
        <planeGeometry args={[12, hallwayLength]} />
        <meshStandardMaterial
          color={FLOOR_COLOR}
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      <mesh position={[0, ceilingHeight, 0]} receiveShadow>
        <boxGeometry args={[10.6, 0.2, hallwayLength]} />
        <meshStandardMaterial
          color={CEILING_COLOR}
          roughness={1}
          metalness={0}
        />
      </mesh>

      <mesh position={[-5, wallHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, wallHeight, hallwayLength]} />
        <meshStandardMaterial
          color={WALL_COLOR}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      <mesh position={[5, wallHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, wallHeight, hallwayLength]} />
        <meshStandardMaterial
          color={WALL_COLOR}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {ceilingLightPositions.map((z, i) => (
        <group
          key={`ceiling-light-${i}`}
          position={[0, ceilingHeight - 0.45, z]}
        >
          <pointLight
            intensity={
              isFeaturedMemory
                ? MEMORY_HALLWAY_LIGHT_INTENSITY * 1.15
                : NORMAL_HALLWAY_LIGHT_INTENSITY
            }
            distance={isFeaturedMemory ? 18 : 14}
            decay={2}
            color={isFeaturedMemory ? "#ffd8ac" : "#ffd2a0"}
          />
          <mesh>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshBasicMaterial
              color={isFeaturedMemory ? "#ffd8ac" : "#ffd2a0"}
            />
          </mesh>
        </group>
      ))}

      {isFeaturedMemory && (
        <>
          <group position={[0, 2, -4]}>
            <PositionalAudio
              ref={(audio) => {
                hallwayAudioRef.current = audio;
                if (audio) audio.setVolume(0.18);
              }}
              url="/audio/Voce_e_mille_culure.mp3"
              distance={80}
              loop
              autoplay={!muted && unlocked}
            />
          </group>
          <pointLight
            position={[0, 2.5, -hallwayLength * 0.42]}
            intensity={1.2}
            distance={30}
            color="#6bb0ff"
          />
          <pointLight
            position={[0, 2.5, hallwayLength * 0.35]}
            intensity={1.1}
            distance={24}
            color="#6bb0ff"
          />
        </>
      )}

      {isFeaturedMemory &&
        featuredMedia.map((media, index) => (
          <MediaFrame
            key={media.id}
            media={media}
            index={index}
            onVideoPlaybackChange={(isPlaying) =>
              setVideoPlayingCount((count) => count + (isPlaying ? 1 : -1))
            }
            pauseHallwayAudio={videoPlayingCount > 0}
          />
        ))}

      {hasExternalMedia && externalMedia && (
        <ExternalMediaFrames slots={externalHallwayMedia} />
      )}

      {!isFeaturedMemory && !hasExternalMedia &&
        featuredMedia.map((media, index) => (
          <MediaFrame
            key={media.id}
            media={media}
            index={index}
            onVideoPlaybackChange={(isPlaying) =>
              setVideoPlayingCount((count) => count + (isPlaying ? 1 : -1))
            }
            pauseHallwayAudio={videoPlayingCount > 0}
          />
        ))}
    </group>
  );
};

const MediaFrame = ({
  media,
  index,
  onVideoPlaybackChange,
  pauseHallwayAudio,
}: {
  media: HallwayMedia;
  index: number;
  onVideoPlaybackChange: (isPlaying: boolean) => void;
  pauseHallwayAudio: boolean;
}) => {
  if (media.asset?.type === "video") {
    return (
      <VideoFrame
        media={media}
        index={index}
        onVideoPlaybackChange={onVideoPlaybackChange}
        pauseHallwayAudio={pauseHallwayAudio}
      />
    );
  }

  return <ImageFrame media={media} index={index} />;
};

const ImageFrame = ({
  media,
  index,
}: {
  media: HallwayMedia;
  index: number;
}) => {
  return (
    <group position={media.position} rotation={media.rotation}>
      <mesh castShadow>
        <boxGeometry args={[4.35, 2.95, 0.12]} />
        <meshStandardMaterial color="#111" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[4.05, 2.55]} />
        <meshStandardMaterial color={index % 2 === 0 ? "#444" : "#333"} />
      </mesh>
      <pointLight
        position={[0, 0, 1.8]}
        intensity={isSpecialFrame(index) ? 6 : 4}
        distance={7}
        color={index % 2 === 0 ? "#ffcc88" : "#ffd9b3"}
      />
    </group>
  );
};

const VideoFrame = ({
  media,
  index,
  onVideoPlaybackChange,
  pauseHallwayAudio,
}: {
  media: HallwayMedia;
  index: number;
  onVideoPlaybackChange: (isPlaying: boolean) => void;
  pauseHallwayAudio: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoRatio, setVideoRatio] = useState(4 / 3);

  const video = useMemo(() => {
    const element = document.createElement("video");
    element.src = media.url;
    element.loop = true;
    element.muted = false;
    element.playsInline = true;
    element.preload = "metadata";
    element.crossOrigin = "anonymous";
    element.pause();
    videoRef.current = element;
    return element;
  }, [media.url]);

  const texture = useMemo(() => new THREE.VideoTexture(video), [video]);

  useEffect(() => {
    const updateRatio = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setVideoRatio(video.videoWidth / video.videoHeight);
      }
    };

    const handleLoadedMetadata = () => updateRatio();
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    updateRatio();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [video]);

  useEffect(() => {
    return () => {
      texture.dispose();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [texture, video]);

  const togglePlayback = () => {
    if (video.paused) {
      void video.play();
      onVideoPlaybackChange(true);
    } else {
      video.pause();
      onVideoPlaybackChange(false);
    }
  };

  useEffect(() => {
    if (pauseHallwayAudio) video.pause();
  }, [pauseHallwayAudio, video]);

  const frameHeight = 2.55;
  const contentBounds = useMemo(() => {
    if (videoRatio >= 1) {
      const width = 4.0;
      return { width, height: width / videoRatio };
    }

    const height = 2.45;
    return { width: height * videoRatio, height };
  }, [videoRatio]);
  const frameWidth = contentBounds.width + 0.28;

  return (
    <group position={media.position} rotation={media.rotation}>
      <mesh>
        <boxGeometry args={[frameWidth + 0.28, frameHeight + 0.28, 0.18]} />
        <meshStandardMaterial
          color="#ff2a2a"
          emissive="#ff2a2a"
          emissiveIntensity={0.8}
          transparent
          opacity={0.25}
        />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[frameWidth + 0.1, frameHeight + 0.1, 0.14]} />
        <meshStandardMaterial color="#6a1616" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.08]} onClick={togglePlayback}>
        <planeGeometry args={[contentBounds.width, contentBounds.height]} />
        <meshStandardMaterial map={texture} roughness={0.5} metalness={0.02} />
      </mesh>
      <pointLight
        position={[0, 0, 1.8]}
        intensity={6}
        distance={7}
        color="#9fd3ff"
      />
      <mesh position={[1.55, 1.02, 0.14]} onClick={togglePlayback}>
        <boxGeometry args={[0.65, 0.34, 0.02]} />
        <meshStandardMaterial
          color="#ff3b30"
          emissive="#ff3b30"
          emissiveIntensity={1.6}
        />
      </mesh>
    </group>
  );
};

const ExternalMediaFrames = ({ slots }: { slots: ExternalMediaSlot[] }) => {
  return (
    <>
      {slots.map((slot, index) =>
        slot.kind === "image" ? (
          <ExternalImageFrame key={slot.id} image={slot} index={index} />
        ) : (
          <ExternalVideoFrame key={slot.id} slot={slot} />
        ),
      )}
    </>
  );
};

const ExternalImageFrame = ({
  image,
  index,
}: {
  image: Extract<ExternalMediaSlot, { kind: "image" }>;
  index: number;
}) => {
  return (
    <group position={image.position} rotation={image.rotation}>
      <mesh castShadow>
        <boxGeometry args={[4.35, 2.95, 0.12]} />
        <meshStandardMaterial color="#111" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[4.05, 2.55]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <Html center distanceFactor={13} transform>
        <ExternalImageContent
          src={image.url}
          fallbackUrl={image.fallbackUrl}
          title={image.title}
        />
      </Html>
      <pointLight
        position={[0, 0, 1.8]}
        intensity={isSpecialFrame(index) ? 6 : 4}
        distance={7}
        color={index % 2 === 0 ? "#ffcc88" : "#ffd9b3"}
      />
    </group>
  );
};

const ExternalImageContent = ({
  src,
  fallbackUrl,
  title,
}: {
  src: string;
  fallbackUrl: string;
  title: string;
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    let cancelled = false;
    const probe = new window.Image();
    probe.onload = () => {
      if (!cancelled) setCurrentSrc(src);
    };
    probe.onerror = () => {
      if (!cancelled) setCurrentSrc(fallbackUrl);
    };
    probe.src = src;

    return () => {
      cancelled = true;
    };
  }, [fallbackUrl, src]);

  return (
    <img
      alt={title}
      src={currentSrc}
      onError={() => setCurrentSrc(fallbackUrl)}
      style={{
        width: "350px",
        height: "219px",
        objectFit: "cover",
        borderRadius: "6px",
        display: "block",
        boxShadow: "0 0 0 2px rgba(255,255,255,0.06)",
      }}
    />
  );
};

const ExternalVideoFrame = ({
  slot,
}: {
  slot: Extract<ExternalMediaSlot, { kind: "video" }>;
}) => {
  return (
    <group position={slot.position} rotation={slot.rotation}>
      <mesh castShadow>
        <boxGeometry args={[4.35, 2.95, 0.12]} />
        <meshStandardMaterial color="#111" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[4.05, 2.55]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <Html center distanceFactor={13} transform>
        <iframe
          title={slot.title}
          src={slot.youtubeEmbedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "350px",
            height: "219px",
            border: "0",
            borderRadius: "10px",
            display: "block",
          }}
        />
      </Html>
      <pointLight
        position={[0, 0, 1.8]}
        intensity={6}
        distance={7}
        color="#9fd3ff"
      />
    </group>
  );
};

const isSpecialFrame = (index: number) => index % 2 === 0;
