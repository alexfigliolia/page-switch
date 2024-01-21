import { Effect } from "./Effect";
import type { BaseEffect, Name, TransitionParams } from "./types";

export class Slide extends Effect implements BaseEffect {
  public create(name: Name) {
    return (...params: TransitionParams) => {
      this.instance[`slideCoverReverse${name}`](...params);
    };
  }
}
