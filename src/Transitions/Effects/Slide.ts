import { Effect } from "./Effect";
import type { BaseEffect, Name, NextTransition } from "./types";

export class Slide extends Effect implements BaseEffect {
  public create(name: Name) {
    return (...args: Parameters<NextTransition>) => {
      this.instance[`slideCoverReverse${name}`](...args);
    };
  }
}
