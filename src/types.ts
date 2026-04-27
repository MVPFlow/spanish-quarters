export interface Zone {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
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
