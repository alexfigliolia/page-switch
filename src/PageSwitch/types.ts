import type { EaseString, EasingFN } from "Easing";
import type { Transition } from "Transitions";

export interface IOptions {
  start: number;
  frozen: boolean;
  arrowKey: boolean;
  playing: boolean;
  interval: number;
  mousewheel: boolean;
  mouse: boolean;
  loop: boolean;
  current: number;
  direction: 0 | 1;
  duration: number;
  autoplay: boolean;
  freeze: boolean;
  transition: Transition;
  ease: EaseString | EasingFN;
}

export type IDOrElement = string | HTMLElement;

export interface PageDatum {
  percent: number;
  cssText: string;
}

export type Rect = [x: number, y: number];

export type PageSwitchEvents = {
  before: (current: number, previous: number) => void;
  after: (current: number, previous: number) => void;
  update: (
    currentPage: HTMLElement,
    currentPosition: number,
    nextPage?: HTMLElement,
    nextPosition?: number
  ) => void;
  dragStart: (event: Record<string, any>) => void;
  dragMove: (event: Record<string, any>) => void;
  dragEnd: (event: Record<string, any>) => void;
};

export type PageSwitchEvent = Extract<keyof PageSwitchEvents, string>;

export type ListenerCache = Record<
  string,
  (string | ((...args: any[]) => void))[]
>;