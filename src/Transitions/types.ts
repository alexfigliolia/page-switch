export type CurrentTransition = (
  currentPage: HTMLElement,
  currentPosition: number,
  nextPage?: HTMLElement,
  nextPosition?: number
) => void;

export type NextTransition = (
  currentPage: HTMLElement,
  currentPosition: number,
  nextPage: HTMLElement,
  nextPosition: number
) => void;

export type TransitionFN = CurrentTransition | NextTransition;

export interface ITransitions {
  fade: TransitionFN;
  slice: TransitionFN;
  sliceX: TransitionFN;
  sliceY: TransitionFN;
  scroll: TransitionFN;
  scrollX: TransitionFN;
  scrollY: TransitionFN;
  scroll3d: TransitionFN;
  scroll3dX: TransitionFN;
  scroll3dY: TransitionFN;
  scrollCover: TransitionFN;
  scrollCoverX: TransitionFN;
  scrollCoverY: TransitionFN;
  scrollCoverReverse: TransitionFN;
  scrollCoverReverseX: TransitionFN;
  scrollCoverReverseY: TransitionFN;
  scrollCoverIn: TransitionFN;
  scrollCoverInX: TransitionFN;
  scrollCoverInY: TransitionFN;
  scrollCoverOut: TransitionFN;
  scrollCoverOutX: TransitionFN;
  scrollCoverOutY: TransitionFN;
  slide: TransitionFN;
  slideX: TransitionFN;
  slideY: TransitionFN;
  slideCover: TransitionFN;
  slideCoverX: TransitionFN;
  slideCoverY: TransitionFN;
  slideCoverReverse: TransitionFN;
  slideCoverReverseX: TransitionFN;
  slideCoverReverseY: TransitionFN;
  slideCoverIn: TransitionFN;
  slideCoverInX: TransitionFN;
  slideCoverInY: TransitionFN;
  slideCoverOut: TransitionFN;
  slideCoverOutX: TransitionFN;
  slideCoverOutY: TransitionFN;
  flow: TransitionFN;
  flowX: TransitionFN;
  flowY: TransitionFN;
  flowCover: TransitionFN;
  flowCoverX: TransitionFN;
  flowCoverY: TransitionFN;
  flowCoverReverse: TransitionFN;
  flowCoverReverseX: TransitionFN;
  flowCoverReverseY: TransitionFN;
  flowCoverIn: TransitionFN;
  flowCoverInX: TransitionFN;
  flowCoverInY: TransitionFN;
  flowCoverOut: TransitionFN;
  flowCoverOutX: TransitionFN;
  flowCoverOutY: TransitionFN;
  zoom: TransitionFN;
  zoomX: TransitionFN;
  zoomY: TransitionFN;
  zoomCover: TransitionFN;
  zoomCoverX: TransitionFN;
  zoomCoverY: TransitionFN;
  zoomCoverReverse: TransitionFN;
  zoomCoverReverseX: TransitionFN;
  zoomCoverReverseY: TransitionFN;
  zoomCoverIn: TransitionFN;
  zoomCoverInX: TransitionFN;
  zoomCoverInY: TransitionFN;
  zoomCoverOut: TransitionFN;
  zoomCoverOutX: TransitionFN;
  zoomCoverOutY: TransitionFN;
  skew: TransitionFN;
  skewX: TransitionFN;
  skewY: TransitionFN;
  skewCover: TransitionFN;
  skewCoverX: TransitionFN;
  skewCoverY: TransitionFN;
  skewCoverReverse: TransitionFN;
  skewCoverReverseX: TransitionFN;
  skewCoverReverseY: TransitionFN;
  skewCoverIn: TransitionFN;
  skewCoverInX: TransitionFN;
  skewCoverInY: TransitionFN;
  skewCoverOut: TransitionFN;
  skewCoverOutX: TransitionFN;
  skewCoverOutY: TransitionFN;
  flip: TransitionFN;
  flipX: TransitionFN;
  flipY: TransitionFN;
  flip3d: TransitionFN;
  flip3dX: TransitionFN;
  flip3dY: TransitionFN;
  flipCoverReverse: TransitionFN;
  flipCoverReverseX: TransitionFN;
  flipCoverReverseY: TransitionFN;
  flipClock: TransitionFN;
  flipClockX: TransitionFN;
  flipClockY: TransitionFN;
  flipCover: TransitionFN;
  flipCoverX: TransitionFN;
  flipCoverY: TransitionFN;
  flipPaper: TransitionFN;
  flipPaperX: TransitionFN;
  flipPaperY: TransitionFN;
  flipCoverIn: TransitionFN;
  flipCoverInX: TransitionFN;
  flipCoverInY: TransitionFN;
  flipCoverOut: TransitionFN;
  flipCoverOutX: TransitionFN;
  flipCoverOutY: TransitionFN;
  bomb: TransitionFN;
  bombX: TransitionFN;
  bombY: TransitionFN;
  bombCover: TransitionFN;
  bombCoverX: TransitionFN;
  bombCoverY: TransitionFN;
  bombCoverReverse: TransitionFN;
  bombCoverReverseX: TransitionFN;
  bombCoverReverseY: TransitionFN;
  bombCoverIn: TransitionFN;
  bombCoverInX: TransitionFN;
  bombCoverInY: TransitionFN;
  bombCoverOut: TransitionFN;
  bombCoverOutX: TransitionFN;
  bombCoverOutY: TransitionFN;
}

export type Transition = Extract<keyof ITransitions, string> | TransitionFN;