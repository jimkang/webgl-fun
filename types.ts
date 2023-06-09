export type Pair = number[];
export interface Pt {
  x: number;
  y: number;
}
export interface Pt3 extends Pt {
  z: number;
}

export interface BoxSize {
  width: number;
  height: number;
}
export type Box = Pt & BoxSize;
