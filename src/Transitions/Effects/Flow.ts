import { Effect } from "./Effect";
import type { BaseEffect, Name, NextTransition } from "./types";

export class Flow extends Effect implements BaseEffect {
  public create(name: Name) {
    return (...args: Parameters<NextTransition>) => {
      this.instance[`flowCoverIn${name}`](...args);
    };
  }
}
