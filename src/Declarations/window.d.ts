declare interface Window {
  webkitCancelAnimationFrame?: (time: number) => void;
  webkitCancelRequestAnimationFrame?: (time: number) => void;
  mozCancelRequestAnimationFrame?: (time: number) => void;
  msCancelRequestAnimationFrame?: (time: number) => void;
  webkitRequestAnimationFrame?: (callback: (time: number) => void) => void;
  mozRequestAnimationFrame?: (callback: (time: number) => void) => void;
  msRequestAnimationFrame?: (callback: (time: number) => void) => void;
}
