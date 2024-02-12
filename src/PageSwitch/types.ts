import type { EaseString, EasingFN } from "Easing";
import type { PWEvent } from "Events";
import type { Transition } from "Transitions";

export interface IOptions {
  start: number;
  arrowKey: boolean;
  interval: number;
  mousewheel: boolean;
  mouse: boolean;
  loop: boolean;
  direction: 0 | 1;
  duration: number;
  autoplay: boolean;
  frozen: boolean;
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
  before: (current: number, next: number) => void;
  after: (current: number, previous: number) => void;
  update: (
    currentPage: HTMLElement,
    currentPosition: number,
    nextPage?: HTMLElement,
    nextPosition?: number
  ) => void;
  dragStart: (event: PWEvent) => void;
  dragMove: (event: PWEvent) => void;
  dragEnd: (event: PWEvent) => void;
};

export type PageSwitchEvent = Extract<keyof PageSwitchEvents, string>;

export type ListenerCache = Record<
  string,
  (string | ((...args: any[]) => void))[]
>;
