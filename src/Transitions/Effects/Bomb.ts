import { BrowserSupport } from "BrowserSupport";
import { Effect } from "./Effect";
import type { BaseEffect, Name, TransitionParams } from "./types";

export class Bomb extends Effect implements BaseEffect {
  public create(name: Name) {
    return (...params: TransitionParams) => {
      if (!BrowserSupport.transform) {
        return this.instance[`scroll${name}`](...params);
      }
      const [currentPage, currentPosition, nextPage] = params;
      const zIndex = Number(Math.abs(currentPosition) < 0.5);
      const val = Math.abs(1 - Math.abs(currentPosition) * 2);
      currentPage.style[BrowserSupport.transform] = `scale${name}(${2 - val})${
        this.fire3D
      }`;
      currentPage.style.opacity = `${zIndex ? val : 0}`;
      currentPage.style.zIndex = `${zIndex}`;
      if (nextPage) {
        nextPage.style[BrowserSupport.transform] = `scale${name}(${2 - val})${
          this.fire3D
        }`;
        nextPage.style.opacity = `${zIndex ? 0 : val}`;
        nextPage.style.zIndex = `${1 - zIndex}`;
      }
    };
  }
}
