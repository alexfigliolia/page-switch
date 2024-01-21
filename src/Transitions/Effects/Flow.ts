import { Effect } from "./Effect";
import type { BaseEffect, Name, TransitionParams } from "./types";

export class Flow extends Effect implements BaseEffect {
  public create(name: Name) {
    return (...params: TransitionParams) => {
      this.instance[`flowCoverIn${name}`](...params);
    };
  }
}
