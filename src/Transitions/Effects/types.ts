import type { Options } from "PageSwitch";
import type { Transitions } from "../Transitions";

export type EffectParams = [PW: Options, instance: Transitions];
export type Modifier = "" | "Reverse" | "In" | "Out";
export type Name = "" | "X" | "Y";

export type TransitionFN = (
  currentPage: HTMLElement,
  currentPosition: number,
  nextPage: HTMLElement,
  nextPosition: number
) => void;

export type TransitionParams = Parameters<TransitionFN>;

export interface BaseEffect {
  PW: Options;
  instance: Transitions;
  create: (name: Name) => TransitionFN;
}

export interface AbstractEffect {
  PW: Options;
  instance: Transitions;
  create: (name: Name, type: Modifier) => TransitionFN;
}
