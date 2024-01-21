export type EaseString =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "bounce";

export type EasingFN = (
  current: number,
  begin: number,
  changed: number,
  duration: number
) => number;
