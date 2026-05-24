export type vec2 = [number, number];
export type vec3 = [number, number, number];
export type vec4 = [number, number, number, number];

export interface IVec2 {
  x: number;
  y: number;
}

export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function circleSquare(radius: number) {
  return Math.PI * radius * radius;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function arraysEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function arraysEqualIgnoreOrder<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((value) => b.includes(value));
}

export function shuffleCopy<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const PI_MUL_2 = 2 * Math.PI;
export const PI_DIV_2 = Math.PI / 2;
export const PI_DIV_4 = Math.PI / 4;
export const PI_DIV_8 = Math.PI / 8;
export const PI_DIV_16 = Math.PI / 16;
