/* eslint-disable no-var */

declare var webkitRequestAnimationFrame:
  | undefined
  | ((callback: (time: number) => void) => void);
declare var mozRequestAnimationFrame:
  | undefined
  | ((callback: (time: number) => void) => void);
declare var msRequestAnimationFrame:
  | undefined
  | ((callback: (time: number) => void) => void);

declare var webkitCancelAnimationFrame: undefined | ((time: number) => void);
declare var webkitCancelRequestAnimationFrame:
  | undefined
  | ((time: number) => void);
declare var mozCancelRequestAnimationFrame:
  | undefined
  | ((time: number) => void);
declare var msCancelRequestAnimationFrame: undefined | ((time: number) => void);
