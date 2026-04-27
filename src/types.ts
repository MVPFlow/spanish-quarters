export interface Zone {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
}

export type ViewState = "aerial" | "transitioning" | "inside";
