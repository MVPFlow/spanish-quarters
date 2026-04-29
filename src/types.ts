export interface Zone {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  type?: "memory" | "poi";
  featured?: boolean;
  district?: string;
}

export interface MemoryMedia {
  id: string;
  url: string;
  title: string;
  description: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export type ViewState = "aerial" | "transitioning" | "inside";
