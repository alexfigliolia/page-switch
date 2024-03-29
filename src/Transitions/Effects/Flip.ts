import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name, TransitionParams } from "./types";

export class Flip extends Effect implements BaseEffect {
  public create(name: Name) {
    return (...params: TransitionParams) => {
      if (!BrowserSupport.perspective) {
        return this.instance[`scroll${name}`](...params);
      }
      const [currentPage, currentPosition, nextPage, nextPosition] = params;
      const prop = name || ["X", "Y"][1 - this.PW.direction];
      const fix = prop == "X" ? -1 : 1;
      currentPage.style[BrowserSupport.backfaceVisibility] = "hidden";
      currentPage.style[
        BrowserSupport.transform
      ] = `perspective(1000px) rotate${prop}(${
        currentPosition * 180 * fix
      }deg)${this.fire3D}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.backfaceVisibility] = "hidden";
        nextPage.style[
          BrowserSupport.transform
        ] = `perspective(1000px) rotate${prop}(${nextPosition * 180 * fix}deg)${
          this.fire3D
        }`;
      }
    };
  }
}
